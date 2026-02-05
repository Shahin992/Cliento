import { Route, Routes } from 'react-router-dom';

import AppLayout from '../layouts/AppLayout';
import BillingsPage from '../pages/BillingsPage';
import ContactsPage from '../pages/ContactsPage';
import DashboardPage from '../pages/DashboardPage';
import DealsPage from '../pages/DealsPage';
import DealDetailsPage from '../pages/DealDetailsPage';
import LandingPage from '../pages/LandingPage';
import ProfilePage from '../pages/ProfilePage';
import ContactDetailsPage from '../pages/ContactDetailsPage';
import TasksPage from '../pages/TasksPage';
import SubscriptionPage from '../pages/SubscriptionPage';
import SettingsPage from '../pages/SettingsPage';
import CreatePlanPage from '../pages/CreatePlanPage';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import UserManagementPage from '../pages/UserManagementPage';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/signin" element={<SignInPage />} />
    <Route path="/signup" element={<SignUpPage />} />
    <Route path="/forgot" element={<ForgotPasswordPage />} />
    <Route path="/reset" element={<ResetPasswordPage />} />
    <Route element={<AppLayout />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/deals" element={<DealsPage />} />
      <Route path="/deals/:dealId" element={<DealDetailsPage />} />
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="/contacts/:contactId" element={<ContactDetailsPage />} />
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/billings" element={<BillingsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/settings/users" element={<UserManagementPage />} />
      <Route path="/settings/subscription" element={<SubscriptionPage />} />
      <Route path="/settings/subscription/create" element={<CreatePlanPage />} />
    </Route>
  </Routes>
);

export default AppRoutes;
