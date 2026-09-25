// frontend/src/pages/AdminSettings.jsx
import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { adminApi } from '../api/admin';
import { useAuth } from '../context/AuthContext';

export default function AdminSettings() {
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    country: 'Sri Lanka',
    role: '',
    createdAt: null,
  });
  const [pwd, setPwd] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getProfile();
      const p = data.profile || data;
      setProfile({
        fullName: p.fullName || '',
        email: p.email || '',
        phone: p.phone || '',
        city: p.city || '',
        country: p.country || 'Sri Lanka',
        role: p.role || '',
        createdAt: p.createdAt || null,
      });
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setSuccess('');
    try {
      await adminApi.updateProfile({
        fullName: profile.fullName,
        phone: profile.phone,
        city: profile.city,
        country: profile.country,
      });
      if (refreshUser) await refreshUser().catch(() => {});
      setSuccess('Profile updated successfully');
    } catch (err) {
      alert(err.message || 'Save failed');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (pwd.newPassword !== pwd.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    if (pwd.newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    setSavingPassword(true);
    setSuccess('');
    try {
      await adminApi.changePassword({
        currentPassword: pwd.currentPassword,
        newPassword: pwd.newPassword,
      });
      setSuccess('Password changed successfully');
      setPwd({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      alert(err.message || 'Password change failed');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <AdminLayout activePage="settings">
      <div className="mb-6">
        <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-background mb-1">
          Settings
        </h2>
        <p className="text-body-md text-on-surface-variant">
          Manage your admin profile and account security.
        </p>
      </div>

      {success && (
        <div className="mb-4 bg-primary-container/30 text-on-primary-container px-4 py-3 rounded-xl flex items-center gap-2">
          <span className="material-symbols-outlined">check_circle</span>
          {success}
        </div>
      )}

      {loading ? (
        <div className="p-16 flex justify-center"><LoadingSpinner /></div>
      ) : error ? (
        <div className="p-16 text-center">
          <p className="text-error mb-4">{error}</p>
          <button onClick={load} className="px-6 py-2 rounded-full bg-primary text-on-primary">Retry</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Form */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl shadow-soft p-6 border border-outline-variant/10">
            <h3 className="text-headline-sm font-bold mb-4">Profile</h3>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-label-md mb-1">Full name</label>
                  <input
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-full border border-outline-variant bg-surface"
                  />
                </div>
                <div>
                  <label className="block text-label-md mb-1">Email</label>
                  <input
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-3 rounded-full border border-outline-variant bg-surface-container-low text-on-surface-variant cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-label-md mb-1">Phone</label>
                  <input
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-full border border-outline-variant bg-surface"
                  />
                </div>
                <div>
                  <label className="block text-label-md mb-1">City</label>
                  <input
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-full border border-outline-variant bg-surface"
                  />
                </div>
                <div>
                  <label className="block text-label-md mb-1">Country</label>
                  <input
                    value={profile.country}
                    onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                    className="w-full px-4 py-3 rounded-full border border-outline-variant bg-surface"
                  />
                </div>
                <div>
                  <label className="block text-label-md mb-1">Role</label>
                  <input
                    value={profile.role}
                    disabled
                    className="w-full px-4 py-3 rounded-full border border-outline-variant bg-surface-container-low text-on-surface-variant cursor-not-allowed"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-3 rounded-full bg-primary text-on-primary font-semibold disabled:opacity-50"
              >
                {savingProfile ? 'Saving…' : 'Save Profile'}
              </button>
            </form>
          </div>

          {/* Account info */}
          <div className="bg-surface-container-lowest rounded-xl shadow-soft p-6 border border-outline-variant/10">
            <h3 className="text-headline-sm font-bold mb-4">Account</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-body-sm text-on-surface-variant">Joined</span>
                <span className="text-body-sm font-semibold">
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-sm text-on-surface-variant">Role</span>
                <span className="text-body-sm font-semibold">{profile.role}</span>
              </div>
            </div>
          </div>

          {/* Password Form */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl shadow-soft p-6 border border-outline-variant/10">
            <h3 className="text-headline-sm font-bold mb-4">Change Password</h3>
            <form onSubmit={handlePasswordSave} className="space-y-4">
              <div>
                <label className="block text-label-md mb-1">Current password</label>
                <input
                  type="password"
                  value={pwd.currentPassword}
                  onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 rounded-full border border-outline-variant bg-surface"
                  required
                />
              </div>
              <div>
                <label className="block text-label-md mb-1">New password</label>
                <input
                  type="password"
                  value={pwd.newPassword}
                  onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
                  className="w-full px-4 py-3 rounded-full border border-outline-variant bg-surface"
                  required
                />
              </div>
              <div>
                <label className="block text-label-md mb-1">Confirm new password</label>
                <input
                  type="password"
                  value={pwd.confirmPassword}
                  onChange={(e) => setPwd({ ...pwd, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 rounded-full border border-outline-variant bg-surface"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={savingPassword}
                className="px-6 py-3 rounded-full bg-primary text-on-primary font-semibold disabled:opacity-50"
              >
                {savingPassword ? 'Saving…' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}