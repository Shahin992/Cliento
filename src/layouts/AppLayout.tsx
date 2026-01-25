import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import {
  CurrencyExchange,
  Dashboard,
  PeopleOutlined,
  Person2Outlined,
  RequestQuote,
} from '@mui/icons-material';

import Sidebar from './Sidebar';
import Topbar from './Topbar';

const drawerWidth = 240;
const collapsedWidth = 80;

const navItems = [
  { label: 'Dashboard', to: '/', icon: <Dashboard sx={{ width: 20, height: 20 }} /> },
  { label: 'Deals', to: '/deals', icon: <CurrencyExchange sx={{ width: 20, height: 20 }} /> },
  { label: 'Contacts', to: '/contacts', icon: <PeopleOutlined sx={{ width: 20, height: 20 }} /> },
  { label: 'Billing', to: '/billings', icon: <RequestQuote sx={{ width: 20, height: 20 }} /> },
  { label: 'My Profile', to: '/profile', icon: <Person2Outlined sx={{ width: 20, height: 20 }} /> },
];

const pageTitleMap: Record<string, string> = {
  '/': 'Dashboard',
  '/appointments': 'Appointments',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
};

const AppLayout = () => {
  const location = useLocation();
  const pageTitle = pageTitleMap[location.pathname] ?? 'Dashboard';
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const currentDrawerWidth = isCollapsed ? collapsedWidth : drawerWidth;
  const topbarMinHeight = { xs: 96, sm: 72 };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: '#f3f6fb',
        color: '#1f2937',
      }}
    >
      <Topbar
        pageTitle={pageTitle}
        isCollapsed={isCollapsed}
        isMobile={isMobile}
        isXs={isXs}
        currentDrawerWidth={currentDrawerWidth}
        onOpenMobile={() => setIsMobileOpen(true)}
        minHeight={topbarMinHeight}
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
          flexGrow: 1,
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 4 },
        }}
      >
        <Box sx={{ height: topbarMinHeight }} />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
