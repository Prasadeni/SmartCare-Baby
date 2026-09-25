// src/api/vaccinations.js
import client from './client';

export const vaccinationsApi = {
  listSchedules: () =>
    client.get('/vaccinations/schedule').then((r) => r.data.schedules),

  listRecords: (babyId) =>
    client
      .get(`/vaccinations/records${babyId ? `?babyId=${babyId}` : ''}`)
      .then((r) => r.data.records),

  createRecord: (payload) =>
    client.post('/vaccinations/records', payload).then((r) => r.data.record),
};