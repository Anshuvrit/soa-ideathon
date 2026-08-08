import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProfileForm from '../../components/ProfileForm';

export default function ProfileEditPage() {
  const { user, refreshUser } = useAuth();
  const [saved, setSaved] = useState(false);

  if (!user) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Edit profile</h1>
      {saved && <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Profile updated.</p>}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <ProfileForm
          initial={user}
          onSaved={async () => {
            await refreshUser();
            setSaved(true);
          }}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
