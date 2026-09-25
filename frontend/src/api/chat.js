// src/api/chat.js
import client from './client';

export const chatApi = {
  listSessions: () =>
    client.get('/chat/sessions').then((r) => r.data.sessions),

  createSession: () =>
    client.post('/chat/sessions', {}).then((r) => r.data.session),

  listMessages: (sessionId) =>
    client
      .get(`/chat/sessions/${sessionId}/messages`)
      .then((r) => r.data.messages),

  sendMessage: (sessionId, message) =>
    client
      .post(`/chat/sessions/${sessionId}/messages`, { message })
      .then((r) => r.data),
};