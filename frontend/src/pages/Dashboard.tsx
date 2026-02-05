import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Divider,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // In a real application, this would fetch user data from your API
    // For now, we'll simulate loading with a timeout and mock data
    const timer = setTimeout(() => {
      setUserData({
        name: 'Alex Johnson',
        assessmentCompleted: true,
        careerRecommendations: [
          { id: 1, title: 'Frontend Developer', matchPercentage: 92 },
          { id: 2, title: 'UX Designer', matchPercentage: 85 },
          { id: 3, title: 'Full Stack Developer', matchPercentage: 78 }
        ],
        learningPlan: {
          id: 1,
          title: '1-Year Frontend Developer Path',
          progress: 35,
          nextMilestone: 'CSS Frameworks & Responsive Design',
          dueDays: 14
        },
        recentActivity: [
          { id: 1, type: 'task', title: 'Complete HTML Basics', date: '2 days ago' },
          { id: 2, type: 'resource', title: 'JavaScript Fundamentals Course', date: '5 days ago' },
          { id: 3, type: 'forum', title: 'Posted in "Getting Started with React"', date: '1 week ago' }
        ]
      });
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {userData.name}!
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Track your progress, continue your learning journey, and explore resources to help you succeed.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Career Path Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Your Career Path
            </Typography>
            
            {userData.assessmentCompleted ? (
              <Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Based on your assessment, here are your top career matches:
                </Typography>
                <Grid container spacing={2}>
                  {userData.careerRecommendations.map((career: any) => (
                    <Grid item xs={12} sm={4} key={career.id}>
                      <Card 
                        sx={{ 
                          height: '100%',
                          borderLeft: 6, 
                          borderColor: 'primary.main',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)'
                          }
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" component="h3" gutterBottom>
                            {career.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
                              Match:
                            </Typography>
                            <Chip 
                              label={`${career.matchPercentage}%`} 
                              color="primary" 
                              size="small" 
                              sx={{ fontWeight: 'bold' }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/career-recommendations')}
                >
                  View All Career Recommendations
                </Button>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  You haven't completed your career assessment yet.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => navigate('/assessment')}
                >
                  Take Assessment
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Learning Progress Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Learning Progress
            </Typography>
            
            {userData.learningPlan ? (
              <Box>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {userData.learningPlan.title}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                    <CircularProgress 
                      variant="determinate" 
                      value={userData.learningPlan.progress} 
                      size={60}
                      thickness={5}
                      color="success"
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="caption" component="div" color="text.secondary" fontWeight="bold">
                        {`${userData.learningPlan.progress}%`}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Next milestone:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {userData.learningPlan.nextMilestone}
                    </Typography>
                    <Typography variant="caption" color="error">
                      Due in {userData.learningPlan.dueDays} days
                    </Typography>
                  </Box>
                </Box>
                
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  onClick={() => navigate(`/learning-plan/${userData.learningPlan.id}`)}
                >
                  Continue Learning
                </Button>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  You don't have a learning plan yet.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => navigate('/career-recommendations')}
                >
                  Create Learning Plan
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Recent Activity Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {userData.recentActivity.map((activity: any) => (
                <React.Fragment key={activity.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      {activity.type === 'task' && <CheckCircleIcon color="success" />}
                      {activity.type === 'resource' && <SchoolIcon color="primary" />}
                      {activity.type === 'forum' && <ForumIcon color="secondary" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.title}
                      secondary={activity.date}
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
            <Button 
              variant="text" 
              color="primary" 
              sx={{ mt: 1 }}
              onClick={() => navigate('/profile')}
            >
              View All Activity
            </Button>
          </Paper>
        </Grid>

        {/* Quick Links Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Quick Links
            </Typography>
            <List>
              <ListItem button onClick={() => navigate('/resources')}>
                <ListItemIcon>
                  <SchoolIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Learning Resources" />
              </ListItem>
              <ListItem button onClick={() => navigate('/community')}>
                <ListItemIcon>
                  <ForumIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Community Forum" />
              </ListItem>
              <ListItem button onClick={() => navigate('/profile')}>
                <ListItemIcon>
                  <AccountCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Update Profile" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// Import these icons
import ForumIcon from '@mui/icons-material/Forum';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default Dashboard;
