import { useState } from 'react';
import client from '../api/client';
import { SKILLS, THEMES } from '../constants';

export default function ProfileForm({ initial, onSaved, submitLabel = 'Save profile' }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    college: initial?.college || '',
    branch: initial?.branch || '',
    year: initial?.year || '',
    skills: initial?.skills || [],
    themes: initial?.themes || [],
    contactPreference: initial?.contactPreference || 'in-app',
    isFemale: initial?.isFemale || false,
    socials: {
      github: initial?.socials?.github || '',
      linkedin: initial?.socials?.linkedin || '',
      portfolio: initial?.socials?.portfolio || '',
    },
  });
  const [customSkill, setCustomSkill] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function toggle(list, value) {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  }

  function addCustomSkill() {
    const v = customSkill.trim();
    if (v && !form.skills.includes(v)) {
      setForm((f) => ({ ...f, skills: [...f.skills, v] }));
    }
    setCustomSkill('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const res = await client.put('/profile', { ...form, year: form.year ? Number(form.year) : undefined });
      if (onSaved) onSaved(res.data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-gray-700">Full name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">College</label>
          <input
            required
            value={form.college}
            onChange={(e) => setForm((f) => ({ ...f, college: e.target.value }))}
            placeholder="e.g. SOA University, ITER"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Branch</label>
          <input
            value={form.branch}
            onChange={(e) => setForm((f) => ({ ...f, branch: e.target.value }))}
            placeholder="e.g. CSE, ECE"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Year</label>
          <select
            value={form.year}
            onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          >
            <option value="">Select year</option>
            {[1, 2, 3, 4].map((y) => (
              <option key={y} value={y}>Year {y}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Skills</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {SKILLS.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setForm((f) => ({ ...f, skills: toggle(f.skills, s) }))}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                form.skills.includes(s)
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-gray-300 text-gray-600 hover:border-brand-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            placeholder="Add a custom skill"
            className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
          />
          <button type="button" onClick={addCustomSkill} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:border-brand-300">
            Add
          </button>
        </div>
        {form.skills.filter((s) => !SKILLS.includes(s)).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {form.skills.filter((s) => !SKILLS.includes(s)).map((s) => (
              <span key={s} className="flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs text-brand-700">
                {s}
                <button type="button" onClick={() => setForm((f) => ({ ...f, skills: f.skills.filter((x) => x !== s) }))}>
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Themes you're interested in</label>
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="text-sm font-medium text-gray-700">GitHub</label>
          <input
            value={form.socials.github}
            onChange={(e) => setForm((f) => ({ ...f, socials: { ...f.socials, github: e.target.value } }))}
            placeholder="https://github.com/..."
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">LinkedIn</label>
          <input
            value={form.socials.linkedin}
            onChange={(e) => setForm((f) => ({ ...f, socials: { ...f.socials, linkedin: e.target.value } }))}
            placeholder="https://linkedin.com/in/..."
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Portfolio</label>
          <input
            value={form.socials.portfolio}
            onChange={(e) => setForm((f) => ({ ...f, socials: { ...f.socials, portfolio: e.target.value } }))}
            placeholder="https://..."
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">Contact preference</label>
          <select
            value={form.contactPreference}
            onChange={(e) => setForm((f) => ({ ...f, contactPreference: e.target.value }))}
            className="mt-1 block rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          >
            <option value="in-app">In-app messages</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
          </select>
        </div>
        <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
          <input
            type="checkbox"
            checked={form.isFemale}
            onChange={(e) => setForm((f) => ({ ...f, isFemale: e.target.checked }))}
            className="h-4 w-4 accent-brand-600"
          />
          <span className="text-sm text-gray-700">I am a female student</span>
        </label>
      </div>
      <p className="text-xs text-gray-400">
        This field is kept private and is used only to check the "at least one female member" team rule. It is never shown on your public profile.
      </p>

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {saving ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
