import { useEffect, useState } from 'react';
import client from '../../api/client';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await client.get(`/admin/users?q=${encodeURIComponent(q)}`);
    setUsers(res.data.users || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggle(id, field, value) {
    await client.put(`/admin/users/${id}`, { [field]: value });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>

      <div className="mt-4 flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
          placeholder="Search name, email, or college..."
          className="w-full max-w-sm rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
        <button onClick={load} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:border-brand-300">
          Search
        </button>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-gray-500">Loading...</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 text-xs uppercase text-gray-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">College</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-gray-800">{u.name}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3 text-gray-500">{u.college}</td>
                  <td className="px-4 py-3">
                    {u.isSuspended ? (
                      <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-700">Suspended</span>
                    ) : u.isVerified ? (
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700">Verified</span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">Unverified</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => toggle(u._id, 'isVerified', !u.isVerified)} className="text-xs font-medium text-brand-600 hover:underline">
                        {u.isVerified ? 'Unverify' : 'Verify'}
                      </button>
                      <button onClick={() => toggle(u._id, 'isSuspended', !u.isSuspended)} className="text-xs font-medium text-red-600 hover:underline">
                        {u.isSuspended ? 'Unsuspend' : 'Suspend'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
