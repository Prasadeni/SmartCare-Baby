import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import FloatingButtons from '../components/FloatingButtons';
import LoadingSpinner from '../components/LoadingSpinner';
import { adminApi } from '../api/admin';

const CATEGORIES = [
  'General & Behavioral',
  'Respiratory',
  'Gastrointestinal',
  'Neurological',
  'Fever & Infection',
];

// Derive a "risk level" from real fields
function deriveRisk(item) {
  if (item.isRedFlag) return 'High';
  if (Number(item.weight) >= 5) return 'Medium';
  return 'Low';
}

// Pick a Material icon by category (cosmetic)
function iconFor(category) {
  const map = {
    'General & Behavioral': 'psychology',
    'Respiratory': 'air',
    'Gastrointestinal': 'restaurant',
    'Neurological': 'neurology',
    'Fever & Infection': 'thermostat',
  };
  return map[category] || 'medical_services';
}

export default function ManageSymptoms() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [risk, setRisk] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = create, object = edit
  const [form, setForm] = useState({
    symptomText: '',
    category: 'General & Behavioral',
    weight: 1,
    isRedFlag: false,
    guidanceText: '',
    isActive: true,
  });

  // ── Fetch ──────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.symptoms();
      setItems(data.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load symptoms');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Filter ─────────────────────────────────────────────────
  const filteredData = items.filter((item) => {
    const matchesSearch = (item.symptomText || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category ? item.category === category : true;
    const matchesRisk = risk ? deriveRisk(item) === risk : true;
    return matchesSearch && matchesCategory && matchesRisk;
  });

  // ── Badge helpers ──────────────────────────────────────────
  const getRiskBadge = (r) => {
    if (r === 'High') return 'bg-error-container text-on-error-container';
    if (r === 'Medium') return 'bg-secondary-container text-on-secondary-container';
    return 'bg-primary-container/30 text-on-primary-container';
  };
  const getRiskDot = (r) => {
    if (r === 'High') return 'bg-error';
    if (r === 'Medium') return 'bg-secondary';
    return 'bg-primary';
  };

  // ── Modal handlers ─────────────────────────────────────────
  const openCreate = () => {
    setEditing(null);
    setForm({
      symptomText: '',
      category: 'General & Behavioral',
      weight: 1,
      isRedFlag: false,
      guidanceText: '',
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      symptomText: item.symptomText || '',
      category: item.category || 'General & Behavioral',
      weight: item.weight ?? 1,
      isRedFlag: !!item.isRedFlag,
      guidanceText: item.guidanceText || '',
      isActive: item.isActive !== false,
    });
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.symptomText}"? This cannot be undone.`)) return;
    try {
      await adminApi.deleteSymptom(item.id);
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
        const { item } = await adminApi.updateSymptom(editing.id, form);
        setItems((prev) => prev.map((x) => (x.id === editing.id ? item : x)));
      } else {
        const { item } = await adminApi.createSymptom(form);
        setItems((prev) => [item, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      alert(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <>
      <AdminLayout activePage="symptoms">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-background mb-1">
              Symptom Management
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant">
              Manage and configure diagnostic symptoms and their risk weights.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full hover:scale-95 hover:opacity-90 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined">add</span>
            <span className="text-label-md font-label-md">Add Symptom</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-surface-container-lowest rounded-lg p-4 shadow-soft mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-body-md font-body-md"
              placeholder="Search symptoms..."
              type="text"
            />
          </div>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full md:w-64 pl-4 pr-10 py-3 rounded-full border border-outline-variant bg-surface appearance-none focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-body-md font-body-md cursor-pointer"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            onChange={(e) => setRisk(e.target.value)}
            value={risk}
            className="w-full md:w-48 pl-4 pr-10 py-3 rounded-full border border-outline-variant bg-surface appearance-none focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-body-md font-body-md cursor-pointer"
          >
            <option value="">All Risks</option>
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Low Risk</option>
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
                    <th className="p-4 text-label-md font-label-md text-on-surface-variant font-bold">Symptom Name</th>
                    <th className="p-4 text-label-md font-label-md text-on-surface-variant font-bold">Category</th>
                    <th className="p-4 text-label-md font-label-md text-on-surface-variant font-bold">Risk Level</th>
                    <th className="p-4 text-label-md font-label-md text-on-surface-variant font-bold">Last Updated</th>
                    <th className="p-4 text-label-md font-label-md text-on-surface-variant font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-body-md font-body-md">
                  {filteredData.map((item) => {
                    const r = deriveRisk(item);
                    return (
                      <tr key={item.id} className="hover:bg-surface/50 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                              <span className="material-symbols-outlined text-[18px]">{iconFor(item.category)}</span>
                            </div>
                            <span className="font-bold text-on-surface">{item.symptomText}</span>
                          </div>
                        </td>
                        <td className="p-4 text-on-surface-variant">{item.category}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-label-md font-label-md ${getRiskBadge(r)}`}>
                            <span className={`w-2 h-2 rounded-full mr-2 ${getRiskDot(r)}`}></span>
                            {r}
                          </span>
                        </td>
                        <td className="p-4 text-on-surface-variant text-body-sm font-body-sm">
                          {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : '—'}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEdit(item)}
                              className="w-8 h-8 rounded-full hover:bg-surface-container-highest flex items-center justify-center text-on-surface-variant"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              className="w-8 h-8 rounded-full hover:bg-error-container hover:text-error flex items-center justify-center text-on-surface-variant transition-colors"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-on-surface-variant">
                        No symptoms found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          <div className="p-4 border-t border-outline-variant/20 flex items-center justify-between bg-surface-bright">
            <span className="text-body-sm font-body-sm text-on-surface-variant">
              Showing {filteredData.length} of {items.length} entries
            </span>
          </div>
        </div>
      </AdminLayout>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-lg p-6">
            <h3 className="text-headline-sm font-bold mb-4">
              {editing ? 'Edit Symptom' : 'Add Symptom'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-label-md mb-1">Symptom text</label>
                <input
                  required
                  value={form.symptomText}
                  onChange={(e) => setForm({ ...form, symptomText: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant"
                  placeholder="e.g. Fever above 38°C"
                />
              </div>
              <div>
                <label className="block text-label-md mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-label-md mb-1">Weight (1–10)</label>
                <input
                  type="number" min="1" max="10"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant"
                />
              </div>
              <div>
                <label className="block text-label-md mb-1">Guidance text</label>
                <textarea
                  value={form.guidanceText}
                  onChange={(e) => setForm({ ...form, guidanceText: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant"
                  rows={3}
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isRedFlag}
                  onChange={(e) => setForm({ ...form, isRedFlag: e.target.checked })}
                />
                <span className="text-body-md">Red flag (emergency)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
                <span className="text-body-md">Active</span>
              </label>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2 rounded-full border border-outline-variant"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-full bg-primary text-on-primary disabled:opacity-50"
                >
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