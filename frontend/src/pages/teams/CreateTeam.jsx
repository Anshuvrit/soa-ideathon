import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { SKILLS, THEMES } from '../../constants';

export default function CreateTeamPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', shortDesc: '', requiredSkills: [], themes: [] });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function toggle(list, value) {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const res = await client.post('/teams', form);
      navigate(`/teams/${res.data.team._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900">Create a team</h1>
      <p className="mt-1 text-sm text-gray-500">
        You'll be the team leader. Your college is used automatically — teammates must be from the same college.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-xl border border-gray-200 bg-white p-6">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <div>
          <label className="text-sm font-medium text-gray-700">Team name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Short description</label>
          <textarea
            value={form.shortDesc}
            onChange={(e) => setForm((f) => ({ ...f, shortDesc: e.target.value }))}
            rows={3}
            maxLength={240}
            placeholder="What's your idea or focus area?"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Roles / skills you need</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {SKILLS.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setForm((f) => ({ ...f, requiredSkills: toggle(f.requiredSkills, s) }))}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                  form.requiredSkills.includes(s)
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-gray-300 text-gray-600 hover:border-brand-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Themes</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {THEMES.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setForm((f) => ({ ...f, themes: toggle(f.themes, t) }))}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                  form.themes.includes(t)
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-gray-300 text-gray-600 hover:border-brand-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {saving ? 'Creating...' : 'Create team'}
        </button>
      </form>
    </div>
  );
}
