import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, useMediaQuery, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AssessmentIcon from '@mui/icons-material/Assessment';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Assessment', icon: <AssessmentIcon />, path: '/assessment' },
    { text: 'Career Paths', icon: <WorkIcon />, path: '/careers' },
    { text: 'Learning Plans', icon: <SchoolIcon />, path: '/learning' },
    { text: 'Community', icon: <PeopleIcon />, path: '/community' },
  ];

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: 'background.paper' }}>
      <Toolbar>
        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              {drawer}
            </Drawer>
          </>
        ) : null}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Tech Career Guidance
        </Typography>
        {!isMobile && (
          <Box sx={{ display: 'flex' }}>
            {menuItems.map((item) => (
              <Button color="inherit" key={item.text} startIcon={item.icon}>
                {item.text}
              </Button>
            ))}
          </Box>
        )}
        <Button color="inherit" startIcon={<AccountCircleIcon />}>
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
