/**
 * DailyLog Controller - Create, list, delete daily logs
 */

const DailyLog = require('../models/DailyLog');
const Baby = require('../models/Baby');

const verifyBabyOwnership = async (babyId, userId, role) => {
  const baby = await Baby.findById(babyId);
  if (!baby) return { error: 'Baby not found', status: 404 };
  if (baby.user_id.toString() !== userId && role !== 'Admin') {
    return { error: 'Not authorized', status: 403 };
  }
  return { baby };
};

const createLog = async (req, res) => {
  try {
    const check = await verifyBabyOwnership(req.params.babyId, req.user.id, req.user.role);
    if (check.error) return res.status(check.status).json({ success: false, message: check.error });

    const log = await DailyLog.create({ ...req.body, baby_id: req.params.babyId, logged_by: req.user.id });
    res.status(201).json({ success: true, message: 'Log created', data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getLogs = async (req, res) => {
  try {
    const check = await verifyBabyOwnership(req.params.babyId, req.user.id, req.user.role);
    if (check.error) return res.status(check.status).json({ success: false, message: check.error });

    const logs = await DailyLog.find({ baby_id: req.params.babyId }).sort({ logged_at: -1 }).limit(50);
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const deleteLog = async (req, res) => {
  try {
    const log = await DailyLog.findById(req.params.id);
    if (!log) return res.status(404).json({ success: false, message: 'Log not found' });

    const check = await verifyBabyOwnership(log.baby_id, req.user.id, req.user.role);
    if (check.error) return res.status(check.status).json({ success: false, message: check.error });

    await log.deleteOne();
    res.status(200).json({ success: true, message: 'Log deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { createLog, getLogs, deleteLog };