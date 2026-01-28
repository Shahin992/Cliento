import { Route, Routes } from 'react-router-dom';

import AppLayout from '../layouts/AppLayout';
import BillingsPage from '../pages/BillingsPage';
import ContactsPage from '../pages/ContactsPage';
import DashboardPage from '../pages/DashboardPage';
import DealsPage from '../pages/DealsPage';
import DealDetailsPage from '../pages/DealDetailsPage';
import ProfilePage from '../pages/ProfilePage';
import ContactDetailsPage from '../pages/ContactDetailsPage';
import TasksPage from '../pages/TasksPage';
import SubscriptionPage from '../pages/SubscriptionPage';
import SettingsPage from '../pages/SettingsPage';
import CreatePlanPage from '../pages/CreatePlanPage';

const AppRoutes = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/deals" element={<DealsPage />} />
      <Route path="/deals/:dealId" element={<DealDetailsPage />} />
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="/contacts/:contactId" element={<ContactDetailsPage />} />
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/billings" element={<BillingsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/settings/subscription" element={<SubscriptionPage />} />
      <Route path="/settings/subscription/create" element={<CreatePlanPage />} />
    </Route>
  </Routes>
);

export default AppRoutes;
