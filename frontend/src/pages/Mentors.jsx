import { useEffect, useState } from 'react';
import client from '../api/client';

export default function MentorsPage() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sentTo, setSentTo] = useState({});

  useEffect(() => {
    client
      .get('/mentors')
      .then((res) => setMentors(res.data.mentors || []))
      .finally(() => setLoading(false));
  }, []);

  async function requestReview(id) {
    try {
      await client.post(`/mentors/${id}/request`, { message: 'Would love your feedback on our idea!' });
      setSentTo((s) => ({ ...s, [id]: true }));
    } catch {
      // no-op; button just won't flip to "sent"
    }
  }

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Mentors</h1>
      <p className="mt-1 text-sm text-gray-500">Request feedback and guidance from mentors before the event.</p>

      {mentors.length === 0 ? (
        <p className="mt-8 text-sm text-gray-500">No mentors have been added yet. Check back soon.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {mentors.map((m) => (
            <div key={m._id} className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="font-bold text-gray-900">{m.name}</h3>
              {m.title && <p className="text-sm text-gray-500">{m.title}</p>}
              {m.bio && <p className="mt-2 text-sm text-gray-600">{m.bio}</p>}
              {m.expertise?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.expertise.map((e) => (
                    <span key={e} className="rounded-full bg-brand-50 px-2.5 py-1 text-xs text-brand-700">{e}</span>
                  ))}
                </div>
              )}
              <button
                onClick={() => requestReview(m._id)}
                disabled={sentTo[m._id]}
                className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
              >
                {sentTo[m._id] ? 'Request sent' : 'Request review'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
