const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminExportPage() {
  const token = localStorage.getItem('token');

  async function download() {
    const res = await fetch(`${API_URL}/admin/export`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teams-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-lg text-center">
      <h1 className="text-2xl font-bold text-gray-900">Export Data</h1>
      <p className="mt-2 text-sm text-gray-500">
        Download a CSV of all teams: name, leader, members, college, status, and submission time.
      </p>
      <button
        onClick={download}
        className="mt-6 inline-block rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Download teams.csv
      </button>
      <p className="mt-3 text-xs text-gray-400">This action is logged in the audit trail.</p>
    </div>
  );
}
