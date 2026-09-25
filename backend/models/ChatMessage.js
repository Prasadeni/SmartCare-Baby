import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    chatSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatSession', required: true, index: true },
    sender: { type: String, enum: ['User', 'Bot'], required: true },
    message: { type: String, required: true },
    intentIdentified: { type: String, default: null },
    knowledgeBaseId: { type: mongoose.Schema.Types.ObjectId, default: null },
    sentAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

schema.index({ chatSessionId: 1, sentAt: 1 });

export default mongoose.model('ChatMessage', schema);