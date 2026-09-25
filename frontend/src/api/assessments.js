// src/api/assessments.js
import client from './client';

export const symptomsApi = {
  getConfigs: () =>
    client.get('/symptoms/configs').then((r) => r.data.configs),

  submit: (babyId, answers) =>
    client
      .post('/assessments/symptoms', { babyId, answers })
      .then((r) => r.data.assessment),

  history: (babyId) =>
    client
      .get(`/assessments/symptoms?babyId=${babyId || ''}`)
      .then((r) => r.data.assessments),

  // NEW — single symptom assessment (full detail, used by report viewer)
  get: (id) =>
    client
      .get(`/assessments/symptoms/${id}`)
      .then((r) => r.data.assessment),
};

export const milestonesApi = {
  getConfigs: (area) =>
    client
      .get(`/milestones/configs${area ? `?area=${encodeURIComponent(area)}` : ''}`)
      .then((r) => r.data.configs),

  submit: (babyId, items) =>
    client
      .post('/assessments/milestones', { babyId, items })
      .then((r) => r.data.assessment),

  // NEW — list assessments for a baby (used by report viewer)
  list: (babyId) =>
    client
      .get(`/assessments/milestones${babyId ? `?babyId=${babyId}` : ''}`)
      .then((r) => r.data.assessments),

  // NEW — single milestone assessment with joined config data
  get: (id) =>
    client
      .get(`/assessments/milestones/${id}`)
      .then((r) => r.data.assessment),
};

export const mchatApi = {
  getQuestions: () =>
    client.get('/mchat/questions').then((r) => r.data.questions),

  submit: (babyId, answers) =>
    client
      .post('/assessments/mchat', { babyId, answers })
      .then((r) => r.data.assessment),

  // NEW — list M-CHAT assessments for a baby
  list: (babyId) =>
    client
      .get(`/assessments/mchat${babyId ? `?babyId=${babyId}` : ''}`)
      .then((r) => r.data.assessments),

  // NEW — single M-CHAT assessment with full answers
  get: (id) =>
    client
      .get(`/assessments/mchat/${id}`)
      .then((r) => r.data.assessment),
};