import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import FloatingButtons from '../components/FloatingButtons';

const mockData = [
  { id: 1, name: 'High Fever (>100.4°F)', category: 'General', risk: 'High', updated: 'Oct 24, 2023', icon: 'thermostat' },
  { id: 2, name: 'Persistent Diarrhea', category: 'Gastrointestinal', risk: 'Medium', updated: 'Oct 22, 2023', icon: 'water_drop' },
  { id: 3, name: 'Mild Rash', category: 'Dermatological', risk: 'Low', updated: 'Oct 20, 2023', icon: 'face' },
  { id: 4, name: 'Loss of Appetite', category: 'General', risk: 'Medium', updated: 'Oct 18, 2023', icon: 'restaurant' },
];

export default function ManageSymptoms() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [risk, setRisk] = useState('');

  // Filtering logic (Backend Ready: Use API later)
  const filteredData = mockData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category ? item.category === category : true;
    const matchesRisk = risk ? item.risk === risk : true;
    return matchesSearch && matchesCategory && matchesRisk;
  });

  const getRiskBadge = (riskLevel) => {
    if (riskLevel === 'High') return 'bg-error-container text-on-error-container';
    if (riskLevel === 'Medium') return 'bg-secondary-container text-on-secondary-container';
    return 'bg-primary-container/30 text-on-primary-container';
  };

  const getRiskDot = (riskLevel) => {
    if (riskLevel === 'High') return 'bg-error';
    if (riskLevel === 'Medium') return 'bg-secondary';
    return 'bg-primary';
  };

  const handleAdd = () => {
    alert('Add Symptom modal/API call here');
  };

  return (
    <>
      <AdminLayout activePage="symptoms">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-background mb-1">Symptom Management</h2>
            <p className="text-body-md font-body-md text-on-surface-variant">Manage and configure diagnostic symptoms and their risk weights.</p>
          </div>
          <button onClick={handleAdd} className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full hover:scale-95 hover:opacity-90 transition-all shadow-sm">
            <span className="material-symbols-outlined">add</span>
            <span className="text-label-md font-label-md">Add Symptom</span>
          </button>
        </div>

        {/* Filters & Search */}
        <div className="bg-surface-container-lowest rounded-lg p-4 shadow-soft mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input onChange={(e) => setSearch(e.target.value)} value={search} className="w-full pl-10 pr-4 py-3 rounded-full border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-body-md font-body-md" placeholder="Search symptoms..." type="text" />
          </div>
          <select onChange={(e) => setCategory(e.target.value)} value={category} className="w-full md:w-48 pl-4 pr-10 py-3 rounded-full border border-outline-variant bg-surface appearance-none focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-body-md font-body-md cursor-pointer">
            <option value="">All Categories</option>
            <option value="General">General</option>
            <option value="Gastrointestinal">Gastrointestinal</option>
            <option value="Dermatological">Dermatological</option>
          </select>
          <select onChange={(e) => setRisk(e.target.value)} value={risk} className="w-full md:w-48 pl-4 pr-10 py-3 rounded-full border border-outline-variant bg-surface appearance-none focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-body-md font-body-md cursor-pointer">
            <option value="">All Risks</option>
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Low Risk</option>
          </select>
        </div>

        {/* Data Table */}
        <div className="bg-surface-container-lowest rounded-xl shadow-soft overflow-hidden border border-outline-variant/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/20">
                  <th className="p-4 text-label-md font-label-md text-on-surface-variant font-bold">Symptom Name</th>
                  <th className="p-4 text-label-md font-label-md text-on-surface-variant font-bold">Category</th>
                  <th className="p-4 text-label-md font-label-md text-on-surface-variant font-bold">Risk Weight</th>
                  <th className="p-4 text-label-md font-label-md text-on-surface-variant font-bold">Last Updated</th>
                  <th className="p-4 text-label-md font-label-md text-on-surface-variant font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 text-body-md font-body-md">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-surface/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                        </div>
                        <span className="font-bold text-on-surface">{item.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-on-surface-variant">{item.category}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-label-md font-label-md ${getRiskBadge(item.risk)}`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${getRiskDot(item.risk)}`}></span>
                        {item.risk}
                      </span>
                    </td>
                    <td className="p-4 text-on-surface-variant text-body-sm font-body-sm">{item.updated}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-8 h-8 rounded-full hover:bg-surface-container-highest flex items-center justify-center text-on-surface-variant" title="Edit">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button className="w-8 h-8 rounded-full hover:bg-error-container hover:text-error flex items-center justify-center text-on-surface-variant transition-colors" title="Delete">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr><td colSpan="5" className="p-8 text-center text-on-surface-variant">No symptoms found matching your criteria.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Footer */}
          <div className="p-4 border-t border-outline-variant/20 flex items-center justify-between bg-surface-bright">
            <span className="text-body-sm font-body-sm text-on-surface-variant">Showing 1 to {filteredData.length} of {filteredData.length} entries</span>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-outline disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-label-md font-label-md">1</button>
              <button className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
      <FloatingButtons />
    </>
  );
}