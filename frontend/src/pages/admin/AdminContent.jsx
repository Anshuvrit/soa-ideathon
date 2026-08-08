import { useEffect, useState } from 'react';
import client from '../../api/client';

export default function AdminContentPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [annTitle, setAnnTitle] = useState('');
  const [annBody, setAnnBody] = useState('');
  const [postingAnn, setPostingAnn] = useState(false);

  useEffect(() => {
    client.get('/content').then((res) => setContent(res.data.content)).finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await client.put('/admin/content', content);
      setContent(res.data.content);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  async function postAnnouncement(e) {
    e.preventDefault();
    setPostingAnn(true);
    try {
      await client.post('/admin/announcements', { title: annTitle, body: annBody, isOfficial: true });
      setAnnTitle('');
      setAnnBody('');
    } finally {
      setPostingAnn(false);
    }
  }

  function updateResource(i, field, value) {
    const resources = [...content.resources];
    resources[i] = { ...resources[i], [field]: value };
    setContent({ ...content, resources });
  }

  function addResource() {
    setContent({ ...content, resources: [...(content.resources || []), { title: '', description: '', link: '' }] });
  }

  function removeResource(i) {
    setContent({ ...content, resources: content.resources.filter((_, idx) => idx !== i) });
  }

  function updateChecklistItem(i, value) {
    const checklist = [...content.checklist];
    checklist[i] = value;
    setContent({ ...content, checklist });
  }

  function addChecklistItem() {
    setContent({ ...content, checklist: [...(content.checklist || []), ''] });
  }

  function removeChecklistItem(i) {
    setContent({ ...content, checklist: content.checklist.filter((_, idx) => idx !== i) });
  }

  if (loading || !content) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Content</h1>
        {saved && <p className="mt-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Saved.</p>}
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
        <h2 className="font-bold text-gray-900">Event details</h2>
        <div>
          <label className="text-sm font-medium text-gray-700">Event name</label>
          <input
            value={content.eventName}
            onChange={(e) => setContent({ ...content, eventName: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Event date</label>
          <input
            type="datetime-local"
            value={content.eventDate ? new Date(content.eventDate).toISOString().slice(0, 16) : ''}
            onChange={(e) => setContent({ ...content, eventDate: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Rules (markdown/plain text)</label>
          <textarea
            value={content.rulesMarkdown}
            onChange={(e) => setContent({ ...content, rulesMarkdown: e.target.value })}
            rows={4}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
        <h2 className="font-bold text-gray-900">Checklist</h2>
        {(content.checklist || []).map((c, i) => (
          <div key={i} className="flex gap-2">
            <input value={c} onChange={(e) => updateChecklistItem(i, e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm" />
            <button onClick={() => removeChecklistItem(i)} className="text-xs text-red-600">Remove</button>
          </div>
        ))}
        <button onClick={addChecklistItem} className="text-xs font-medium text-brand-600 hover:underline">+ Add item</button>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
        <h2 className="font-bold text-gray-900">Resources</h2>
        {(content.resources || []).map((r, i) => (
          <div key={i} className="space-y-1 rounded-lg border border-gray-100 p-3">
            <input placeholder="Title" value={r.title} onChange={(e) => updateResource(i, 'title', e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm" />
            <input placeholder="Description" value={r.description} onChange={(e) => updateResource(i, 'description', e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm" />
            <input placeholder="Link" value={r.link} onChange={(e) => updateResource(i, 'link', e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm" />
            <button onClick={() => removeResource(i)} className="text-xs text-red-600">Remove</button>
          </div>
        ))}
        <button onClick={addResource} className="text-xs font-medium text-brand-600 hover:underline">+ Add resource</button>
      </section>

      <button onClick={save} disabled={saving} className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
        {saving ? 'Saving...' : 'Save all changes'}
      </button>

      <section className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
        <h2 className="font-bold text-gray-900">Post an announcement</h2>
        <form onSubmit={postAnnouncement} className="space-y-3">
          <input required value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} placeholder="Title" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <textarea required value={annBody} onChange={(e) => setAnnBody(e.target.value)} placeholder="Body" rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <button type="submit" disabled={postingAnn} className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
            {postingAnn ? 'Posting...' : 'Post announcement'}
          </button>
        </form>
      </section>
    </div>
  );
}
