import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Skeleton,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Refresh as RefreshIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { linkedinApi } from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const dummyAnalytics = {
  totalPosts: 15,
  totalLikes: 2345,
  totalComments: 456,
  totalShares: 234,
  engagementOverTime: [
    { date: '2024-03-01', likes: 120, comments: 25, shares: 10 },
    { date: '2024-03-02', likes: 145, comments: 30, shares: 15 },
    { date: '2024-03-03', likes: 180, comments: 35, shares: 20 },
    { date: '2024-03-04', likes: 160, comments: 28, shares: 18 },
    { date: '2024-03-05', likes: 200, comments: 40, shares: 25 },
  ],
  postPerformance: [
    { post: 'Post 1', likes: 245, comments: 56, shares: 23 },
    { post: 'Post 2', likes: 189, comments: 34, shares: 12 },
    { post: 'Post 3', likes: 312, comments: 78, shares: 45 },
    { post: 'Post 4', likes: 278, comments: 45, shares: 30 },
    { post: 'Post 5', likes: 345, comments: 67, shares: 38 },
  ],
  engagementDistribution: [
    { name: 'Likes', value: 2345 },
    { name: 'Comments', value: 456 },
    { name: 'Shares', value: 234 },
  ],
};

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConfigured, setIsConfigured] = useState(true); // Assume configured initially

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check config status first
      const status = await linkedinApi.getConfigStatus();
      setIsConfigured(status.isConfigured);

      if (status.isConfigured) {
        const data = await linkedinApi.getAnalytics();
        setAnalytics(data);
      } else {
        // If not configured, show dummy data and warning
        setAnalytics(dummyAnalytics);
        // isConfigured is already set to false
        setError('LinkedIn credentials not configured. Showing sample data.');
      }

    } catch (err) {
      console.error('Error fetching analytics or config status:', err);
      // On any API error, fall back to dummy data and indicate not configured
      setAnalytics(dummyAnalytics);
      setIsConfigured(false);
      setError('Failed to fetch real analytics data. Showing sample data. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

   // If analytics is null/empty and not loading, show initial empty state (only if configured and no dummy data is shown)
  if (!analytics && isConfigured && !loading) {
    return (
      <Container maxWidth="lg">
        <Paper sx={{ p: 4, mt: 4 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            No analytics data available.
          </Alert>
           <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Generate Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Start posting and engaging on LinkedIn to generate analytics data.
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

   // Render analytics data (either real or dummy) with a warning if not configured
  return (
    <Container maxWidth="lg">
      {!isConfigured && analytics && (
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
          LinkedIn credentials not configured. Showing sample analytics data.
        </Alert>
      )}

       {/* Optionally display a more detailed error if dummy data couldn't even load, though less likely */}
       {error && !isConfigured && !loading && (!analytics || analytics.totalPosts === undefined) && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
         )}

       {/* Render the analytics dashboard if analytics data is available (real or dummy) */}
       {analytics && (analytics.totalPosts !== undefined) && (
          <Paper sx={{ p: 4, mt: 4 }}>
             <Box sx={{ mb: 4 }}>
               <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                 <Box>
                   <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                     Analytics Dashboard
                   </Typography>
                   <Typography variant="body1" color="text.secondary">
                     Insights and metrics from your LinkedIn activity
                   </Typography>
                 </Box>
                 {/* Only show refresh button if configured */}
                 {isConfigured && (
                    <Button
                       variant="outlined"
                       startIcon={<RefreshIcon />}
                       onClick={fetchAnalytics}
                       sx={{ borderRadius: 2 }}
                     >
                       Refresh Data
                     </Button>
                 )}
               </Box>
             </Box>

             {/* Summary Cards */}
             <Grid container spacing={3} sx={{ mb: 4 }}>
               <Grid item xs={12} sm={6} md={3}>
                 <Card elevation={2} sx={{ height: '100%' }}>
                   <CardContent>
                     <Box display="flex" alignItems="center" gap={1} mb={2}>
                       <TrendingUpIcon color="primary" />
                       <Typography variant="h6" color="text.secondary">
                         Total Posts
                       </Typography>
                     </Box>
                     <Typography variant="h4" sx={{ fontWeight: 600 }}>
                       {analytics.totalPosts}
                     </Typography>
                   </CardContent>
                 </Card>
               </Grid>
               <Grid item xs={12} sm={6} md={3}>
                 <Card elevation={2} sx={{ height: '100%' }}>
                   <CardContent>
                     <Box display="flex" alignItems="center" gap={1} mb={2}>
                       <ThumbUpIcon color="primary" />
                       <Typography variant="h6" color="text.secondary">
                         Total Likes
                       </Typography>
                     </Box>
                     <Typography variant="h4" sx={{ fontWeight: 600 }}>
                       {analytics.totalLikes}
                     </Typography>
                   </CardContent>
                 </Card>
               </Grid>
               <Grid item xs={12} sm={6} md={3}>
                 <Card elevation={2} sx={{ height: '100%' }}>
                   <CardContent>
                     <Box display="flex" alignItems="center" gap={1} mb={2}>
                       <CommentIcon color="primary" />
                       <Typography variant="h6" color="text.secondary">
                         Total Comments
                       </Typography>
                     </Box>
                     <Typography variant="h4" sx={{ fontWeight: 600 }}>
                       {analytics.totalComments}
                     </Typography>
                   </CardContent>
                 </Card>
               </Grid>
               <Grid item xs={12} sm={6} md={3}>
                 <Card elevation={2} sx={{ height: '100%' }}>
                   <CardContent>
                     <Box display="flex" alignItems="center" gap={1} mb={2}>
                       <ShareIcon color="primary" />
                       <Typography variant="h6" color="text.secondary">
                         Total Shares
                       </Typography>
                     </Box>
                     <Typography variant="h4" sx={{ fontWeight: 600 }}>
                       {analytics.totalShares}
                     </Typography>
                   </CardContent>
                 </Card>
               </Grid>
             </Grid>

             {/* Engagement Over Time Chart */}
             <Paper sx={{ p: 3, mb: 4 }}>
               <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                 Engagement Over Time
               </Typography>
               <Box sx={{ height: 400 }}>
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart
                     data={analytics.engagementOverTime}
                     margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                   >
                     <CartesianGrid strokeDasharray="3 3" />
                     <XAxis dataKey="date" />
                     <YAxis />
                     <Tooltip />
                     <Legend />
                     <Line
                       type="monotone"
                       dataKey="likes"
                       stroke="#0088FE"
                       activeDot={{ r: 8 }}
                     />
                     <Line type="monotone" dataKey="comments" stroke="#00C49F" />
                     <Line type="monotone" dataKey="shares" stroke="#FFBB28" />
                   </LineChart>
                 </ResponsiveContainer>
               </Box>
             </Paper>

             <Grid container spacing={4}>
               {/* Post Performance Chart */}
               <Grid item xs={12} md={8}>
                 <Paper sx={{ p: 3 }}>
                   <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                     Post Performance
                   </Typography>
                   <Box sx={{ height: 400 }}>
                     <ResponsiveContainer width="100%" height="100%">
                       <BarChart
                         data={analytics.postPerformance}
                         margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                       >
                         <CartesianGrid strokeDasharray="3 3" />
                         <XAxis dataKey="post" />
                         <YAxis />
                         <Tooltip />
                         <Legend />
                         <Bar dataKey="likes" fill="#0088FE" />
                         <Bar dataKey="comments" fill="#00C49F" />
                         <Bar dataKey="shares" fill="#FFBB28" />
                       </BarChart>
                     </ResponsiveContainer>
                   </Box>
                 </Paper>
               </Grid>

               {/* Engagement Distribution */}
               <Grid item xs={12} md={4}>
                 <Paper sx={{ p: 3 }}>
                   <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                     Engagement Distribution
                   </Typography>
                   <Box sx={{ height: 400 }}>
                     <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                         <Pie
                           data={analytics.engagementDistribution}
                           cx="50%"
                           cy="50%"
                           labelLine={false}
                           outerRadius={120}
                           fill="#8884d8"
                           dataKey="value"
                           label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                         >
                           {analytics.engagementDistribution.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))}
                         </Pie>
                         <Tooltip />
                       </PieChart>
                     </ResponsiveContainer>
                   </Box>
                 </Paper>
               </Grid>
             </Grid>
          </Paper>
       )}
    </Container>
  );
}

export default Analytics; 