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
  CardMedia,
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
  Article as ArticleIcon,
  Refresh as RefreshIcon,
  Error as ErrorIcon,
  Description as DescriptionIcon,
  OpenInNew as OpenInNewIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { linkedinApi } from '../services/api';

const dummyArticles = [
  {
    id: 1,
    title: "The Future of Cloud Computing: Trends to Watch in 2024",
    text: "Cloud computing continues to evolve at a rapid pace. In this article, we explore the emerging trends that will shape the industry in 2024 and beyond...",
    created: "2024-03-15T10:30:00Z",
    likes: 456,
    comments: 89,
    shares: 67,
    url: "https://linkedin.com/article/1"
  },
  {
    id: 2,
    title: "Building Scalable Applications with Microservices",
    text: "Microservices architecture has become the go-to solution for building scalable applications. Learn about the best practices and common pitfalls...",
    created: "2024-03-14T15:45:00Z",
    likes: 378,
    comments: 45,
    shares: 34,
    url: "https://linkedin.com/article/2"
  },
  {
    id: 3,
    title: "The Impact of AI on Software Development",
    text: "Artificial Intelligence is transforming how we write and maintain code. Discover how AI tools are changing the landscape of software development...",
    created: "2024-03-13T09:15:00Z",
    likes: 523,
    comments: 112,
    shares: 78,
    url: "https://linkedin.com/article/3"
  }
];

function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConfigured, setIsConfigured] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      const status = await linkedinApi.getConfigStatus();
      setIsConfigured(status.isConfigured);

      if (status.isConfigured) {
        const data = await linkedinApi.getArticles();
        setArticles(data);
      } else {
        setArticles(dummyArticles);
        setError('LinkedIn credentials not configured. Showing sample data.');
      }
    } catch (err) {
      console.error('Error fetching articles or config status:', err);
      setArticles(dummyArticles);
      setIsConfigured(false);
      setError('Failed to fetch real articles data. Showing sample data. Check console for details.');
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
        {[1, 2].map((index) => (
          <Box key={index} mb={3}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton variant="text" width="60%" height={32} />
                </Box>
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

  if (articles.length === 0 && isConfigured && !loading) {
    return (
      <Container maxWidth="md">
        <Paper sx={{ p: 4, mt: 4 }}>
          <Box textAlign="center" py={6}>
            <DescriptionIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Articles Available
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Start writing articles on LinkedIn to see them here
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<LinkIcon />}
              href="https://www.linkedin.com/pulse/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ mt: 2 }}
            >
              Write an Article on LinkedIn
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      {!isConfigured && articles.length > 0 && (
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
          LinkedIn credentials not configured. Showing sample articles.
        </Alert>
      )}

      {error && articles.length === 0 && !loading && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {articles.length > 0 && (
        <Paper sx={{ p: 4, mt: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                LinkedIn Articles
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View and analyze your LinkedIn articles and their engagement metrics
              </Typography>
            </Box>
            {isConfigured && (
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchArticles}
                sx={{ borderRadius: 2 }}
              >
                Refresh
              </Button>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            {articles.map((article, index) => (
              <Grid item xs={12} key={index}>
                <Card 
                  elevation={2}
                  sx={{
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <ArticleIcon color="primary" />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {article.title || 'Untitled Article'}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body1" 
                      paragraph
                      sx={{ 
                        lineHeight: 1.7,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {article.text}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <CalendarIcon fontSize="small" color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        Published on {new Date(article.created).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      <Chip
                        icon={<ThumbUpIcon />}
                        label={`${article.likes} Likes`}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                      />
                      <Chip
                        icon={<CommentIcon />}
                        label={`${article.comments} Comments`}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                      />
                      <Chip
                        icon={<ShareIcon />}
                        label={`${article.shares} Shares`}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                      />
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<LinkIcon />}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                    >
                      Read on LinkedIn
                    </Button>
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

export default Articles; 