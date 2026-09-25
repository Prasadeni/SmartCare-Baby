import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import FloatingButtons from '../components/FloatingButtons';
import LoadingSpinner from '../components/LoadingSpinner';
import { adminApi } from '../api/admin';

const LEVELS = ['Green', 'Yellow', 'Red'];

const LEVEL_BADGE = {
  Green: 'bg-primary-container text-on-primary-container',
  Yellow: 'bg-secondary-container text-on-secondary-container',
  Red: 'bg-error-container text-on-error-container',
};

const LEVEL_DOT = {
  Green: 'bg-primary',
  Yellow: 'bg-secondary',
  Red: 'bg-error',
};

const EMPTY_FORM = {
  name: '',
  riskLevel: 'Green',
  minScore: 0,
  maxScore: 0,
  color: '',
  description: '',
  recommendationText: '',
  actionRequired: '',
  notifyCaregiver: true,
  escalateToAdmin: false,
  isActive: true,
  sortOrder: 0,
};

export default function ManageRisks() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.risks();
      setItems(data.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load risk thresholds');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filteredData = items.filter((item) => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      (item.name || '').toLowerCase().includes(q) ||
      (item.description || '').toLowerCase().includes(q);
    const matchesLevel = level ? item.riskLevel === level : true;
    return matchesSearch && matchesLevel;
  });

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name || '',
      riskLevel: item.riskLevel || 'Green',
      minScore: Number(item.minScore) || 0,
      maxScore: Number(item.maxScore) || 0,
      color: item.color || '',
      description: item.description || '',
      recommendationText: item.recommendationText || '',
      actionRequired: item.actionRequired || '',
      notifyCaregiver: item.notifyCaregiver !== false,
      escalateToAdmin: !!item.escalateToAdmin,
      isActive: item.isActive !== false,
      sortOrder: Number(item.sortOrder) || 0,
    });
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    try {
      await adminApi.deleteRisk(item.id);
      setItems((prev) => prev.filter((x) => x.id !== item.id));
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const { item } = await adminApi.updateRisk(editing.id, form);
        setItems((prev) => prev.map((x) => (x.id === editing.id ? item : x)));
      } else {
        const { item } = await adminApi.createRisk(form);
        setItems((prev) => [...prev, item]);
      }
      setModalOpen(false);
    } catch (err) {
      alert(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminLayout activePage="risks">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-background mb-1">
              Risk Thresholds
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Configure scoring bands that classify assessment results as Green, Yellow, or Red.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full hover:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined">add</span>
            <span className="text-label-md font-label-md">Add Threshold</span>
          </button>
        </div>

        <div className="bg-surface-container-lowest rounded-lg p-4 shadow-soft mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-outline-variant bg-surface outline-none"
              placeholder="Search thresholds..."
              type="text"
            />
          </div>
          <select
            onChange={(e) => setLevel(e.target.value)}
            value={level}
            className="w-full md:w-56 pl-4 pr-10 py-3 rounded-full border border-outline-variant bg-surface cursor-pointer"
          >
            <option value="">All Levels</option>
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

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
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">Level</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">Score Range</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">Notify</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">Escalate</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-body-md">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-surface/50 group">
                      <td className="p-4">
                        <span className="font-bold">{item.name}</span>
                        {item.description && (
                          <p className="text-body-sm text-on-surface-variant mt-1">{item.description}</p>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-label-md ${LEVEL_BADGE[item.riskLevel] || ''}`}>
                          <span className={`w-2 h-2 rounded-full mr-2 ${LEVEL_DOT[item.riskLevel] || ''}`}></span>
                          {item.riskLevel}
                        </span>
                      </td>
                      <td className="p-4 text-on-surface-variant font-mono">
                        {item.minScore} – {item.maxScore}
                      </td>
                      <td className="p-4 text-on-surface-variant">
                        {item.notifyCaregiver ? 'Yes' : 'No'}
                      </td>
                      <td className="p-4 text-on-surface-variant">
                        {item.escalateToAdmin ? 'Yes' : 'No'}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-full hover:bg-surface-container-highest flex items-center justify-center" title="Edit">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button onClick={() => handleDelete(item)} className="w-8 h-8 rounded-full hover:bg-error-container hover:text-error flex items-center justify-center" title="Delete">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-on-surface-variant">
                        No thresholds yet. Click <strong>Add Threshold</strong> to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-4 border-t border-outline-variant/20 bg-surface-bright">
            <span className="text-body-sm text-on-surface-variant">
              Showing {filteredData.length} of {items.length} entries
            </span>
          </div>
        </div>
      </AdminLayout>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-2xl p-6 my-8">
            <h3 className="text-headline-sm font-bold mb-4">
              {editing ? 'Edit Threshold' : 'Add Risk Threshold'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-label-md mb-1">Name *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant"
                    placeholder="Low Risk — Monitor at Home" />
                </div>
                <div>
                  <label className="block text-label-md mb-1">Level *</label>
                  <select value={form.riskLevel} onChange={(e) => setForm({ ...form, riskLevel: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant">
                    {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-label-md mb-1">Min score</label>
                  <input type="number" value={form.minScore}
                    onChange={(e) => setForm({ ...form, minScore: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant" />
                </div>
                <div>
                  <label className="block text-label-md mb-1">Max score</label>
                  <input type="number" value={form.maxScore}
                    onChange={(e) => setForm({ ...form, maxScore: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant" />
                </div>
                <div>
                  <label className="block text-label-md mb-1">Sort order</label>
                  <input type="number" value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant" />
                </div>
                <div>
                  <label className="block text-label-md mb-1">Color (optional)</label>
                  <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant"
                    placeholder="#10b981" />
                </div>
              </div>
              <div>
                <label className="block text-label-md mb-1">Description</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant" />
              </div>
              <div>
                <label className="block text-label-md mb-1">Recommendation text (shown to caregiver)</label>
                <textarea value={form.recommendationText}
                  onChange={(e) => setForm({ ...form, recommendationText: e.target.value })}
                  rows={3} className="w-full px-4 py-2 rounded-lg border border-outline-variant"
                  placeholder="Monitor at home. Keep your baby hydrated and observe for 24 hours." />
              </div>
              <div>
                <label className="block text-label-md mb-1">Action required (internal note)</label>
                <input value={form.actionRequired}
                  onChange={(e) => setForm({ ...form, actionRequired: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant" />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.notifyCaregiver}
                  onChange={(e) => setForm({ ...form, notifyCaregiver: e.target.checked })} />
                <span className="text-body-md">Notify caregiver on this level</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.escalateToAdmin}
                  onChange={(e) => setForm({ ...form, escalateToAdmin: e.target.checked })} />
                <span className="text-body-md">Escalate to admin</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                <span className="text-body-md">Active</span>
              </label>

              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setModalOpen(false)}
                  className="px-6 py-2 rounded-full border border-outline-variant">Cancel</button>
                <button type="submit" disabled={saving}
                  className="px-6 py-2 rounded-full bg-primary text-on-primary disabled:opacity-50">
                  {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <FloatingButtons />
    </>
  );
}