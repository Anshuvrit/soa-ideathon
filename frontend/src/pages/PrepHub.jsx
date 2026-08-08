import { useEffect, useState } from 'react';
import client from '../api/client';
import CountdownTimer from '../components/CountdownTimer';
import ChecklistItem from '../components/ChecklistItem';
import ResourceCard from '../components/ResourceCard';
import AnnouncementBanner from '../components/AnnouncementBanner';

const DEFAULT_CHECKLIST = [
  'Form or join a compliant 6-member team',
  'Finalise your problem statement and theme',
  'Write your idea brief',
  'Prepare a working prototype or PPT',
  'Practice your pitch (2-3 minutes)',
  'Register on the official SIH portal before the deadline',
];

const DEFAULT_RESOURCES = [
  { title: 'SIH Official Website', description: 'Official rules, themes, and registration.', link: 'https://sih.gov.in' },
  { title: 'Pitch Deck Template', description: 'A simple structure for your idea presentation.', link: 'https://sih.gov.in' },
  { title: 'Problem Statement List', description: "Browse this year's official problem statements.", link: 'https://sih.gov.in/sih2025PS' },
];

export default function PrepHubPage() {
  const [content, setContent] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([client.get('/content'), client.get('/announcements')])
      .then(([c, a]) => {
        setContent(c.data.content);
        setAnnouncements(a.data.announcements || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;

  const eventDate = content?.eventDate || import.meta.env.VITE_EVENT_DATE || '2026-09-01T09:00:00.000Z';
  const eventName = content?.eventName || import.meta.env.VITE_EVENT_NAME || 'SOA Ideathon 2026';
  const checklist = content?.checklist?.length ? content.checklist : DEFAULT_CHECKLIST;
  const resources = content?.resources?.length ? content.resources : DEFAULT_RESOURCES;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-brand-900 p-6 text-white">
        <h1 className="text-xl font-bold">{eventName}</h1>
        <p className="mt-1 text-sm text-brand-200">Countdown to event day</p>
        <div className="mt-4">
          <CountdownTimer target={eventDate} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">Prep checklist</h2>
        <div className="mt-3 space-y-2">
          {checklist.map((c, i) => <ChecklistItem key={i} label={c} />)}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">Resources</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {resources.map((r, i) => <ResourceCard key={i} title={r.title} description={r.description} link={r.link} />)}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">Announcements</h2>
        <div className="mt-3 space-y-3">
          {announcements.length === 0 ? (
            <p className="text-sm text-gray-500">No announcements yet.</p>
          ) : (
            announcements.map((a) => <AnnouncementBanner key={a._id} {...a} />)
          )}
        </div>
      </section>
    </div>
  );
}
