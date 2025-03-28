import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  useTheme
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import DevicesIcon from '@mui/icons-material/Devices';

const Home: React.FC = () => {
  const theme = useTheme();

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          py: { xs: 6, md: 12 },
          textAlign: 'center',
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(98, 0, 238, 0.1)' : 'rgba(98, 0, 238, 0.05)',
          borderRadius: 2,
          mb: 6
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              mb: 2
            }}
          >
            Your Path to a Tech Career Starts Here
          </Typography>
          <Typography 
            variant="h5" 
            component="p" 
            color="textSecondary"
            sx={{ mb: 4 }}
          >
            Discover personalized career recommendations, structured learning plans, and a supportive community to guide your journey into technology.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              component={RouterLink}
              to="/register"
            >
              Get Started
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              component={RouterLink}
              to="/assessment"
            >
              Take Assessment
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: 8 }}>
        <Container>
          <Typography 
            variant="h2" 
            component="h2" 
            align="center"
            sx={{ mb: 6 }}
          >
            How Tech Pathways Works
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  }
                }}
              >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                  <AssessmentIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                </Box>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    Assess Your Fit
                  </Typography>
                  <Typography>
                    Take our comprehensive assessment to identify your strengths, interests, and learning style.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  }
                }}
              >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                  <DevicesIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                </Box>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    Discover Careers
                  </Typography>
                  <Typography>
                    Get personalized tech career recommendations based on your unique profile.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  }
                }}
              >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                  <SchoolIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                </Box>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    Follow Your Plan
                  </Typography>
                  <Typography>
                    Get a structured 1-year learning plan with milestones, resources, and projects.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  }
                }}
              >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                  <EmojiPeopleIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                </Box>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    Join the Community
                  </Typography>
                  <Typography>
                    Connect with peers, mentors, and industry professionals for support and networking.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Career Paths Preview */}
      <Box sx={{ mb: 8, py: 6, backgroundColor: theme.palette.mode === 'dark' ? 'rgba(3, 218, 198, 0.1)' : 'rgba(3, 218, 198, 0.05)' }}>
        <Container>
          <Typography 
            variant="h2" 
            component="h2" 
            align="center"
            sx={{ mb: 6 }}
          >
            Popular Tech Career Paths
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: 'Web Development',
                image: 'https://source.unsplash.com/random/300x200/?coding',
                description: 'Build websites and web applications using modern frameworks and tools.'
              },
              {
                title: 'Data Science',
                image: 'https://source.unsplash.com/random/300x200/?data',
                description: 'Analyze data, build models, and extract insights to drive business decisions.'
              },
              {
                title: 'UX/UI Design',
                image: 'https://source.unsplash.com/random/300x200/?design',
                description: 'Create intuitive, accessible, and beautiful user experiences for digital products.'
              },
              {
                title: 'Cybersecurity',
                image: 'https://source.unsplash.com/random/300x200/?security',
                description: 'Protect systems, networks, and data from digital attacks and threats.'
              }
            ].map((career, index) => (
              <Grid item key={index} xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)'
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={career.image}
                    alt={career.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h3">
                      {career.title}
                    </Typography>
                    <Typography>
                      {career.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              component={RouterLink}
              to="/career-recommendations"
            >
              Explore All Career Paths
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box sx={{ mb: 8 }}>
        <Container>
          <Typography 
            variant="h2" 
            component="h2" 
            align="center"
            sx={{ mb: 6 }}
          >
            Success Stories
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                name: 'Sarah Johnson',
                role: 'Frontend Developer',
                image: 'https://source.unsplash.com/random/100x100/?woman',
                quote: 'Tech Pathways helped me transition from teaching to web development in just 10 months. The structured learning plan and community support made all the difference.'
              },
              {
                name: 'Michael Chen',
                role: 'Data Analyst',
                image: 'https://source.unsplash.com/random/100x100/?man',
                quote: 'After taking the assessment, I discovered data analysis was a perfect fit for my skills. One year later, I landed my dream job at a tech company.'
              },
              {
                name: 'Priya Patel',
                role: 'UX Designer',
                image: 'https://source.unsplash.com/random/100x100/?woman',
                quote: 'The personalized learning path helped me focus on the right skills and build a portfolio that got me hired. I couldn\'t have done it without Tech Pathways.'
              }
            ].map((testimonial, index) => (
              <Grid item key={index} xs={12} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        component="img"
                        sx={{
                          height: 60,
                          width: 60,
                          borderRadius: '50%',
                          mr: 2
                        }}
                        src={testimonial.image}
                        alt={testimonial.name}
                      />
                      <Box>
                        <Typography variant="h6" component="h3">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                      "{testimonial.quote}"
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          py: 8, 
          textAlign: 'center',
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(98, 0, 238, 0.1)' : 'rgba(98, 0, 238, 0.05)',
          borderRadius: 2
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom>
            Ready to Start Your Tech Journey?
          </Typography>
          <Typography variant="h6" component="p" color="textSecondary" sx={{ mb: 4 }}>
            Join thousands of others who have successfully transitioned into rewarding tech careers.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            component={RouterLink}
            to="/register"
            sx={{ px: 4, py: 1.5 }}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
