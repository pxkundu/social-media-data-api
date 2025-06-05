import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { linkedinApi } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalArticles: 0,
    totalLikes: 0,
    totalComments: 0,
    engagementData: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [posts, articles] = await Promise.all([
          linkedinApi.getPosts(),
          linkedinApi.getArticles(),
        ]);

        const allContent = [...posts, ...articles];
        const totalLikes = allContent.reduce((sum, item) => sum + (item.likes_count || 0), 0);
        const totalComments = allContent.reduce((sum, item) => sum + (item.comments_count || 0), 0);

        // Prepare engagement data for the chart
        const engagementData = allContent
          .sort((a, b) => new Date(b.created_time) - new Date(a.created_time))
          .slice(0, 10)
          .map(item => ({
            title: item.text.substring(0, 20) + '...',
            likes: item.likes_count || 0,
            comments: item.comments_count || 0,
          }));

        setStats({
          totalPosts: posts.length,
          totalArticles: articles.length,
          totalLikes,
          totalComments,
          engagementData,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Posts</Typography>
            <Typography variant="h4">{stats.totalPosts}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Articles</Typography>
            <Typography variant="h4">{stats.totalArticles}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Likes</Typography>
            <Typography variant="h4">{stats.totalLikes}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Comments</Typography>
            <Typography variant="h4">{stats.totalComments}</Typography>
          </Paper>
        </Grid>

        {/* Engagement Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Content Engagement
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="likes" fill="#0077B5" />
                  <Bar dataKey="comments" fill="#00A0DC" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard; 