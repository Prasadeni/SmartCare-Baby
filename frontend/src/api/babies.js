
// src/api/babies.js
import client from './client';

export const babiesApi = {
  list: () => client.get('/babies').then((r) => r.data.babies),
  get: (id) => client.get(`/babies/${id}`).then((r) => r.data.baby),
  create: (payload) =>
    client.post('/babies', payload).then((r) => r.data.baby),
  update: (id, payload) =>
    client.put(`/babies/${id}`, payload).then((r) => r.data.baby),
  remove: (id) => client.delete(`/babies/${id}`).then((r) => r.data),
};