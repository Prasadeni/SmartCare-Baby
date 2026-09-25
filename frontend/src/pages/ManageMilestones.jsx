import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import FloatingButtons from '../components/FloatingButtons';
import LoadingSpinner from '../components/LoadingSpinner';
import { adminApi } from '../api/admin';

const AREAS = [
  'Gross Motor',
  'Fine Motor',
  'Language',
  'Cognitive',
  'Social',
  'Self-Help',
  'Hearing/Vision',
];

function iconFor(area) {
  const map = {
    'Gross Motor': 'directions_run',
    'Fine Motor': 'back_hand',
    'Language': 'chat',
    'Cognitive': 'psychology',
    'Social': 'groups',
    'Self-Help': 'restaurant',
    'Hearing/Vision': 'visibility',
  };
  return map[area] || 'flag';
}

export default function ManageMilestones() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState('');
  const [area, setArea] = useState('');
  const [criticalOnly, setCriticalOnly] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    area: 'Gross Motor',
    description: '',
    expectedAgeMonths: 6,
    isCritical: false,
    isActive: true,
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.milestones();
      setItems(data.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load milestones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filteredData = items.filter((item) => {
    const matchesSearch = (item.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesArea = area ? item.area === area : true;
    const matchesCritical = criticalOnly ? item.isCritical : true;
    return matchesSearch && matchesArea && matchesCritical;
  });

  const openCreate = () => {
    setEditing(null);
    setForm({
      area: 'Gross Motor',
      description: '',
      expectedAgeMonths: 6,
      isCritical: false,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      area: item.area || 'Gross Motor',
      description: item.description || '',
      expectedAgeMonths: item.expectedAgeMonths ?? 6,
      isCritical: !!item.isCritical,
      isActive: item.isActive !== false,
    });
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.description}"? This cannot be undone.`)) return;
    try {
      await adminApi.deleteMilestone(item.id);
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
        const { item } = await adminApi.updateMilestone(editing.id, form);
        setItems((prev) => prev.map((x) => (x.id === editing.id ? item : x)));
      } else {
        const { item } = await adminApi.createMilestone(form);
        setItems((prev) => [...prev, item].sort((a, b) => a.expectedAgeMonths - b.expectedAgeMonths));
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
      <AdminLayout activePage="milestones">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-background mb-1">
              Milestone Management
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant">
              Configure developmental milestones and their expected ages.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full hover:scale-95 hover:opacity-90 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined">add</span>
            <span className="text-label-md font-label-md">Add Milestone</span>
          </button>
        </div>

        <div className="bg-surface-container-lowest rounded-lg p-4 shadow-soft mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="Search milestones..."
              type="text"
            />
          </div>
          <select
            onChange={(e) => setArea(e.target.value)}
            value={area}
            className="w-full md:w-56 pl-4 pr-10 py-3 rounded-full border border-outline-variant bg-surface appearance-none cursor-pointer"
          >
            <option value="">All Areas</option>
            {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <label className="flex items-center gap-2 text-body-md cursor-pointer">
            <input
              type="checkbox"
              checked={criticalOnly}
              onChange={(e) => setCriticalOnly(e.target.checked)}
            />
            Critical only
          </label>
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
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">Milestone</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">Area</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">Expected Age</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">Critical</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-body-md">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-surface/50 group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[18px]">{iconFor(item.area)}</span>
                          </div>
                          <span className="font-bold">{item.description}</span>
                        </div>
                      </td>
                      <td className="p-4 text-on-surface-variant">{item.area}</td>
                      <td className="p-4 text-on-surface-variant">
                        {item.expectedAgeMonths} month{item.expectedAgeMonths === 1 ? '' : 's'}
                      </td>
                      <td className="p-4">
                        {item.isCritical ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-label-md bg-error-container text-on-error-container">
                            Critical
                          </span>
                        ) : (
                          <span className="text-on-surface-variant">—</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(item)}
                            className="w-8 h-8 rounded-full hover:bg-surface-container-highest flex items-center justify-center"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="w-8 h-8 rounded-full hover:bg-error-container hover:text-error flex items-center justify-center"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-on-surface-variant">
                        No milestones found matching your criteria.
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-lg p-6">
            <h3 className="text-headline-sm font-bold mb-4">
              {editing ? 'Edit Milestone' : 'Add Milestone'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-label-md mb-1">Description</label>
                <input
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant"
                  placeholder="e.g. Sits without support"
                />
              </div>
              <div>
                <label className="block text-label-md mb-1">Area</label>
                <select
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant"
                >
                  {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-label-md mb-1">Expected age (months)</label>
                <input
                  type="number" min="0" max="60"
                  value={form.expectedAgeMonths}
                  onChange={(e) => setForm({ ...form, expectedAgeMonths: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isCritical}
                  onChange={(e) => setForm({ ...form, isCritical: e.target.checked })}
                />
                <span className="text-body-md">Critical milestone (red flag if delayed)</span>
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