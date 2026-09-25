// src/api/pregnancy.js
import client from './client';

export const pregnancyApi = {
  // ── Tracker ────────────────────────────────────────────────
  getTracker: () =>
    client.get('/pregnancy/tracker').then((r) => r.data.pregnancy),

  saveTracker: (payload) =>
    client.post('/pregnancy/tracker', payload).then((r) => r.data.pregnancy),

  // ── Kick counts ────────────────────────────────────────────
  listKicks: () =>
    client.get('/pregnancy/kicks').then((r) => r.data.kicks),

  createKick: (payload) =>
    client.post('/pregnancy/kicks', payload).then((r) => r.data.kick),

  // ── Contractions ───────────────────────────────────────────
  listContractions: () =>
    client.get('/pregnancy/contractions').then((r) => r.data.contractions),

  createContraction: (payload) =>
    client
      .post('/pregnancy/contractions', payload)
      .then((r) => r.data.contraction),

  // ── Weight logs ────────────────────────────────────────────
  listWeightLogs: () =>
    client.get('/pregnancy/weight-logs').then((r) => r.data.weightLogs),

  createWeightLog: (payload) =>
    client
      .post('/pregnancy/weight-logs', payload)
      .then((r) => r.data.weightLog),

    deleteWeightLog: (id) =>
    client.delete(`/pregnancy/weight-logs/${id}`).then((r) => r.data),    
};