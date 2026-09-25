// src/api/growth.js
import client from './client';

export const growthApi = {
  list: (babyId) =>
    client
      .get(`/growth${babyId ? `?babyId=${babyId}` : ''}`)
      .then((r) => r.data.records),

  create: (payload) =>
    client.post('/growth', payload).then((r) => r.data.record),
};