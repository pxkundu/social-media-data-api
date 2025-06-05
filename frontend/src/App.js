import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Tooltip,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Article as ArticleIcon,
  PostAdd as PostIcon,
  Settings as SettingsIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Analytics as AnalyticsIcon,
  NotificationsNone as NotificationsNoneIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import Profile from './pages/Profile';
import Posts from './pages/Posts';
import Articles from './pages/Articles';
import Configuration from './pages/Configuration';
import Analytics from './pages/Analytics';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0077B5', // LinkedIn blue
      light: '#00A0DC',
      dark: '#0e76a8', // Adjusted dark blue based on screenshot observation
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00A0DC', // LinkedIn light blue
      light: '#33B4E3',
      dark: '#0070A3',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f3f2ef', // LinkedIn background color
      paper: '#ffffff', // White for cards/panels
    },
    text: {
      primary: '#1a1a1a', // Dark grey for main text
      secondary: '#666666', // Medium grey for secondary text
      // White text for dark header
      headerPrimary: '#ffffff',
      headerSecondary: 'rgba(255, 255, 255, 0.9)', // Increased opacity for better contrast
    },
    divider: '#e0e0e0', // Light grey for dividers
  },
  typography: {
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h4: {
      fontWeight: 400,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.9rem', // Slightly larger body text
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.8rem',
    },
    button: { // Add button styles for top bar links
      fontWeight: 400,
      fontSize: '0.875rem', // Corresponds to 14px
      textTransform: 'none',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4,
          fontWeight: 600,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderRadius: 4,
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1a1a1a',
          boxShadow: 'none',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        dense: {
          minHeight: 40,
        },
        regular: {
          minHeight: 56,
          paddingLeft: '24px', // Adjust padding as needed
          paddingRight: '24px',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: '#004471'
            }
          },
          '&:hover': {
            backgroundColor: 'action.hover'
          }
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
  },
});

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: '#f3f2ef', // LinkedIn background color
        borderTop: '1px solid #e0e0e0',
        textAlign: 'center',
        color: 'text.secondary',
        fontSize: '0.8rem',
      }}
    >
      <Container maxWidth="lg">
        {/* Top row of links */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          mb={1}
        >
          <Button
            color="inherit"
            component="a"
            href="https://about.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textTransform: 'none',
              fontSize: '0.8rem',
              color: 'text.secondary',
              padding: 0,
              minWidth: 0,
              '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
            }}
          >
            About
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mx: 0.5 }}>|</Typography>
          <Button
            color="inherit"
            component="a"
            href="https://linkedin.com/help/linkedin" // Assuming this is the help center link
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textTransform: 'none',
              fontSize: '0.8rem',
              color: 'text.secondary',
              padding: 0,
              minWidth: 0,
              '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
            }}
          >
            Help Center
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mx: 0.5 }}>|</Typography>
          <Button
            color="inherit"
            // This button likely needs a dropdown, but for now, just display text
            sx={{
              textTransform: 'none',
              fontSize: '0.8rem',
              color: 'text.secondary',
              padding: 0,
              minWidth: 0,
              '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
            }}
          >
            Privacy And Terms
          </Button>
        </Box>
        {/* Bottom row with LinkedIn logo/text */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={0.5}
        >
          <LinkedInIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" sx={{fontWeight: 600}}>
            LinkedIn
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Corporation © {new Date().getFullYear()}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Menu items for the mobile drawer and desktop header navigation
  const menuItems = [
    { text: 'Profile', path: '/' },
    { text: 'Posts', path: '/posts' },
    { text: 'Articles', path: '/articles' },
    { text: 'Analytics', path: '/analytics' },
    { text: 'Configuration', path: '/config' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <LinkedInIcon sx={{ color: 'primary.main', fontSize: 32 }} />
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
          LinkedIn Analytics
        </Typography>
      </Box>
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            component={Link}
            to={item.path}
            key={item.text}
            selected={location.pathname === item.path}
            onClick={() => isMobile && handleDrawerToggle()}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#004471'
                }
              },
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: location.pathname === item.path ? 600 : 400,
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  // Function to get the current page title for the main content area
  const getPageTitle = (pathname) => {
    const item = menuItems.find(item => item.path === pathname);
    return item ? item.text : 'Dashboard'; // Default title if path doesn't match
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Header Bar */}
      <AppBar 
        position="static" 
        elevation={0} 
        sx={{ 
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e0e0e0',
          height: '52px'
        }}
      >
        <Toolbar 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '0 16px',
            minHeight: '52px !important',
            maxWidth: '1128px',
            margin: '0 auto',
            width: '100%'
          }}
        >
          {/* Left section: Logo and Search */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box 
              component={Link} 
              to="/" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none',
                color: '#0a66c2',
                '&:hover': { opacity: 0.8 }
              }}
            >
              <LinkedInIcon sx={{ fontSize: 34 }} />
            </Box>
            
            {/* Search Box */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                backgroundColor: '#eef3f8',
                borderRadius: '4px',
                padding: '0 8px',
                height: '34px',
                width: '280px',
                '&:hover': {
                  backgroundColor: '#e4e9ee'
                }
              }}
            >
              <SearchIcon sx={{ color: '#666666', fontSize: 20 }} />
              <input
                type="text"
                placeholder="Search"
                style={{
                  border: 'none',
                  background: 'transparent',
                  marginLeft: '8px',
                  width: '100%',
                  outline: 'none',
                  fontSize: '14px',
                  color: '#666666'
                }}
              />
            </Box>
          </Box>

          {/* Center section: Navigation Links */}
          <Box 
            sx={{ 
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 1
            }}
          >
            {menuItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  color: location.pathname === item.path ? '#0a66c2' : '#666666',
                  minWidth: '80px',
                  height: '52px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  padding: '0 12px',
                  '&:hover': {
                    color: '#0a66c2',
                    backgroundColor: 'transparent'
                  }
                }}
              >
                {item.text}
                {location.pathname === item.path && (
                  <Box sx={{ 
                    width: '100%', 
                    height: '2px', 
                    backgroundColor: '#0a66c2',
                    position: 'absolute',
                    bottom: 0
                  }} />
                )}
              </Button>
            ))}
            <Button
              component="a"
              href="https://www.linkedin.com/developers/apps"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#666666',
                minWidth: '80px',
                height: '52px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '0 12px',
                '&:hover': {
                  color: '#0a66c2',
                  backgroundColor: 'transparent'
                }
              }}
            >
              LinkedIn Config
            </Button>
          </Box>

          {/* Right section: Icons and Profile */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 1
            }}
          >
            <Tooltip title="Notifications">
              <IconButton 
                sx={{ 
                  color: '#666666',
                  padding: '8px',
                  '&:hover': { color: '#0a66c2' }
                }}
              >
                <NotificationsNoneIcon sx={{ fontSize: 24 }} />
              </IconButton>
            </Tooltip>

            <Box 
              sx={{ 
                width: '1px', 
                height: '24px', 
                backgroundColor: '#e0e0e0',
                margin: '0 8px'
              }} 
            />

            <Tooltip title="My Account">
              <IconButton 
                sx={{ 
                  padding: '4px',
                  '&:hover': { backgroundColor: 'transparent' }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    bgcolor: '#0a66c2',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  P
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer (App Navigation) */}
      {isMobile && (
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
              mt: '40px', // Adjust margin top based on top AppBar height
              borderRight: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.default', // Match body background
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          backgroundColor: 'background.default',
          pt: '64px', // Adjust padding top to be below the single 40px header + some spacing
        }}
      >
        {/* Page Title (moved from second header bar) */}
         <Container maxWidth="lg" sx={{ mb: 3, mt: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 400 }}>
              {getPageTitle(location.pathname)}
            </Typography>
         </Container>
         {/* Routes render the actual page content below the title */}
        <Container maxWidth="lg">
          <Routes>
            <Route path="/" element={<Profile />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/config" element={<Configuration />} />
          </Routes>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation />
      </Router>
    </ThemeProvider>
  );
}

export default App; 