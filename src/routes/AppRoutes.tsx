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
import WelcomePage from '../pages/WelcomePage';
import PaymentSuccessPage from '../pages/PaymentSuccessPage';
import PaymentCancelPage from '../pages/PaymentCancelPage';
import MailIntegrationPage from '../pages/MailIntegrationPage';
import GoogleCallbackPage from '../pages/GoogleCallbackPage';
import PipelinesManagementPage from '../pages/PipelinesManagementPage';
import RequireAuth from './RequireAuth';
import RequireAccess from './RequireAccess';
import PublicOnly from './PublicOnly';

const AppRoutes = () => (
  <Routes>
    <Route element={<PublicOnly />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
    </Route>
    <Route path="/welcome" element={<WelcomePage />} />
    <Route path="/payment/success" element={<PaymentSuccessPage />} />
    <Route path="/payment/cancel" element={<PaymentCancelPage />} />
    <Route path="/google/callback" element={<GoogleCallbackPage />} />
    <Route path="/forgot" element={<ForgotPasswordPage />} />
    <Route path="/reset" element={<ResetPasswordPage />} />
    <Route element={<RequireAuth />}>
      <Route element={<AppLayout />}>
        <Route path="/settings/subscription" element={<SubscriptionPage />} />
        <Route path="/settings/subscription/create" element={<CreatePlanPage />} />
        <Route element={<RequireAccess />}>
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
          <Route path="/settings/mail" element={<MailIntegrationPage />} />
          <Route path="/settings/pipelines" element={<PipelinesManagementPage />} />
        </Route>
      </Route>
    </Route>
  </Routes>
);

export default AppRoutes;
