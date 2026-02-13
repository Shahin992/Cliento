import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import {
  CurrencyExchange,
  Dashboard,
  RequestQuote,
  SettingsOutlined,
  TaskAltOutlined,
  PeopleOutlined,
} from '@mui/icons-material';

import Sidebar from './Sidebar';
import Topbar from './Topbar';
import PwaInstallButton from '../components/PwaInstallButton';
import AddDealModal from '../components/deals/modals/AddDealModal';
import AddContactModal from '../components/contacts/modals/AddContactModal';
import { pipelines as seedPipelines } from '../data/pipelines';

const drawerWidth = 240;
const collapsedWidth = 80;

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: <Dashboard sx={{ width: 20, height: 20 }} /> },
  { label: 'Deals', to: '/deals', icon: <CurrencyExchange sx={{ width: 20, height: 20 }} /> },
  { label: 'Contacts', to: '/contacts', icon: <PeopleOutlined sx={{ width: 20, height: 20 }} /> },
  { label: 'Tasks', to: '/tasks', icon: <TaskAltOutlined sx={{ width: 20, height: 20 }} /> },
  { label: 'Billing', to: '/billings', icon: <RequestQuote sx={{ width: 20, height: 20 }} /> },
  { label: 'Settings', to: '/settings', icon: <SettingsOutlined sx={{ width: 20, height: 20 }} /> },
];

const AppLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const currentDrawerWidth = isCollapsed ? collapsedWidth : drawerWidth;
  const topbarMinHeight = { xs: 96, sm: 72 };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        maxWidth: '100vw',
        bgcolor: '#f3f6fb',
        color: '#1f2937',
        overflowX: 'hidden',
      }}
    >
      <Topbar
        isMobile={isMobile}
        currentDrawerWidth={currentDrawerWidth}
        onOpenMobile={() => setIsMobileOpen(true)}
        minHeight={topbarMinHeight}
        onOpenAddDeal={() => setIsAddDealOpen(true)}
        onOpenAddContact={() => setIsAddContactOpen(true)}
      />
      <Sidebar
        navItems={navItems}
        isCollapsed={isCollapsed}
        isMobile={isMobile}
        isMobileOpen={isMobileOpen}
        currentDrawerWidth={currentDrawerWidth}
        drawerWidth={drawerWidth}
        topbarMinHeight={topbarMinHeight}
        onCloseMobile={() => setIsMobileOpen(false)}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />

      <Box
        component="main"
        sx={{
          flex: '1 1 auto',
          minWidth: 0,
          px: 0,
          py: 0,
          width: '100%',
          maxWidth: '100%',
        }}
      >
        <Box sx={{ height: topbarMinHeight, width:'100%', margin:'16px' }} />
        <Outlet />
      </Box>
      <PwaInstallButton />
     {isAddDealOpen && ( 
      <AddDealModal
        open={isAddDealOpen}
        pipelines={seedPipelines}
        onClose={() => setIsAddDealOpen(false)}
        onSave={() => setIsAddDealOpen(false)}
      />
      )}
     {isAddContactOpen && ( 
      <AddContactModal
        open={isAddContactOpen}
        onClose={() => setIsAddContactOpen(false)}
        onSave={() => setIsAddContactOpen(false)}
      />)}
    </Box>
  );
};

export default AppLayout;
