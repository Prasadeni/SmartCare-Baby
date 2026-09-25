// frontend/src/api/admin.js
import client from './client';

const unwrap = (r) => r.data;

export const adminApi = {
  // ─── Analytics ────────────────────────────────────────────────
  analytics: () => client.get('/admin/analytics').then(unwrap),

    // ─── Users ────────────────────────────────────────────────────
  users: (params) => client.get('/admin/users', { params }).then(unwrap),
  updateUser: (id, data) =>
    client.put(`/admin/users/${id}`, data).then(unwrap),
  deactivateUser: (id) =>
    client.post(`/admin/users/${id}/deactivate`).then(unwrap),
  reactivateUser: (id) =>
    client.post(`/admin/users/${id}/reactivate`).then(unwrap),

  // ─── Settings ─────────────────────────────────────────────────
  getProfile: () => client.get('/admin/settings/profile').then(unwrap),
  updateProfile: (data) => client.put('/admin/settings/profile', data).then(unwrap),
  changePassword: (data) => client.put('/admin/settings/password', data).then(unwrap),

  // ─── Assessments ──────────────────────────────────────────────
  assessmentsSymptoms: () => client.get('/admin/assessments/symptoms').then(unwrap),
  assessmentsMilestones: () => client.get('/admin/assessments/milestones').then(unwrap),
  assessmentsMchat: () => client.get('/admin/assessments/mchat').then(unwrap),

  // ─── Symptoms ─────────────────────────────────────────────────
  symptoms: () => client.get('/admin/symptoms').then(unwrap),
  createSymptom: (data) => client.post('/admin/symptoms', data).then(unwrap),
  updateSymptom: (id, data) => client.put(`/admin/symptoms/${id}`, data).then(unwrap),
  deleteSymptom: (id) => client.delete(`/admin/symptoms/${id}`).then(unwrap),

  // ─── Milestones ───────────────────────────────────────────────
  milestones: () => client.get('/admin/milestones').then(unwrap),
  createMilestone: (data) => client.post('/admin/milestones', data).then(unwrap),
  updateMilestone: (id, data) => client.put(`/admin/milestones/${id}`, data).then(unwrap),
  deleteMilestone: (id) => client.delete(`/admin/milestones/${id}`).then(unwrap),

  // ─── Specialists ──────────────────────────────────────────────
  specialists: () => client.get('/admin/specialists').then(unwrap),
  createSpecialist: (data) => client.post('/admin/specialists', data).then(unwrap),
  updateSpecialist: (id, data) => client.put(`/admin/specialists/${id}`, data).then(unwrap),
  deleteSpecialist: (id) => client.delete(`/admin/specialists/${id}`).then(unwrap),

  // ─── Education ────────────────────────────────────────────────
  education: () => client.get('/admin/education').then(unwrap),
  createEducation: (data) => client.post('/admin/education', data).then(unwrap),
  updateEducation: (id, data) => client.put(`/admin/education/${id}`, data).then(unwrap),
  deleteEducation: (id) => client.delete(`/admin/education/${id}`).then(unwrap),

  // ─── Emergency contacts ───────────────────────────────────────
  emergency: () => client.get('/admin/emergency-contacts').then(unwrap),
  createEmergency: (data) => client.post('/admin/emergency-contacts', data).then(unwrap),
  updateEmergency: (id, data) =>
    client.put(`/admin/emergency-contacts/${id}`, data).then(unwrap),
  deleteEmergency: (id) => client.delete(`/admin/emergency-contacts/${id}`).then(unwrap),

  // ─── Risk thresholds ──────────────────────────────────────────
  risks: () => client.get('/admin/risk-thresholds').then(unwrap),
  createRisk: (data) => client.post('/admin/risk-thresholds', data).then(unwrap),
  updateRisk: (id, data) => client.put(`/admin/risk-thresholds/${id}`, data).then(unwrap),
  deleteRisk: (id) => client.delete(`/admin/risk-thresholds/${id}`).then(unwrap),
};