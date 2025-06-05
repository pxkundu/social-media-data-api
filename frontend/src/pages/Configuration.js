import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { Save as SaveIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { configApi } from '../services/api';

function Configuration() {
  const [credentials, setCredentials] = useState({
    clientId: '',
    clientSecret: '',
    accessToken: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [configStatus, setConfigStatus] = useState(null);

  useEffect(() => {
    fetchConfigStatus();
    fetchCredentials();
  }, []);

  const fetchConfigStatus = async () => {
    try {
      const status = await configApi.getConfigStatus();
      setConfigStatus(status);
    } catch (err) {
      console.error('Error fetching config status:', err);
    }
  };

  const fetchCredentials = async () => {
    try {
      const data = await configApi.getCredentials();
      if (data) {
        setCredentials(data);
      }
    } catch (err) {
      console.error('Error fetching credentials:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await configApi.saveCredentials(credentials);
      setSuccess(true);
      fetchConfigStatus();
    } catch (err) {
      setError('Failed to save credentials. Please try again.');
      console.error('Error saving credentials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await configApi.clearCredentials();
      setCredentials({
        clientId: '',
        clientSecret: '',
        accessToken: '',
      });
      setSuccess(true);
      fetchConfigStatus();
    } catch (err) {
      setError('Failed to clear credentials. Please try again.');
      console.error('Error clearing credentials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
          LinkedIn Configuration
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Configure your LinkedIn API credentials to access your profile data, posts, and articles.
        </Typography>

        {configStatus && (
          <Alert
            severity={configStatus.isConfigured ? 'success' : 'info'}
            sx={{ mb: 3 }}
          >
            {configStatus.isConfigured
              ? 'LinkedIn API is configured and ready to use.'
              : 'Please configure your LinkedIn API credentials to get started.'}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Configuration updated successfully!
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Client ID"
            name="clientId"
            value={credentials.clientId}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Client Secret"
            name="clientSecret"
            value={credentials.clientSecret}
            onChange={handleChange}
            margin="normal"
            required
            type="password"
          />
          <TextField
            fullWidth
            label="Access Token"
            name="accessToken"
            value={credentials.accessToken}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={3}
          />

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={loading}
              sx={{ borderRadius: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Save Configuration'}
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleClear}
              disabled={loading}
              sx={{ borderRadius: 2 }}
            >
              Clear Configuration
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            How to Get LinkedIn API Credentials
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            1. Go to LinkedIn Developer Portal and create a new application
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            2. Configure your application with the required permissions
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            3. Generate your Client ID and Client Secret
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            4. Use the OAuth 2.0 flow to obtain an Access Token
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Configuration; 