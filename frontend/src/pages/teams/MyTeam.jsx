import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import SixSeatIndicator from '../../components/SixSeatIndicator';
import ComplianceBadge from '../../components/ComplianceBadge';
import ConfirmModal from '../../components/ConfirmModal';

export default function MyTeamPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ideaBrief, setIdeaBrief] = useState('');
  const [newTask, setNewTask] = useState('');
  const [savingBrief, setSavingBrief] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);

  async function load() {
    if (!user?.teamId) {
      setLoading(false);
      return;
    }
    try {
      const res = await client.get(`/teams/${user.teamId}`);
      setTeam(res.data.team);
      setIdeaBrief(res.data.team.ideaBrief || '');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.teamId]);

  async function saveBrief() {
    setSavingBrief(true);
    setError('');
    try {
      const res = await client.put(`/teams/${team._id}`, { ideaBrief });
      setTeam(res.data.team);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingBrief(false);
    }
  }

  async function addTask() {
    if (!newTask.trim()) return;
    const tasks = [
      ...(team.tasks || []).map((t) => ({ title: t.title, owner: t.owner?._id || t.owner, status: t.status, dueDate: t.dueDate })),
      { title: newTask.trim(), status: 'todo' },
    ];
    await updateTasks(tasks);
    setNewTask('');
  }

  async function updateTasks(tasks) {
    setError('');
    try {
      const res = await client.put(`/teams/${team._id}`, { tasks });
      setTeam(res.data.team);
    } catch (err) {
      setError(err.message);
    }
  }

  function cycleStatus(s) {
    return s === 'todo' ? 'in-progress' : s === 'in-progress' ? 'done' : 'todo';
  }

  async function toggleTask(idx) {
    const tasks = team.tasks.map((t, i) =>
      i === idx
        ? { title: t.title, owner: t.owner?._id || t.owner, status: cycleStatus(t.status), dueDate: t.dueDate }
        : { title: t.title, owner: t.owner?._id || t.owner, status: t.status, dueDate: t.dueDate }
    );
    await updateTasks(tasks);
  }

  async function removeTask(idx) {
    const tasks = team.tasks
      .filter((_, i) => i !== idx)
      .map((t) => ({ title: t.title, owner: t.owner?._id || t.owner, status: t.status, dueDate: t.dueDate }));
    await updateTasks(tasks);
  }

  async function submitTeam() {
    setError('');
    try {
      const res = await client.post(`/teams/${team._id}/submit`);
      setTeam(res.data.team);
    } catch (err) {
      setError(err.message);
    } finally {
      setConfirmSubmit(false);
    }
  }

  async function removeMember(uid) {
    setError('');
    try {
      await client.delete(`/teams/${team._id}/members/${uid}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function leaveTeam() {
    setError('');
    try {
      await client.post(`/teams/${team._id}/leave`);
      await refreshUser();
      navigate('/teams');
    } catch (err) {
      setError(err.message);
    } finally {
      setConfirmLeave(false);
    }
  }

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;

  if (!user?.teamId || !team) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-xl font-bold text-gray-900">You're not in a team yet</h1>
        <p className="mt-2 text-sm text-gray-500">Create your own team or browse existing ones looking for teammates.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/teams/create" className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
            Create a team
          </Link>
          <Link to="/teams" className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-brand-300">
            Browse teams
          </Link>
        </div>
      </div>
    );
  }

  const isLeader = String(team.leaderId?._id) === String(user._id);
  const hasFemale = team.members?.some((m) => m.isFemale);
  const sizeOk = team.members?.length === 6;

  return (
    <div className="mx-auto max-w-2xl">
      {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
            <p className="text-sm text-gray-500">{team.college}</p>
          </div>
          <StatusBadge status={team.status} />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <SixSeatIndicator filled={team.members?.length || 0} />
          <ComplianceBadge label="6 members" ok={sizeOk} />
          <ComplianceBadge label="Female member" ok={!!hasFemale} />
        </div>

        <div className="mt-5">
          <h3 className="text-xs font-semibold uppercase text-gray-400">Members</h3>
          <ul className="mt-2 space-y-2">
            {team.members?.map((m) => (
              <li key={m._id} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                <span className="text-sm text-gray-700">
                  {m.name} {String(m._id) === String(team.leaderId?._id) && <span className="text-xs text-brand-600">(Leader)</span>}
                </span>
                {isLeader && String(m._id) !== String(team.leaderId?._id) && !team.isLocked && (
                  <button onClick={() => removeMember(m._id)} className="text-xs text-red-600 hover:underline">
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {!team.isLocked && !isLeader && (
          <button onClick={() => setConfirmLeave(true)} className="mt-4 text-xs text-red-600 hover:underline">
            Leave this team
          </button>
        )}

        <div className="mt-6 border-t border-gray-100 pt-5">
          <h3 className="text-xs font-semibold uppercase text-gray-400">Idea brief</h3>
          <textarea
            value={ideaBrief}
            onChange={(e) => setIdeaBrief(e.target.value)}
            disabled={team.isLocked}
            rows={5}
            maxLength={4000}
            placeholder="Describe your idea, problem statement, and approach..."
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none disabled:bg-gray-50"
          />
          {!team.isLocked && (
            <button
              onClick={saveBrief}
              disabled={savingBrief}
              className="mt-2 rounded-lg border border-gray-300 px-4 py-1.5 text-xs font-semibold text-gray-700 hover:border-brand-300 disabled:opacity-60"
            >
              {savingBrief ? 'Saving...' : 'Save brief'}
            </button>
          )}
        </div>

        <div className="mt-6 border-t border-gray-100 pt-5">
          <h3 className="text-xs font-semibold uppercase text-gray-400">Tasks</h3>
          <div className="mt-2 space-y-2">
            {team.tasks?.map((t, i) => (
              <div key={t._id || i} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                <button onClick={() => toggleTask(i)} className="flex items-center gap-2 text-left text-sm">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      t.status === 'done'
                        ? 'bg-green-100 text-green-700'
                        : t.status === 'in-progress'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {t.status}
                  </span>
                  <span className={t.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-700'}>{t.title}</span>
                </button>
                {!team.isLocked && (
                  <button onClick={() => removeTask(i)} className="text-xs text-red-600 hover:underline">
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          {!team.isLocked && (
            <div className="mt-3 flex gap-2">
              <input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a task..."
                className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
              />
              <button onClick={addTask} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:border-brand-300">
                Add
              </button>
            </div>
          )}
        </div>

        {isLeader && !team.isLocked && (
          <div className="mt-6 border-t border-gray-100 pt-5">
            <button
              onClick={() => setConfirmSubmit(true)}
              className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Submit team
            </button>
            <p className="mt-2 text-xs text-gray-400">
              Requires exactly 6 members, at least one female member, and an idea brief. Locks the roster once submitted.
            </p>
          </div>
        )}

        {team.status === 'submitted' && (
          <p className="mt-6 rounded-lg bg-purple-50 px-3 py-2 text-sm text-purple-700">
            Your team has been submitted and is under review.
          </p>
        )}
      </div>

      <ConfirmModal
        open={confirmSubmit}
        title="Submit this team?"
        description="Once submitted, the roster will be locked. An admin can reopen it if needed."
        confirmLabel="Submit"
        onConfirm={submitTeam}
        onCancel={() => setConfirmSubmit(false)}
      />
      <ConfirmModal
        open={confirmLeave}
        title="Leave this team?"
        description="You'll be able to join or create another team afterwards."
        confirmLabel="Leave"
        danger
        onConfirm={leaveTeam}
        onCancel={() => setConfirmLeave(false)}
      />
    </div>
  );
}
