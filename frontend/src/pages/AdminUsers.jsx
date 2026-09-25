// frontend/src/pages/AdminUsers.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AdminLayout from '../components/AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { adminApi } from '../api/admin';
import { useAuth } from '../context/AuthContext';

const ROLE_BADGE = {
  Admin: 'bg-error-container text-on-error-container',
  Caregiver: 'bg-primary-container/30 text-on-primary-container',
  PregnantMother: 'bg-secondary-container text-on-secondary-container',
};

const ROLE_OPTIONS = [
  { value: 'Caregiver', label: 'Caregiver' },
  { value: 'PregnantMother', label: 'Pregnant Mother' },
  { value: 'Admin', label: 'Admin' },
];

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('active'); // active | inactive | all

  const [editing, setEditing] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.users({ status });
      setItems(data.users || []);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => { load(); }, [load]);

  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((u) => {
      const matchesSearch = !q ||
        (u.fullName || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q);
      const matchesRole = role ? u.role === role : true;
      return matchesSearch && matchesRole;
    });
  }, [items, search, role]);

  const handleDeactivate = async (u) => {
    if (!window.confirm(
      `Deactivate ${u.fullName}?\n\nThey will not be able to log in, but their data will be kept. You can reactivate them anytime.`
    )) return;
    setBusyId(u.id);
    try {
      await adminApi.deactivateUser(u.id);
      await load();
    } catch (err) {
      alert(err.message || 'Could not deactivate user');
    } finally {
      setBusyId(null);
    }
  };

  const handleReactivate = async (u) => {
    setBusyId(u.id);
    try {
      await adminApi.reactivateUser(u.id);
      await load();
    } catch (err) {
      alert(err.message || 'Could not reactivate user');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AdminLayout activePage="users">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-background mb-1">
            Users
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Manage registered users — edit details or deactivate accounts.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface-container-lowest rounded-lg p-4 shadow-soft mb-6 flex flex-col md:flex-row gap-4 items-stretch">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            className="w-full pl-10 pr-4 py-3 rounded-full border border-outline-variant bg-surface outline-none"
            placeholder="Search by name or email…"
            type="text"
          />
        </div>
        <select
          onChange={(e) => setRole(e.target.value)}
          value={role}
          className="md:w-52 pl-4 pr-10 py-3 rounded-full border border-outline-variant bg-surface cursor-pointer"
        >
          <option value="">All Roles</option>
          <option value="Caregiver">Caregiver</option>
          <option value="PregnantMother">Pregnant Mother</option>
          <option value="Admin">Admin</option>
        </select>
        <select
          onChange={(e) => setStatus(e.target.value)}
          value={status}
          className="md:w-40 pl-4 pr-10 py-3 rounded-full border border-outline-variant bg-surface cursor-pointer"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="all">All</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-soft overflow-hidden border border-outline-variant/10">
        {loading ? (
          <div className="p-16 flex justify-center"><LoadingSpinner /></div>
        ) : error ? (
          <div className="p-16 text-center">
            <p className="text-error mb-4">{error}</p>
            <button onClick={load} className="px-6 py-2 rounded-full bg-primary text-on-primary">Retry</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/20">
                  <th className="p-4 text-label-md font-bold text-on-surface-variant">Name</th>
                  <th className="p-4 text-label-md font-bold text-on-surface-variant">Email</th>
                  <th className="p-4 text-label-md font-bold text-on-surface-variant">Role</th>
                  <th className="p-4 text-label-md font-bold text-on-surface-variant">City</th>
                  <th className="p-4 text-label-md font-bold text-on-surface-variant">Status</th>
                  <th className="p-4 text-label-md font-bold text-on-surface-variant">Joined</th>
                  <th className="p-4 text-label-md font-bold text-on-surface-variant text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 text-body-md">
                {filteredData.map((u) => {
                  const isMe = u.id === me?.id || u.email === me?.email;
                  const inactive = u.isActive === false;
                  return (
                    <tr key={u.id} className={`hover:bg-surface/50 ${inactive ? 'opacity-60' : ''}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                            {(u.fullName || '?').charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold">
                            {u.fullName} {isMe && <span className="text-label-md text-primary ml-1">(you)</span>}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-on-surface-variant">{u.email}</td>
                      <td className="p-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-label-md ${ROLE_BADGE[u.role] || 'bg-surface-container text-on-surface-variant'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-on-surface-variant">{u.city || '—'}</td>
                      <td className="p-4">
                        {inactive ? (
                          <span className="inline-flex px-3 py-1 rounded-full text-label-md bg-surface-container text-on-surface-variant">
                            Inactive
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1 rounded-full text-label-md bg-primary-container/30 text-on-primary-container">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-on-surface-variant text-body-sm">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditing(u)}
                            className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          {inactive ? (
                            <button
                              onClick={() => handleReactivate(u)}
                              disabled={busyId === u.id}
                              className="px-3 py-1.5 rounded-full text-label-md bg-primary text-on-primary hover:opacity-90 disabled:opacity-50 transition-opacity"
                              title="Reactivate"
                            >
                              {busyId === u.id ? '…' : 'Reactivate'}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeactivate(u)}
                              disabled={busyId === u.id || isMe}
                              className="px-3 py-1.5 rounded-full text-label-md bg-surface-container text-on-surface-variant hover:bg-error-container hover:text-error disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              title={isMe ? "You can't deactivate yourself" : 'Deactivate'}
                            >
                              {busyId === u.id ? '…' : 'Deactivate'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-on-surface-variant">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-4 border-t border-outline-variant/20 bg-surface-bright">
          <span className="text-body-sm text-on-surface-variant">
            Showing {filteredData.length} of {items.length} users
          </span>
        </div>
      </div>

      {editing && (
        <EditUserModal
          user={editing}
          isSelf={editing.id === me?.id || editing.email === me?.email}
          onClose={() => setEditing(null)}
          onSaved={async () => { setEditing(null); await load(); }}
        />
      )}
    </AdminLayout>
  );
}

// ── Edit modal ───────────────────────────────────────────
function EditUserModal({ user, isSelf, onClose, onSaved }) {
  const [form, setForm] = useState({
    fullName: user.fullName || '',
    phone: user.phone || '',
    city: user.city || '',
    country: user.country || 'Sri Lanka',
    role: user.role || 'Caregiver',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setErr('');
    setSaving(true);
    try {
      await adminApi.updateUser(user.id, form);
      await onSaved();
    } catch (e2) {
      setErr(e2.message || 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest rounded-[2rem] p-6 md:p-8 w-full max-w-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-headline-sm font-headline-sm text-on-surface">
              Edit User
            </h3>
            <p className="text-body-sm text-on-surface-variant">{user.email}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {err && (
          <div className="mb-4 bg-error-container text-on-error-container px-4 py-3 rounded-xl text-body-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {err}
          </div>
        )}

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="block text-label-md text-on-surface-variant mb-1 ml-2">Full Name</label>
            <input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
              className="w-full px-5 py-3 rounded-full border border-outline-variant bg-surface-container-lowest"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label-md text-on-surface-variant mb-1 ml-2">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-5 py-3 rounded-full border border-outline-variant bg-surface-container-lowest"
              />
            </div>
            <div>
              <label className="block text-label-md text-on-surface-variant mb-1 ml-2">City</label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-5 py-3 rounded-full border border-outline-variant bg-surface-container-lowest"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label-md text-on-surface-variant mb-1 ml-2">Country</label>
              <input
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full px-5 py-3 rounded-full border border-outline-variant bg-surface-container-lowest"
              />
            </div>
            <div>
              <label className="block text-label-md text-on-surface-variant mb-1 ml-2">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                disabled={isSelf}
                className="w-full px-5 py-3 rounded-full border border-outline-variant bg-surface-container-lowest disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              {isSelf && (
                <p className="text-label-md text-on-surface-variant mt-1 ml-2">
                  You can't change your own role.
                </p>
              )}
            </div>
          </div>

          {form.role === 'Admin' && user.role !== 'Admin' && (
            <div className="bg-error-container/40 text-on-error-container px-4 py-3 rounded-xl text-body-sm">
              <strong>Warning:</strong> Promoting this user to Admin grants them full access to the admin panel — including managing users, content, and viewing all assessments.
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full border-2 border-outline-variant text-on-surface-variant font-label-md hover:bg-surface-container-low"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-full bg-primary text-on-primary font-label-md hover:opacity-90 disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}