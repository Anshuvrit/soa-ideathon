import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import LandingPage from './pages/Landing';
import SignInPage from './pages/auth/SignIn';
import NotFoundPage from './pages/NotFound';

import ProfileSetupPage from './pages/profile/ProfileSetup';
import ProfileEditPage from './pages/profile/ProfileEdit';
import PublicProfilePage from './pages/profile/PublicProfile';

import TeamsDirectoryPage from './pages/teams/TeamsDirectory';
import CreateTeamPage from './pages/teams/CreateTeam';
import TeamDetailPage from './pages/teams/TeamDetail';
import MyTeamPage from './pages/teams/MyTeam';

import PrepHubPage from './pages/PrepHub';
import MentorsPage from './pages/Mentors';
import NotificationsPage from './pages/Notifications';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsers';
import AdminTeamsPage from './pages/admin/AdminTeams';
import AdminContentPage from './pages/admin/AdminContent';
import AdminExportPage from './pages/admin/AdminExport';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/signin" element={<SignInPage />} />

        {/* Authenticated (any signed-in student) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile/setup" element={<ProfileSetupPage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
          <Route path="/profile/:id" element={<PublicProfilePage />} />

          <Route path="/teams" element={<TeamsDirectoryPage />} />
          <Route path="/teams/create" element={<CreateTeamPage />} />
          <Route path="/teams/:id" element={<TeamDetailPage />} />
          <Route path="/my-team" element={<MyTeamPage />} />

          <Route path="/prep" element={<PrepHubPage />} />
          <Route path="/mentors" element={<MentorsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>

        {/* Admin only */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/teams" element={<AdminTeamsPage />} />
          <Route path="/admin/content" element={<AdminContentPage />} />
          <Route path="/admin/export" element={<AdminExportPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
