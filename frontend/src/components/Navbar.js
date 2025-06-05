import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function Navbar() {
  return (
    <AppBar position="static">
          LinkedIn Data Analytics
        <Box>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/profile"
          >
            Profile
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/posts"
          >
            Posts
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/articles"
          >
            Articles
          </Button>
        </Box>
    </AppBar>
  );
}

export default Navbar; 