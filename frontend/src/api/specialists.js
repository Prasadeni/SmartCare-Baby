// src/api/specialists.js
import client from './client';

export const specialistsApi = {
  list: ({ city, specialty, search } = {}) => {
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (specialty) params.set('specialty', specialty);
    if (search) params.set('search', search);
    const qs = params.toString();
    return client
      .get(`/specialists${qs ? `?${qs}` : ''}`)
      .then((r) => r.data.specialists);
  },

  get: (id) => client.get(`/specialists/${id}`).then((r) => r.data.specialist),

  mappings: () =>
    client.get('/specialty-mappings').then((r) => r.data.mappings),
};