// src/api/education.js
import client from './client';

export const educationApi = {
  list: ({ category } = {}) => {
    const qs = category ? `?category=${encodeURIComponent(category)}` : '';
    return client.get(`/education${qs}`).then((r) => r.data.articles);
  },

  get: (id) => client.get(`/education/${id}`).then((r) => r.data.article),

  categories: () =>
    client.get('/education/categories').then((r) => r.data.categories),
};