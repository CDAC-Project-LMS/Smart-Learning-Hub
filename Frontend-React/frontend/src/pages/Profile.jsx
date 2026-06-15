import React, { useEffect, useState } from 'react';
import { userApi } from '../api/userApi';
import { authApi } from '../api/authApi';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Profile() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    userApi.getProfile()
      .then(({ data }) => {
        setProfile(data);
        setProfileForm({ name: data.name, phone: data.phone || '' });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const { data } = await userApi.updateProfile(profileForm);
      setProfile(data);
      showToast('Profile updated');
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not update profile', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsSavingPassword(true);
    try {
      await authApi.changePassword(passwordForm);
      showToast('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not change password', 'error');
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (isLoading || !profile) return <LoadingSpinner fullPage label="Loading profile…" />;

  return (
    <div className="container py-5" style={{ maxWidth: 560 }}>
      <div className="eyebrow mb-1">Account</div>
      <h2 className="mb-4">Your profile</h2>

      <div className="card p-4 mb-4">
        <h6 className="mb-3">Personal details</h6>
        <form onSubmit={handleProfileSubmit}>
          <div className="mb-3">
            <label className="form-label small">Email</label>
            <input className="form-control" value={profile.email} disabled />
          </div>
          <div className="mb-3">
            <label className="form-label small">Full name</label>
            <input
              className="form-control"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label small">Phone</label>
            <input
              className="form-control"
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={isSavingProfile}>
            {isSavingProfile ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>

      <div className="card p-4">
        <h6 className="mb-3">Change password</h6>
        <form onSubmit={handlePasswordSubmit}>
          <div className="mb-3">
            <label className="form-label small">Current password</label>
            <input
              type="password" className="form-control"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label small">New password</label>
            <input
              type="password" className="form-control" minLength={6}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required
            />
          </div>
          <button className="btn btn-outline-primary" type="submit" disabled={isSavingPassword}>
            {isSavingPassword ? 'Updating…' : 'Change password'}
          </button>
        </form>
      </div>
    </div>
  );
}
