import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AssessmentIcon from '@mui/icons-material/Assessment';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PersonIcon from '@mui/icons-material/Person';
import TimelineIcon from '@mui/icons-material/Timeline';

const DashboardPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [assessmentStatus, setAssessmentStatus] = useState({
    interest: false,
    skill: false,
    workStyle: false,
    techAccess: false
  });
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [learningPlans, setLearningPlans] = useState<any[]>([]);

  useEffect(() => {
    // Mock data loading - would be replaced with actual API calls
    setTimeout(() => {
      setUser({
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        profileCompleted: true
      });
      
      setAssessmentStatus({
        interest: true,
        skill: true,
        workStyle: false,
        techAccess: false
      });
      
      setRecommendations([
        {
          id: 1,
          jobRole: 'Frontend Developer',
          matchPercentage: 87,
          description: 'Based on your interests in design and coding skills.'
        },
        {
          id: 2,
          jobRole: 'UX Designer',
          matchPercentage: 75,
          description: 'Your creative skills and attention to detail are a good match.'
        },
        {
          id: 3,
          jobRole: 'Full Stack Developer',
          matchPercentage: 68,
          description: 'Your technical aptitude suggests you could excel in this role.'
        }
      ]);
      
      setLearningPlans([
        {
          id: 1,
          title: 'Frontend Development Path',
          progress: 35,
          nextMilestone: 'CSS Frameworks & Responsive Design'
        }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user.firstName}!
      </Typography>
      
      <Grid container spacing={3}>
        {/* Assessment Progress */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AssessmentIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" component="h2">
                Assessment Progress
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              <ListItem>
                <ListItemIcon>
                  {assessmentStatus.interest ? <CheckCircleIcon color="success" /> : <RadioButtonUncheckedIcon />}
                </ListItemIcon>
                <ListItemText 
                  primary="Interest & Passion Assessment" 
                  secondary={assessmentStatus.interest ? "Completed" : "Not started"} 
                />
                {!assessmentStatus.interest && (
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => navigate('/assessment')}
                  >
                    Start
                  </Button>
                )}
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  {assessmentStatus.skill ? <CheckCircleIcon color="success" /> : <RadioButtonUncheckedIcon />}
                </ListItemIcon>
                <ListItemText 
                  primary="Skill & Strength Assessment" 
                  secondary={assessmentStatus.skill ? "Completed" : "Not started"} 
                />
                {!assessmentStatus.skill && (
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => navigate('/assessment')}
                  >
                    Start
                  </Button>
                )}
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  {assessmentStatus.workStyle ? <CheckCircleIcon color="success" /> : <RadioButtonUncheckedIcon />}
                </ListItemIcon>
                <ListItemText 
                  primary="Work Style & Preferences" 
                  secondary={assessmentStatus.workStyle ? "Completed" : "Not started"} 
                />
                {!assessmentStatus.workStyle && (
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => navigate('/assessment')}
                  >
                    Start
                  </Button>
                )}
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  {assessmentStatus.techAccess ? <CheckCircleIcon color="success" /> : <RadioButtonUncheckedIcon />}
                </ListItemIcon>
                <ListItemText 
                  primary="Technological Access Assessment" 
                  secondary={assessmentStatus.techAccess ? "Completed" : "Not started"} 
                />
                {!assessmentStatus.techAccess && (
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => navigate('/assessment')}
                  >
                    Start
                  </Button>
                )}
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        {/* Profile Completion */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" component="h2">
                Profile Status
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {user.profileCompleted ? (
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                ) : (
                  <RadioButtonUncheckedIcon sx={{ mr: 1 }} />
                )}
                <Typography>
                  {user.profileCompleted ? 
                    "Your profile is complete" : 
                    "Your profile needs to be completed"}
                </Typography>
              </Box>
              <Button 
                variant={user.profileCompleted ? "outlined" : "contained"} 
                size="small"
                onClick={() => navigate('/profile')}
              >
                {user.profileCompleted ? "View Profile" : "Complete Profile"}
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary">
              A complete profile helps us provide more accurate career recommendations and learning plans.
            </Typography>
          </Paper>
        </Grid>
        
        {/* Career Recommendations */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WorkIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" component="h2">
                Career Recommendations
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {recommendations.length > 0 ? (
              <Grid container spacing={2}>
                {recommendations.map((recommendation) => (
                  <Grid item xs={12} sm={6} md={4} key={recommendation.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {recommendation.jobRole}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ position: 'relative', display: 'inline-flex', mr: 1 }}>
                            <CircularProgress 
                              variant="determinate" 
                              value={recommendation.matchPercentage} 
                              size={40}
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
                              <Typography variant="caption" component="div" color="text.secondary">
                                {recommendation.matchPercentage}%
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Match
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {recommendation.description}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" onClick={() => navigate(`/careers/${recommendation.id}`)}>
                          Learn More
                        </Button>
                        <Button 
                          size="small" 
                          variant="contained" 
                          onClick={() => navigate(`/learning/create?role=${recommendation.id}`)}
                        >
                          Create Learning Plan
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body1" gutterBottom>
                  Complete your assessments to get personalized career recommendations.
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/assessment')}
                  sx={{ mt: 2 }}
                >
                  Start Assessments
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Learning Plans */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SchoolIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" component="h2">
                Your Learning Plans
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {learningPlans.length > 0 ? (
              <Grid container spacing={2}>
                {learningPlans.map((plan) => (
                  <Grid item xs={12} sm={6} key={plan.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {plan.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ position: 'relative', display: 'inline-flex', mr: 1 }}>
                            <CircularProgress 
                              variant="determinate" 
                              value={plan.progress} 
                              size={40}
                              color="primary"
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
                              <Typography variant="caption" component="div" color="text.secondary">
                                {plan.progress}%
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Progress
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TimelineIcon sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            Next: {plan.nextMilestone}
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button size="small" onClick={() => navigate(`/learning/${plan.id}`)}>
                          View Plan
                        </Button>
                        <Button 
                          size="small" 
                          variant="contained" 
                          onClick={() => navigate(`/learning/${plan.id}`)}
                        >
                          Continue Learning
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body1" gutterBottom>
                  You don't have any learning plans yet. Create one based on your career interests.
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/careers')}
                  sx={{ mt: 2 }}
                >
                  Explore Career Paths
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
