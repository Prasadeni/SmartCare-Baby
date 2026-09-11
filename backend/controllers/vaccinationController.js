/**
 * Vaccination Controller - SmartCare Baby
 * Groups vaccine schedules by checkup age and merges with administered records
 */

const VaccinationSchedule = require('../models/VaccinationSchedule');
const VaccinationRecord = require('../models/VaccinationRecord');
const Baby = require('../models/Baby');

const verifyBaby = async (babyId, userId, role) => {
  const baby = await Baby.findById(babyId);
  if (!baby) return { error: 'Baby not found', status: 404 };
  if (baby.user_id.toString() !== userId && role !== 'Admin') {
    return { error: 'Not authorized', status: 403 };
  }
  return { baby };
};

const calcAgeMonths = (dob) => {
  const now = new Date();
  const birth = new Date(dob);
  return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
};

const ageLabel = (months) => {
  if (months === 0) return 'Birth';
  if (months === 1) return '1-Month Checkup';
  return `${months}-Month Checkup`;
};

// @desc    Get vaccination schedule grouped by checkup age
// @route   GET /api/vaccinations/:babyId/schedule
const getVaccinationSchedule = async (req, res) => {
  try {
    const check = await verifyBaby(req.params.babyId, req.user.id, req.user.role);
    if (check.error) return res.status(check.status).json({ success: false, message: check.error });

    const babyAgeMonths = calcAgeMonths(check.baby.dob);
    const babyDob = new Date(check.baby.dob);

    // Get all active vaccines
    const vaccines = await VaccinationSchedule.find({ is_active: true }).sort({ due_age_months: 1 });

    // Get administered records for this baby
    const records = await VaccinationRecord.find({ baby_id: req.params.babyId });
    const administeredMap = {};
    records.forEach((r) => {
      administeredMap[r.vaccine_schedule_id.toString()] = {
        date: r.administered_date,
        batch: r.batch_number,
      };
    });

    // Group by due_age_months
    const groups = {};
    vaccines.forEach((v) => {
      const key = v.due_age_months;
      if (!groups[key]) {
        groups[key] = {
          checkup_age_months: key,
          checkup_label: ageLabel(key),
          vaccines: [],
        };
      }
      groups[key].vaccines.push(v);
    });

    // Build the response cards
    const cards = Object.values(groups).map((group) => {
      const dueAge = group.checkup_age_months;
      const dueDate = new Date(babyDob);
      dueDate.setMonth(dueDate.getMonth() + dueAge);

      const administered = [];
      const required = [];

      group.vaccines.forEach((v) => {
        const rec = administeredMap[v._id.toString()];
        if (rec) {
          administered.push({
            vaccine_name: v.vaccine_name,
            dose_number: v.dose_number,
            administered_date: rec.date,
          });
        } else {
          required.push({
            vaccine_id: v._id,
            vaccine_name: v.vaccine_name,
            dose_number: v.dose_number,
          });
        }
      });

      // Determine status
      let status = 'UPCOMING';
      let action_needed = false;

      if (administered.length === group.vaccines.length) {
        status = 'COMPLETED';
      } else if (dueAge <= babyAgeMonths) {
        status = 'DUE_SOON';
        action_needed = true;
      } else if (dueAge - babyAgeMonths <= 2) {
        status = 'DUE_SOON';
        action_needed = true;
      }

      return {
        checkup_label: group.checkup_label,
        due_date: dueDate.toISOString().split('T')[0],
        status,
        action_needed,
        administered_vaccines: administered,
        required_vaccines: required,
      };
    });

    res.status(200).json({
      success: true,
      baby: {
        name: check.baby.name,
        age_months: babyAgeMonths,
        dob: check.baby.dob,
      },
      cards,
    });
  } catch (error) {
    console.error('[Vaccination Schedule Error]:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Mark a vaccine as administered
// @route   POST /api/vaccinations/:babyId/record
const recordVaccination = async (req, res) => {
  try {
    const check = await verifyBaby(req.params.babyId, req.user.id, req.user.role);
    if (check.error) return res.status(check.status).json({ success: false, message: check.error });

    const { vaccine_schedule_id, administered_date, administered_by, batch_number, notes } = req.body;

    if (!vaccine_schedule_id || !administered_date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide vaccine_schedule_id and administered_date',
      });
    }

    const record = await VaccinationRecord.create({
      baby_id: req.params.babyId,
      vaccine_schedule_id,
      administered_date,
      administered_by: administered_by || '',
      batch_number: batch_number || '',
      notes: notes || '',
    });

    res.status(201).json({ success: true, message: 'Vaccine recorded', data: record });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'This vaccine is already recorded for this baby' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { getVaccinationSchedule, recordVaccination };