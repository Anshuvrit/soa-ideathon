import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfileForm from '../../components/ProfileForm';

export default function ProfileSetupPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.profileComplete) navigate('/teams');
  }, [user, navigate]);

  if (!user) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Complete your profile</h1>
      <p className="mt-1 text-sm text-gray-500">
        This helps other students find you as a teammate, and lets us enforce team rules automatically.
      </p>
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <ProfileForm
          initial={user}
          onSaved={async () => {
            await refreshUser();
            navigate('/teams');
          }}
          submitLabel="Complete profile & continue"
        />
      </div>
    </div>
  );
}
