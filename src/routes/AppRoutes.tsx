import { Route, Routes } from 'react-router-dom';

import AppLayout from '../layouts/AppLayout';
import BillingsPage from '../pages/BillingsPage';
import ContactsPage from '../pages/ContactsPage';
import DashboardPage from '../pages/DashboardPage';
import DealsPage from '../pages/DealsPage';
import ProfilePage from '../pages/ProfilePage';

const AppRoutes = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/deals" element={<DealsPage />} />
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="/billings" element={<BillingsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Route>
  </Routes>
);

export default AppRoutes;
