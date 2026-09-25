import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import FloatingButtons from '../components/FloatingButtons';
import LoadingSpinner from '../components/LoadingSpinner';
import { adminApi } from '../api/admin';

const CATEGORIES = ['Newborn Care', 'Nutrition', 'Development', 'Safety', 'Maternal Health'];
const TYPES = ['Article', 'Guide', 'Video'];

const EMPTY_FORM = {
  title: '',
  contentType: 'Article',
  body: '',
  category: 'Newborn Care',
  author: 'SmartCare Team',
  publishedDate: new Date().toISOString().split('T')[0],
  imageUrl: '',
  isActive: true,
};

export default function ManageEducation() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.education();
      setItems(data.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load education content');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filteredData = items.filter((item) => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      (item.title || '').toLowerCase().includes(q) ||
      (item.author || '').toLowerCase().includes(q);
    const matchesCategory = category ? item.category === category : true;
    return matchesSearch && matchesCategory;
  });

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title || '',
      contentType: item.contentType || 'Article',
      body: item.body || '',
      category: item.category || 'Newborn Care',
      author: item.author || 'SmartCare Team',
      publishedDate: item.publishedDate || new Date().toISOString().split('T')[0],
      imageUrl: item.imageUrl || '',
      isActive: item.isActive !== false,
    });
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    try {
      await adminApi.deleteEducation(item.id);
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
        const { item } = await adminApi.updateEducation(editing.id, form);
        setItems((prev) => prev.map((x) => (x.id === editing.id ? item : x)));
      } else {
        const { item } = await adminApi.createEducation(form);
        setItems((prev) => [item, ...prev]);
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
      <AdminLayout activePage="education">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-background mb-1">
              Education Content
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Manage articles, guides, and videos shown to caregivers.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full hover:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined">add</span>
            <span className="text-label-md font-label-md">Add Content</span>
          </button>
        </div>

        <div className="bg-surface-container-lowest rounded-lg p-4 shadow-soft mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-outline-variant bg-surface outline-none"
              placeholder="Search by title or author..."
              type="text"
            />
          </div>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full md:w-56 pl-4 pr-10 py-3 rounded-full border border-outline-variant bg-surface cursor-pointer"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
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
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">Title</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">Type</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">Category</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">Author</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">Published</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-body-md">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-surface/50 group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">article</span>
                          </div>
                          <span className="font-bold">{item.title}</span>
                        </div>
                      </td>
                      <td className="p-4 text-on-surface-variant">{item.contentType}</td>
                      <td className="p-4 text-on-surface-variant">{item.category || '—'}</td>
                      <td className="p-4 text-on-surface-variant">{item.author || '—'}</td>
                      <td className="p-4 text-on-surface-variant">{item.publishedDate || '—'}</td>
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
                        No content yet. Click <strong>Add Content</strong> to create one.
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
              {editing ? 'Edit Content' : 'Add Content'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-label-md mb-1">Title *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-label-md mb-1">Type</label>
                  <select value={form.contentType} onChange={(e) => setForm({ ...form, contentType: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant">
                    {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-label-md mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-label-md mb-1">Author</label>
                  <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant" />
                </div>
                <div>
                  <label className="block text-label-md mb-1">Published date</label>
                  <input type="date" value={form.publishedDate}
                    onChange={(e) => setForm({ ...form, publishedDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant" />
                </div>
              </div>
              <div>
                <label className="block text-label-md mb-1">Body *</label>
                <textarea required value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })}
                  rows={6} className="w-full px-4 py-2 rounded-lg border border-outline-variant"
                  placeholder="Write the article content here..." />
              </div>
              <div>
                <label className="block text-label-md mb-1">Image URL (optional)</label>
                <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant" />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                <span className="text-body-md">Active (visible to caregivers)</span>
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