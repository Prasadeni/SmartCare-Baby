// src/api/history.js
import client from './client';

export const historyApi = {
  get: (babyId) =>
    client
      .get(`/history${babyId ? `?babyId=${babyId}` : ''}`)
      .then((r) => r.data),

  addNote: (payload) =>
    client.post('/history/notes', payload).then((r) => r.data.note),

  deleteNote: (id) =>
    client.delete(`/history/notes/${id}`).then((r) => r.data),
};