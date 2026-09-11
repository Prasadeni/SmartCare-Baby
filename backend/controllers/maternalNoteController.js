/**
 * Maternal Note Controller - SmartCare Baby
 */

const MaternalNote = require('../models/MaternalNote');
const Baby = require('../models/Baby');

const verifyBaby = async (babyId, userId, role) => {
  const baby = await Baby.findById(babyId);
  if (!baby) return { error: 'Baby not found', status: 404 };
  if (baby.user_id.toString() !== userId && role !== 'Admin') {
    return { error: 'Not authorized', status: 403 };
  }
  return { baby };
};

// @desc    Create a maternal note
// @route   POST /api/notes/:babyId
const createNote = async (req, res) => {
  try {
    const check = await verifyBaby(req.params.babyId, req.user.id, req.user.role);
    if (check.error) return res.status(check.status).json({ success: false, message: check.error });

    const { note_text } = req.body;
    if (!note_text) {
      return res.status(400).json({ success: false, message: 'Please provide note_text' });
    }

    const note = await MaternalNote.create({
      baby_id: req.params.babyId,
      user_id: req.user.id,
      note_text,
    });

    res.status(201).json({ success: true, message: 'Note added', data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all notes for a baby
// @route   GET /api/notes/:babyId
const getNotes = async (req, res) => {
  try {
    const check = await verifyBaby(req.params.babyId, req.user.id, req.user.role);
    if (check.error) return res.status(check.status).json({ success: false, message: check.error });

    const notes = await MaternalNote.find({ baby_id: req.params.babyId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: notes.length, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/note/:id
const deleteNote = async (req, res) => {
  try {
    const note = await MaternalNote.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

    const check = await verifyBaby(note.baby_id, req.user.id, req.user.role);
    if (check.error) return res.status(check.status).json({ success: false, message: check.error });

    await note.deleteOne();
    res.status(200).json({ success: true, message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { createNote, getNotes, deleteNote };