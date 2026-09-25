// src/api/users.js
import client from './client';

export const usersApi = {
  getMe: () => client.get('/users/me').then((r) => r.data.user),
  updateMe: (payload) =>
    client.put('/users/me', payload).then((r) => r.data.user),
};