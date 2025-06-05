import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Link as LinkIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
  Error as ErrorIcon,
  TrendingUp as TrendingUpIcon,
  OpenInNew as OpenInNewIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { linkedinApi } from '../services/api';

const dummyPosts = [
  {
    id: 1,
    text: "Excited to share that our team has successfully launched a new feature that will revolutionize how users interact with our platform! 🚀 #Innovation #Tech",
    created: "2024-03-15T10:30:00Z",
    likes: 245,
    comments: 56,
    shares: 23,
    url: "https://linkedin.com/post/1",
  },
  {
    id: 2,
    text: "Just finished an amazing workshop on cloud architecture. The future of scalable applications is here! 💡 #CloudComputing #Architecture",
    created: "2024-03-14T15:45:00Z",
    likes: 189,
    comments: 34,
    shares: 12,
    url: "https://linkedin.com/post/2",
  },
  {
    id: 3,
    text: "Looking for talented developers to join our growing team! We're building something special. Check out our open positions. #Hiring #TechJobs",
    created: "2024-03-13T09:15:00Z",
    likes: 312,
    comments: 78,
    shares: 45,
    url: "https://linkedin.com/post/3",
  },
];

function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConfigured, setIsConfigured] = useState(true); // Assume configured initially

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check config status first
      const status = await linkedinApi.getConfigStatus();
      setIsConfigured(status.isConfigured);

      if (status.isConfigured) {
        const data = await linkedinApi.getPosts();
        setPosts(data);
      } else {
        // If not configured, show dummy data and warning
        setPosts(dummyPosts);
        // isConfigured is already set to false
        setError('LinkedIn credentials not configured. Showing sample data.');
      }
    } catch (err) {
      console.error('Error fetching posts or config status:', err);
      // On any API error, fall back to dummy data and indicate not configured
      setPosts(dummyPosts);
      setIsConfigured(false);
      setError('Failed to fetch real posts data. Showing sample data. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const renderSkeleton = () => (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Skeleton variant="text" width="40%" height={40} />
        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 3 }} />
        <Divider sx={{ my: 3 }} />
        {[1, 2, 3].map((index) => (
          <Box key={index} mb={3}>
            <Card elevation={2}>
              <CardContent>
                <Skeleton variant="text" width="100%" height={100} />
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Skeleton variant="circular" width={20} height={20} />
                  <Skeleton variant="text" width="30%" height={24} />
                </Box>
                <Box display="flex" gap={1}>
                  <Skeleton variant="rounded" width={100} height={32} />
                  <Skeleton variant="rounded" width={100} height={32} />
                  <Skeleton variant="rounded" width={100} height={32} />
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Paper>
    </Container>
  );

  if (loading) {
    return renderSkeleton();
  }

  // If posts is empty and not loading, show initial empty state (only if configured and no dummy data is shown)
  if (posts.length === 0 && isConfigured && !loading) {
    return (
      <Container maxWidth="md">
        <Paper sx={{ p: 4, mt: 4 }}>
          <Box textAlign="center" py={6}>
            <TrendingUpIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Posts Available
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Start sharing your thoughts on LinkedIn to see your posts here
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<LinkIcon />}
              href="https://www.linkedin.com/feed/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ mt: 2 }}
            >
              Create a Post on LinkedIn
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Render posts data (either real or dummy) with a warning if not configured
  return (
    <Container maxWidth="md">
      {!isConfigured && posts.length > 0 && (
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
          LinkedIn credentials not configured. Showing sample posts.
        </Alert>
      )}

       {/* Optionally display a more detailed error if dummy data couldn't even load, though less likely */}
       {error && posts.length === 0 && !loading && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
         )}

      {posts.length > 0 && (
        <Paper sx={{ p: 4, mt: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                LinkedIn Posts
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View and analyze your LinkedIn posts and their engagement metrics
              </Typography>
            </Box>
            {/* Only show refresh button if configured */}
            {isConfigured && (
               <Button
                 variant="outlined"
                 startIcon={<RefreshIcon />}
                 onClick={fetchPosts}
                 sx={{ borderRadius: 2 }}
               >
                 Refresh
               </Button>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            {posts.map((post) => (
              <Grid item xs={12} key={post.id}>
                <Card elevation={2} sx={{ '&:hover': { boxShadow: 4 } }}>
                  <CardContent>
                    <Typography variant="body1" paragraph>
                      {post.text}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                      Posted on {new Date(post.created).toLocaleDateString()}
                    </Typography>
                    <Box display="flex" gap={1} mt={2}>
                      <Chip
                        icon={<ThumbUpIcon />}
                        label={`${post.likes} Likes`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        icon={<CommentIcon />}
                        label={`${post.comments} Comments`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        icon={<ShareIcon />}
                        label={`${post.shares} Shares`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <Tooltip title="View on LinkedIn">
                      <IconButton
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                      >
                        <OpenInNewIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Container>
  );
}

export default Posts; 