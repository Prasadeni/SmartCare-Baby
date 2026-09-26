// src/api/auth.js
import client from './client';

export const authApi = {
  register: (payload) =>
    client.post('/auth/register', payload).then((r) => r.data),

  login: (email, password) =>
    client.post('/auth/login', { email, password }).then((r) => r.data),

  me: () => client.get('/auth/me').then((r) => r.data),

  logout: () => client.post('/auth/logout').then((r) => r.data),

  forgotPassword: (email) =>
    client.post('/auth/forgot-password', { email }).then((r) => r.data),

  resetPassword: (token, newPassword) =>
    client
      .post('/auth/reset-password', { token, newPassword })
      .then((r) => r.data),
};