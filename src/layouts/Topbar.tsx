import React from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { AppBar, Avatar, Box, Button, Divider, IconButton, InputAdornment, Menu, MenuItem, Stack, Toolbar, Typography } from '@mui/material';
import { Add, Logout, Menu as MenuIcon, Person, Search, VpnKey } from '@mui/icons-material';

import BasicInput from '../common/BasicInput';
import { CustomButton } from '../common/CustomButton';

interface TopbarProps {
  pageTitle: string;
  isCollapsed: boolean;
  isMobile: boolean;
  isXs: boolean;
  currentDrawerWidth: number;
  onOpenMobile: () => void;
  minHeight: SxProps<Theme>['minHeight'];
}

const Topbar = ({
  pageTitle,
  isCollapsed,
  isMobile,
  isXs,
  currentDrawerWidth,
  onOpenMobile,
  minHeight,
}: TopbarProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="transparent"
      sx={{
        backgroundColor: '#eef3fb',
        borderBottom: '1px solid #e6ecf5',
        backdropFilter: 'none',
        zIndex: (theme) =>
          isMobile ? theme.zIndex.drawer - 1 : theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          px: 0,
          minHeight,
          display: 'flex',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          justifyContent: 'space-between',
          rowGap: { xs: 1, md: 0 },
        }}
      >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          gap: 2,
          flexWrap: { xs: 'wrap', md: 'nowrap' },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            width: isMobile ? 'auto' : currentDrawerWidth < 200 ? 240 : currentDrawerWidth,
            transition: 'width 220ms ease',
            order: { xs: 1, md: 0 },
          }}
        >
            {isMobile ? (
              <IconButton
                size="small"
                onClick={onOpenMobile}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'white',
                  border: '1px solid #e6ecf5',
                  boxShadow: 'none',
                }}
              >
                <MenuIcon fontSize="small" />
              </IconButton>
            ) : null}
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: '#1e2a78',
                display: 'grid',
                placeItems: 'center',
                color: 'white',
                fontWeight: 700,
                boxShadow: 'none',
              }}
            >
              C
            </Box>
            {!isMobile ? (
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Cliento CRM
              </Typography>
            ) : null}
          </Box>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: { xs: 'wrap', md: 'nowrap' },
            order: { xs: 2, md: 0 },
          }}
        >
            <BasicInput
              placeholder="Search..."
              fullWidth
              sx={{
                maxWidth: { xs: '100%', md: 360 },
                minWidth: { xs: '100%', md: 220 },
                display: { xs: 'none', md: 'flex' },
              }}
              endAdornment={
                <InputAdornment position="end">
                  <Search sx={{ color: '#ced4da' }} />
                </InputAdornment>
              }
            />
          <Stack
            direction="row"
            spacing={{ xs: 1.5, md: 2 }}
            alignItems="center"
            sx={{
              width: { xs: '100%', md: 'auto' },
              justifyContent: { xs: 'flex-end', md: 'flex-start' },
              order: { xs: 3, md: 0 },
            }}
          >
              <CustomButton
                variant="contained"
                startIcon={<Add fontSize="small" />}
                sx={{
                  minWidth:'130px',
                  textTransform: 'none',
                  borderRadius: 99,
                  px: 2.5,
                  bgcolor: '#6d28ff',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#5b21d6' },
                  display: { xs: 'none', sm: 'inline-flex' },
                }}
              >
                Add New
              </CustomButton>
              <CustomButton
                variant="contained"
                sx={{
                  textTransform: 'none',
                  borderRadius: 99,
                  px: 2,
                  minWidth: 0,
                  bgcolor: '#6d28ff',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#5b21d6' },
                  display: { xs: 'inline-flex', sm: 'none' },
                }}
              >
                +
              </CustomButton>
              {!isMobile ? (
                <>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={2}
                    sx={{
                      height: '48px',
                      px: 2,
                      cursor: 'pointer',
                      borderRadius: '12px',
                      backgroundColor: 'white',
                      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #f0f0f0',
                      '&:hover': {
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                    onClick={handleClick}
                  >
                    <Avatar sx={{ bgcolor: '#6f42c1', width: 36, height: 36 }}>CA</Avatar>
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, lineHeight: 1.2, color: '#333' }}
                      >
                        Cliento Admin
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>
                        cliento@gmail.com
                      </Typography>
                    </Box>
                  </Box>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                      sx: {
                        width: 300,
                        mt: 2.5,
                        overflow: 'visible',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                        borderRadius: '12px',
                        bgcolor: 'white',
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 26,
                          width: 40,
                          height: 40,
                          bgcolor: 'white',
                          borderLeft: '1px solid #f0f0f0',
                          borderTop: '1px solid #f0f0f0',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                        '& .MuiMenuItem-root': {
                          '&:focus, &.Mui-focusVisible': {
                            backgroundColor: 'transparent',
                          },
                          '&:hover': {
                            backgroundColor: '#f6f6f6',
                          },
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={handleMenuItemClick} sx={{ px: 3, py: 2 }}>
                      <Person sx={{ mr: 2, color: '#666' }} />
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        My Profile
                      </Typography>
                    </MenuItem>

                    <MenuItem onClick={handleMenuItemClick} sx={{ px: 3, py: 2 }}>
                      <VpnKey sx={{ mr: 2, color: '#666' }} />
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Change Password
                      </Typography>
                    </MenuItem>

                    <Divider sx={{ my: 1 }} />

                    <MenuItem onClick={handleMenuItemClick} sx={{ px: 3, py: 2, color: '#d32f2f' }}>
                      <Logout sx={{ mr: 2 }} />
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Logout
                      </Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Avatar sx={{ width: 34, height: 34 }} />
              )}
            </Stack>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
