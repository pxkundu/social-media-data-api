import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Skeleton,
  Alert,
  Button,
} from '@mui/material';
import {
  Work as WorkIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Link as LinkIcon,
  Refresh as RefreshIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { linkedinApi } from '../services/api';

const dummyProfile = {
  firstName: 'John',
  lastName: 'Doe',
  headline: 'Senior Software Engineer',
  location: 'San Francisco, CA',
  email: 'john.doe@example.com',
  profilePicture: null,
  about: 'Experienced software engineer with a passion for building scalable applications and mentoring junior developers.',
  experience: [
    {
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      duration: '2020 - Present',
      description: 'Leading development of cloud-native applications.',
      startDate: '2020',
      endDate: null,
    },
    {
      title: 'Software Engineer',
      company: 'StartUp Inc',
      duration: '2018 - 2020',
      description: 'Developed and maintained web applications.',
      startDate: '2018',
      endDate: '2020',
    },
  ],
  education: [
    {
      school: 'University of Technology',
      degree: 'Master of Computer Science',
      duration: '2016 - 2018',
      startDate: '2016',
      endDate: '2018',
    },
    {
      school: 'State University',
      degree: 'Bachelor of Science in Computer Science',
      duration: '2012 - 2016',
      startDate: '2012',
      endDate: '2016',
    },
  ],
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
  websites: [
    { name: 'Personal Website', url: 'https://johndoe.com' },
    { name: 'GitHub', url: 'https://github.com/johndoe' },
  ],
};

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConfigured, setIsConfigured] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const status = await linkedinApi.getConfigStatus();
      setIsConfigured(status.isConfigured);

      if (status.isConfigured) {
        const data = await linkedinApi.getProfile();
        setProfile(data);
      } else {
        setProfile(dummyProfile);
        setError('LinkedIn credentials not configured. Showing sample data.');
      }
    } catch (err) {
      console.error('Error fetching profile or config status:', err);
      setProfile(dummyProfile);
      setIsConfigured(false);
      setError('Failed to fetch real profile data. Showing sample data. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const renderSkeleton = () => (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Box display="flex" alignItems="center" gap={3} mb={4}>
          <Skeleton variant="circular" width={120} height={120} />
          <Box flex={1}>
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="40%" height={30} />
            <Box display="flex" gap={2} mt={1}>
              <Skeleton variant="rounded" width={120} height={32} />
              <Skeleton variant="rounded" width={120} height={32} />
            </Box>
          </Box>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Skeleton variant="text" width="30%" height={30} />
        <Skeleton variant="text" width="100%" height={100} />
        <Skeleton variant="text" width="30%" height={30} sx={{ mt: 4 }} />
        <Skeleton variant="text" width="100%" height={60} />
        <Skeleton variant="text" width="100%" height={60} />
      </Paper>
    </Container>
  );

  if (loading) {
    return renderSkeleton();
  }

  if (!profile && !loading) {
    return (
      <Container maxWidth="md">
        <Paper sx={{ p: 4, mt: 4 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            No profile data available.
          </Alert>
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Welcome to LinkedIn Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Get started by configuring your LinkedIn credentials to view your profile data.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<LinkIcon />}
              href="/config"
              sx={{ mt: 2 }}
            >
              Configure LinkedIn
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      {!isConfigured && profile && (
        <Alert
          severity="warning"
          icon={<WarningIcon />}
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" href="/config">
              Configure Now
            </Button>
          }
        >
          LinkedIn credentials not configured. Showing sample profile data.
        </Alert>
      )}

      {error && !isConfigured && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {profile && (
        <Paper sx={{ p: 4, mt: 4 }}>
          <Grid container spacing={4}>
            {/* Profile Header */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={3}>
                <Avatar
                  src={profile.profilePicture}
                  alt={profile.firstName}
                  sx={{ width: 120, height: 120, border: '4px solid #0077B5' }}
                />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {profile.firstName} {profile.lastName}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                    {profile.headline}
                  </Typography>
                  <Box display="flex" gap={2} mt={2}>
                    <Chip
                      icon={<LocationIcon />}
                      label={profile.location}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                    <Chip
                      icon={<EmailIcon />}
                      label={profile.email}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* About Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                About
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                {profile.about}
              </Typography>
            </Grid>

            {/* Experience Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                Experience
              </Typography>
              <List>
                {profile.experience?.map((exp, index) => (
                  <ListItem key={index} alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <WorkIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {exp.title}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="subtitle2" color="text.secondary">
                            {exp.company}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2" color="text.secondary">
                            {exp.startDate} - {exp.endDate || 'Present'}
                          </Typography>
                          <Typography variant="body2" paragraph sx={{ mt: 1 }}>
                            {exp.description}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>

            {/* Education Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                Education
              </Typography>
              <List>
                {profile.education?.map((edu, index) => (
                  <ListItem key={index} alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <SchoolIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {edu.school}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="subtitle2" color="text.secondary">
                            {edu.degree}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2" color="text.secondary">
                            {edu.startDate} - {edu.endDate || 'Present'}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>

            {/* Skills Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                Skills
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {profile.skills?.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: 'primary.light',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                      },
                    }}
                  />
                ))}
              </Box>
            </Grid>

            {/* Contact Info */}
            {profile.websites?.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Contact Information
                </Typography>
                <List>
                  {profile.websites?.map((website, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <LinkIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={website.name}
                        secondary={
                          <a
                            href={website.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#0077B5', textDecoration: 'none' }}
                          >
                            {website.url}
                          </a>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}
    </Container>
  );
}

export default Profile; 