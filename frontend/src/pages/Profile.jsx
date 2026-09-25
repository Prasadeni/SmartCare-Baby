// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import Button from '../components/Button';
import FloatingButtons from '../components/FloatingButtons';
import LoadingSpinner from '../components/LoadingSpinner';
import PhotoPicker from '../components/PhotoPicker';
import { useAuth } from '../context/AuthContext';
import { usersApi } from '../api/users';
import { getInitial } from '../utils/formatters';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    country: 'Sri Lanka',
    avatarUrl: '',
  });

  useEffect(() => {
    async function load() {
      try {
        const me = await usersApi.getMe();
        setFormData({
          fullName: me.fullName || '',
          phone: me.phone || '',
          city: me.city || '',
          country: me.country || 'Sri Lanka',
          avatarUrl: me.avatarUrl || '',
        });
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await usersApi.updateMe(formData);
      await refreshUser();
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const initial = getInitial(formData.fullName || user?.fullName);

  return (
    <>
      <div className="min-h-screen bg-background text-on-background font-body-md">
        <Navbar />

        <main className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl p-8 md:p-10 soft-shadow border border-outline-variant/30">

            <div className="text-center mb-8">
              <h2 className="font-headline text-3xl font-bold text-primary">
                Edit Profile
              </h2>
              <p className="mt-2 text-body-md text-on-surface-variant">
                Update your personal information
              </p>
            </div>

            {error && (
              <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-body-sm flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}
            {success && (
              <div className="bg-primary-fixed text-on-primary-fixed px-4 py-3 rounded-xl text-body-sm flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                {success}
              </div>
            )}

            {loading ? (
              <LoadingSpinner />
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="pb-2">
                  <PhotoPicker
                    value={formData.avatarUrl}
                    onChange={(url) =>
                      setFormData((prev) => ({ ...prev, avatarUrl: url }))
                    }
                    size="w-28 h-28"
                    fallback={initial}
                    hint="JPG or PNG · Max 2 MB · Leave blank to use initials"
                  />
                </div>

                <Input
                  label="Full Name"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  type="text"
                />

                <Input
                  label="Phone Number"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                />

                <Input
                  label="City"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  type="text"
                />

                <Input
                  label="Country"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  type="text"
                />

                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </Button>

                <div className="text-center pt-2">
                  <Link
                    to="/dashboard"
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Cancel and go back
                  </Link>
                </div>
              </form>
            )}
          </div>
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}