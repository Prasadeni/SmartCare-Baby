/**
 * Baby Controller - SmartCare Baby
 * Handles CRUD operations for baby profiles (ownership enforced per user)
 */

const Baby = require('../models/Baby');

const createBaby = async (req, res) => {
  try {
    const {
      name, dob, gender, birth_weight_kg, birth_height_cm,
      gestational_age_weeks, blood_group, medical_notes,
    } = req.body;

    if (!name || !dob || !gender) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, date of birth, and gender',
      });
    }

    const baby = await Baby.create({
      user_id: req.user.id,
      name, dob, gender,
      birth_weight_kg: birth_weight_kg !== undefined ? Number(birth_weight_kg) : null,
      birth_height_cm: birth_height_cm !== undefined ? Number(birth_height_cm) : null,
      gestational_age_weeks: gestational_age_weeks !== undefined ? Number(gestational_age_weeks) : 40,
      blood_group: blood_group || 'Unknown',
      medical_notes: medical_notes || '',
    });

    res.status(201).json({ success: true, message: 'Baby profile created successfully', data: baby });
  } catch (error) {
    console.error('[Create Baby Error]:', error);
    res.status(500).json({ success: false, message: 'Server error creating baby profile', error: error.message });
  }
};

const getBabies = async (req, res) => {
  try {
    const babies = await Baby.find({ user_id: req.user.id }).sort({ dob: -1 });
    res.status(200).json({ success: true, count: babies.length, data: babies });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching baby profiles', error: error.message });
  }
};

const getBabyById = async (req, res) => {
  try {
    const baby = await Baby.findById(req.params.id);
    if (!baby) return res.status(404).json({ success: false, message: 'Baby profile not found' });

    if (baby.user_id.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to access this baby profile' });
    }

    res.status(200).json({ success: true, data: baby });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching baby profile', error: error.message });
  }
};

const updateBaby = async (req, res) => {
  try {
    let baby = await Baby.findById(req.params.id);
    if (!baby) return res.status(404).json({ success: false, message: 'Baby profile not found' });

    if (baby.user_id.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this baby profile' });
    }

    baby = await Baby.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Baby profile updated successfully', data: baby });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating baby profile', error: error.message });
  }
};

const deleteBaby = async (req, res) => {
  try {
    const baby = await Baby.findById(req.params.id);
    if (!baby) return res.status(404).json({ success: false, message: 'Baby profile not found' });

    if (baby.user_id.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this baby profile' });
    }

    await baby.deleteOne();
    res.status(200).json({ success: true, message: 'Baby profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting baby profile', error: error.message });
  }
};

module.exports = { createBaby, getBabies, getBabyById, updateBaby, deleteBaby };