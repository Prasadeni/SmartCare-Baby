import express from 'express';
import ChatSession from '../models/ChatSession.js';
import ChatMessage from '../models/ChatMessage.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/helpers.js';
import { generateBotReply } from '../services/rag.js';

const router = express.Router();

function toPublicSession(s) {
  return {
    id: s._id.toString(),
    userId: s.userId.toString(),
    startedAt: s.startedAt,
    endedAt: s.endedAt,
    sessionStatus: s.sessionStatus,
  };
}

function toPublicMessage(m) {
  return {
    id: m._id.toString(),
    chatSessionId: m.chatSessionId.toString(),
    sender: m.sender,
    message: m.message,
    sentAt: m.sentAt,
  };
}

// GET /api/chat/sessions
router.get(
  '/sessions',
  requireAuth,
  asyncHandler(async (req, res) => {
    const sessions = await ChatSession.find({ userId: req.user._id }).sort({ startedAt: -1 });
    res.json({ sessions: sessions.map(toPublicSession) });
  })
);

// POST /api/chat/sessions
router.post(
  '/sessions',
  requireAuth,
  asyncHandler(async (req, res) => {
    const session = await ChatSession.create({ userId: req.user._id });
    await ChatMessage.create({
      chatSessionId: session._id,
      sender: 'Bot',
      message: "Hi! I'm SmartCare AI. Ask me anything about your baby's health, milestones, or pregnancy. 💙",
    });
    res.status(201).json({ session: toPublicSession(session) });
  })
);

// GET /api/chat/sessions/:id/messages
router.get(
  '/sessions/:id/messages',
  requireAuth,
  asyncHandler(async (req, res) => {
    const session = await ChatSession.findById(req.params.id);
    if (!session || session.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Session not found' });
    }
    const messages = await ChatMessage.find({ chatSessionId: session._id }).sort({ sentAt: 1 });
    res.json({ messages: messages.map(toPublicMessage) });
  })
);

// POST /api/chat/sessions/:id/messages
router.post(
  '/sessions/:id/messages',
  requireAuth,
  asyncHandler(async (req, res) => {
    const session = await ChatSession.findById(req.params.id);
    if (!session || session.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const userText = req.body.message || '';
    if (!userText.trim()) {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    const userMsg = await ChatMessage.create({
      chatSessionId: session._id,
      sender: 'User',
      message: userText,
    });

    const botText = await generateBotReply(userText);
    const botMsg = await ChatMessage.create({
      chatSessionId: session._id,
      sender: 'Bot',
      message: botText,
    });

    res.status(201).json({
      userMessage: toPublicMessage(userMsg),
      botMessage: toPublicMessage(botMsg),
    });
  })
);

export default router;