import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LINKS = [
  { to: '/teams', label: 'Find Teams' },
  { to: '/my-team', label: 'My Team' },
  { to: '/prep', label: 'Prep Hub' },
  { to: '/mentors', label: 'Mentors' },
];

export default function Navbar() {
  const { user, status, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleSignOut() {
    signOut();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 font-bold text-white">S</span>
          <span className="text-lg font-bold text-brand-900">TeamUp</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {status === 'authenticated' &&
            LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm font-medium transition ${
                  location.pathname === l.to ? 'text-brand-700' : 'text-gray-600 hover:text-brand-700'
                }`}
              >
                {l.label}
              </Link>
            ))}
          {user?.isAdmin && (
            <Link to="/admin" className="text-sm font-medium text-gray-600 hover:text-brand-700">
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {status === 'authenticated' ? (
            <>
              <Link to="/notifications" className="text-sm text-gray-600 hover:text-brand-700">
                Notifications
              </Link>
              <Link to="/profile/edit" className="text-sm text-gray-600 hover:text-brand-700">
                {user?.name || 'Profile'}
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:border-brand-300 hover:text-brand-700"
              >
                Sign out
              </button>
            </>
          ) : status === 'loading' ? null : (
            <Link
              to="/auth/signin"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Sign in
            </Link>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-brand-100 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            {status === 'authenticated' &&
              LINKS.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-sm font-medium text-gray-700">
                  {l.label}
                </Link>
              ))}
            {user?.isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="text-sm font-medium text-gray-700">
                Admin
              </Link>
            )}
            {status === 'authenticated' ? (
              <>
                <Link to="/notifications" onClick={() => setOpen(false)} className="text-sm text-gray-700">
                  Notifications
                </Link>
                <Link to="/profile/edit" onClick={() => setOpen(false)} className="text-sm text-gray-700">
                  Profile
                </Link>
                <button onClick={handleSignOut} className="text-left text-sm text-red-600">
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/auth/signin" onClick={() => setOpen(false)} className="text-sm font-semibold text-brand-700">
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
