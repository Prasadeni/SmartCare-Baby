import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import FloatingButtons from '../components/FloatingButtons';
import LoadingSpinner from '../components/LoadingSpinner';
import { adminApi } from '../api/admin';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const EMPTY_FORM = {
  name: '',
  specialty: '',
  phone: '',
  email: '',
  hospitalAffiliation: '',
  city: '',
  country: 'Sri Lanka',
  bio: '',
  rating: 0,
  reviews: 0,
  fee: '',
  availableDays: [],
  isActive: true,
};

export default function ManageSpecialists() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.specialists();
      setItems(data.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load specialists');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const cities = Array.from(new Set(items.map((i) => i.city).filter(Boolean))).sort();

  const filteredData = items.filter((item) => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      (item.name || '').toLowerCase().includes(q) ||
      (item.specialty || '').toLowerCase().includes(q) ||
      (item.hospitalAffiliation || '').toLowerCase().includes(q);
    const matchesCity = city ? item.city === city : true;
    return matchesSearch && matchesCity;
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
      specialty: item.specialty || '',
      phone: item.phone || '',
      email: item.email || '',
      hospitalAffiliation: item.hospitalAffiliation || '',
      city: item.city || '',
      country: item.country || 'Sri Lanka',
      bio: item.bio || '',
      rating: Number(item.rating) || 0,
      reviews: Number(item.reviews) || 0,
      fee: item.fee || '',
      availableDays: item.availableDays || [],
      isActive: item.isActive !== false,
    });
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    try {
      await adminApi.deleteSpecialist(item.id);
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
        const { item } = await adminApi.updateSpecialist(editing.id, form);
        setItems((prev) => prev.map((x) => (x.id === editing.id ? item : x)));
      } else {
        const { item } = await adminApi.createSpecialist(form);
        setItems((prev) => [...prev, item].sort((a, b) => a.name.localeCompare(b.name)));
      }
      setModalOpen(false);
    } catch (err) {
      alert(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = (day) => {
    setForm((f) => ({
      ...f,
      availableDays: f.availableDays.includes(day)
        ? f.availableDays.filter((d) => d !== day)
        : [...f.availableDays, day],
    }));
  };

  return (
    <>
      <AdminLayout activePage="specialists">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-background mb-1">
              Specialist Management
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Manage the doctor directory shown to caregivers.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full hover:scale-95 hover:opacity-90 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined">add</span>
            <span className="text-label-md font-label-md">Add Specialist</span>
          </button>
        </div>

        <div className="bg-surface-container-lowest rounded-lg p-4 shadow-soft mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-outline-variant bg-surface outline-none"
              placeholder="Search by name, specialty, hospital..."
              type="text"
            />
          </div>
          <select
            onChange={(e) => setCity(e.target.value)}
            value={city}
            className="w-full md:w-56 pl-4 pr-10 py-3 rounded-full border border-outline-variant bg-surface cursor-pointer"
          >
            <option value="">All Cities</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
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
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">Specialty</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">Hospital</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">City</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">Fee</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-body-md">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-surface/50 group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">person</span>
                          </div>
                          <span className="font-bold">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-on-surface-variant">{item.specialty}</td>
                      <td className="p-4 text-on-surface-variant">{item.hospitalAffiliation || '—'}</td>
                      <td className="p-4 text-on-surface-variant">{item.city || '—'}</td>
                      <td className="p-4 text-on-surface-variant">{item.fee || '—'}</td>
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
                        No specialists yet. Click <strong>Add Specialist</strong> to create one.
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
              {editing ? 'Edit Specialist' : 'Add Specialist'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-label-md mb-1">Name *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant" placeholder="Dr. Emily Chen" />
                </div>
                <div>
                  <label className="block text-label-md mb-1">Specialty *</label>
                  <input required value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant" placeholder="Pediatrician" />
                </div>
                <div>
                  <label className="block text-label-md mb-1">Phone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant" placeholder="+94 11 234 5678" />
                </div>
                <div>
                  <label className="block text-label-md mb-1">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant" />
                </div>
                <div>
                  <label className="block text-label-md mb-1">Hospital</label>
                  <input value={form.hospitalAffiliation} onChange={(e) => setForm({ ...form, hospitalAffiliation: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant" />
                </div>
                <div>
                  <label className="block text-label-md mb-1">City</label>
                  <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant" placeholder="Colombo" />
                </div>
                <div>
                  <label className="block text-label-md mb-1">Fee</label>
                  <input value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant" placeholder="LKR 3,500" />
                </div>
                <div>
                  <label className="block text-label-md mb-1">Rating (0–5)</label>
                  <input type="number" min="0" max="5" step="0.1" value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant" />
                </div>
              </div>
              <div>
                <label className="block text-label-md mb-1">Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3} className="w-full px-4 py-2 rounded-lg border border-outline-variant" />
              </div>
              <div>
                <label className="block text-label-md mb-2">Available Days</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((d) => (
                    <button type="button" key={d} onClick={() => toggleDay(d)}
                      className={`px-4 py-1 rounded-full text-label-md border ${
                        form.availableDays.includes(d)
                          ? 'bg-primary text-on-primary border-primary'
                          : 'border-outline-variant'
                      }`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
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