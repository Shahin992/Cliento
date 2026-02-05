import type React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Drawer, InputAdornment, List, ListItemButton, Typography } from '@mui/material';
import { CustomIconButton as IconButton } from '../common/CustomIconButton';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Search } from '@mui/icons-material';

import BasicInput from '../common/BasicInput';

export interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  navItems: NavItem[];
  isCollapsed: boolean;
  isMobile: boolean;
  isMobileOpen: boolean;
  currentDrawerWidth: number;
  drawerWidth: number;
  topbarMinHeight: number | { xs: number; sm: number };
  onCloseMobile: () => void;
  onToggleCollapse: () => void;
}

const Sidebar = ({
  navItems,
  isCollapsed,
  isMobile,
  isMobileOpen,
  currentDrawerWidth,
  drawerWidth,
  topbarMinHeight,
  onCloseMobile,
  onToggleCollapse,
}: SidebarProps) => (
  <Drawer
    variant={isMobile ? 'temporary' : 'permanent'}
    open={isMobile ? isMobileOpen : true}
    onClose={isMobile ? onCloseMobile : undefined}
    ModalProps={isMobile ? { keepMounted: true } : undefined}
    sx={{
      width: isMobile ? drawerWidth : currentDrawerWidth,
      flexShrink: 0,
      [`& .MuiDrawer-paper`]: {
        width: isMobile ? drawerWidth : currentDrawerWidth,
        boxSizing: 'border-box',
        borderRight: '1px solid #e6ecf5',
        bgcolor: '#eef3fb',
        transition: 'width 220ms ease',
        overflowX: 'hidden',
        top: isMobile ? 0 : topbarMinHeight,
        height: isMobile
          ? '100%'
          : {
              xs: 'calc(100% - 96px)',
              sm: 'calc(100% - 72px)',
            },
      },
    }}
  >
    <Box
      sx={{
        px: isCollapsed && !isMobile ? 1.5 : 2.5,
        py: 2,
        height: '100%',
        position: 'relative',
      }}
    >
      {isMobile ? (
        <Box sx={{ mb: 2 }}>
          <BasicInput
            fullWidth
            placeholder="Search..."
            endAdornment={
              <InputAdornment position="end">
                <Search sx={{ color: '#ced4da' }} />
              </InputAdornment>
            }
          />
        </Box>
      ) : null}
      <List
        sx={{
          mt: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            onClick={isMobile ? onCloseMobile : undefined}
            sx={{
              borderRadius: 2,
              gap: 1.5,
              color: '#6b7280',
              px: isCollapsed && !isMobile ? 1.5 : 2,
              py: 1,
              justifyContent: isCollapsed && !isMobile ? 'center' : 'flex-start',
              '&.active': {
                bgcolor: '#5b4dff',
                color: 'white',
              },
            }}
          >
            <Box sx={{ color: 'inherit' }}>{item.icon}</Box>
            {!isCollapsed || isMobile ? (
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {item.label}
              </Typography>
            ) : null}
          </ListItemButton>
        ))}
      </List>
      {!isMobile ? (
        <IconButton
          size="small"
          onClick={onToggleCollapse}
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 12,
            width: 32,
            height: 32,
            bgcolor: 'white',
            border: '1px solid #e6ecf5',
            boxShadow: '0px 8px 16px rgba(15, 23, 42, 0.08)',
          }}
        >
          {isCollapsed ? (
            <ChevronRight fontSize="small" />
          ) : (
            <ChevronLeft fontSize="small" />
          )}
        </IconButton>
      ) : null}
    </Box>
  </Drawer>
);

export default Sidebar;
