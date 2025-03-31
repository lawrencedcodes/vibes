import React from 'react';
import { Container, Typography, Box, Button, Grid, Paper, useTheme, useMediaQuery } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'background.paper', 
          pt: { xs: 8, sm: 12 }, 
          pb: { xs: 8, sm: 12 },
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            color="text.primary"
            gutterBottom
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '2.5rem', sm: '3.5rem' }
            }}
          >
            Find Your Path in Technology
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            paragraph
            sx={{ mb: 4 }}
          >
            Discover personalized career paths, learning plans, and community support
            to help you navigate your journey into the technology industry.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button 
                  variant="contained" 
                  size="large" 
                  component={RouterLink} 
                  to="/register"
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    fontSize: '1.1rem'
                  }}
                >
                  Get Started
                </Button>
              </Grid>
              <Grid item>
                <Button 
                  variant="outlined" 
                  size="large" 
                  component={RouterLink} 
                  to="/login"
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    fontSize: '1.1rem'
                  }}
                >
                  Sign In
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ mb: 6 }}
        >
          How It Works
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <AssessmentIcon sx={{ fontSize: 60, mb: 2, color: theme.palette.primary.main }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Assessment
              </Typography>
              <Typography>
                Discover your strengths, interests, and learning style through our comprehensive assessments.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <WorkIcon sx={{ fontSize: 60, mb: 2, color: theme.palette.primary.main }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Career Matching
              </Typography>
              <Typography>
                Get personalized career recommendations based on your unique profile and goals.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <SchoolIcon sx={{ fontSize: 60, mb: 2, color: theme.palette.primary.main }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Learning Plan
              </Typography>
              <Typography>
                Follow a structured, step-by-step learning plan with realistic timelines and resources.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <PeopleIcon sx={{ fontSize: 60, mb: 2, color: theme.palette.primary.main }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Community
              </Typography>
              <Typography>
                Connect with peers, mentors, and industry professionals for support and networking.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box 
        sx={{ 
          bgcolor: 'background.paper', 
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to Start Your Tech Career Journey?
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            Join thousands of others who have successfully transitioned into rewarding technology careers.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            component={RouterLink} 
            to="/register"
            sx={{ 
              px: 4, 
              py: 1.5,
              fontSize: '1.1rem'
            }}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
