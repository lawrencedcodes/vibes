import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Chip,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  LinearProgress,
  useTheme
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CodeIcon from '@mui/icons-material/Code';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import StorageIcon from '@mui/icons-material/Storage';
import SecurityIcon from '@mui/icons-material/Security';
import { useNavigate } from 'react-router-dom';

const CareerRecommendations: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    // In a real application, this would fetch recommendations from your API
    // For now, we'll simulate loading with a timeout and mock data
    const timer = setTimeout(() => {
      setRecommendations([
        {
          id: 1,
          title: 'Frontend Developer',
          matchPercentage: 92,
          description: 'Frontend developers build the user interfaces of websites and applications. They use HTML, CSS, and JavaScript to create responsive and interactive experiences.',
          skills: ['HTML/CSS', 'JavaScript', 'React', 'UI/UX Principles', 'Responsive Design'],
          salary: '$75,000 - $120,000',
          growth: 'Faster than average (13% growth)',
          icon: <CodeIcon fontSize="large" />
        },
        {
          id: 2,
          title: 'UX Designer',
          matchPercentage: 85,
          description: 'UX Designers focus on creating intuitive, accessible, and enjoyable user experiences. They conduct research, create wireframes, and design user interfaces.',
          skills: ['User Research', 'Wireframing', 'Prototyping', 'Visual Design', 'Usability Testing'],
          salary: '$70,000 - $110,000',
          growth: 'Much faster than average (23% growth)',
          icon: <DesignServicesIcon fontSize="large" />
        },
        {
          id: 3,
          title: 'Full Stack Developer',
          matchPercentage: 78,
          description: 'Full Stack Developers work on both frontend and backend aspects of web applications. They have a broad skill set covering multiple technologies.',
          skills: ['JavaScript', 'React/Angular/Vue', 'Node.js', 'Databases', 'API Development'],
          salary: '$85,000 - $135,000',
          growth: 'Faster than average (15% growth)',
          icon: <CodeIcon fontSize="large" />
        },
        {
          id: 4,
          title: 'Data Analyst',
          matchPercentage: 72,
          description: 'Data Analysts collect, process, and analyze data to help organizations make better decisions. They create visualizations and reports to communicate insights.',
          skills: ['SQL', 'Excel', 'Data Visualization', 'Statistical Analysis', 'Python/R'],
          salary: '$65,000 - $95,000',
          growth: 'Much faster than average (23% growth)',
          icon: <StorageIcon fontSize="large" />
        },
        {
          id: 5,
          title: 'Cybersecurity Specialist',
          matchPercentage: 68,
          description: 'Cybersecurity Specialists protect systems, networks, and data from digital attacks. They implement security measures and respond to incidents.',
          skills: ['Network Security', 'Security Tools', 'Risk Assessment', 'Incident Response', 'Security Compliance'],
          salary: '$80,000 - $130,000',
          growth: 'Much faster than average (33% growth)',
          icon: <SecurityIcon fontSize="large" />
        }
      ]);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const [selectedCareer, setSelectedCareer] = useState<number | null>(null);

  const handleSelectCareer = (id: number) => {
    setSelectedCareer(id);
  };

  const handleCreateLearningPlan = () => {
    // In a real application, this would call your API to create a learning plan
    // For now, we'll just navigate to the learning plan page
    navigate('/learning-plan');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const selectedCareerData = recommendations.find(career => career.id === selectedCareer);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Career Recommendations
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Based on your assessment, we've identified these tech career paths that match your interests, skills, and preferences.
      </Typography>

      <Grid container spacing={4}>
        {/* Career List */}
        <Grid item xs={12} md={5} lg={4}>
          <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: 'primary.main' }}>
              <Typography variant="h6" sx={{ color: 'white' }}>
                Recommended Career Paths
              </Typography>
            </Box>
            <List sx={{ p: 0 }}>
              {recommendations.map((career, index) => (
                <React.Fragment key={career.id}>
                  <ListItem 
                    button 
                    selected={selectedCareer === career.id}
                    onClick={() => handleSelectCareer(career.id)}
                    sx={{ 
                      py: 2,
                      borderLeft: selectedCareer === career.id ? 6 : 0,
                      borderColor: 'primary.main',
                      transition: 'all 0.2s'
                    }}
                  >
                    <ListItemIcon>
                      <Avatar 
                        sx={{ 
                          bgcolor: selectedCareer === career.id ? 'primary.main' : 'grey.200',
                          color: selectedCareer === career.id ? 'white' : 'grey.700'
                        }}
                      >
                        {career.icon}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography variant="subtitle1" component="span">
                          {career.title}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <Chip 
                            label={`${career.matchPercentage}% Match`} 
                            size="small" 
                            color={career.matchPercentage > 80 ? "success" : "primary"}
                            sx={{ fontWeight: 'medium' }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recommendations.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Career Details */}
        <Grid item xs={12} md={7} lg={8}>
          {selectedCareerData ? (
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'primary.main',
                    width: 56,
                    height: 56,
                    mr: 2
                  }}
                >
                  {selectedCareerData.icon}
                </Avatar>
                <Box>
                  <Typography variant="h5" component="h2">
                    {selectedCareerData.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
                      Match Score:
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={selectedCareerData.matchPercentage} 
                      sx={{ 
                        width: 100, 
                        height: 8, 
                        borderRadius: 4,
                        mr: 1,
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: selectedCareerData.matchPercentage > 80 ? '#4caf50' : '#2196f3',
                          borderRadius: 4
                        }
                      }}
                    />
                    <Typography variant="body2" fontWeight="bold" color={selectedCareerData.matchPercentage > 80 ? "success.main" : "primary.main"}>
                      {selectedCareerData.matchPercentage}%
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body1" paragraph>
                {selectedCareerData.description}
              </Typography>

              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <WorkIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6" component="h3">
                          Salary Range
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        {selectedCareerData.salary}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6" component="h3">
                          Job Growth
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        {selectedCareerData.growth}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  Key Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {selectedCareerData.skills.map((skill: string, index: number) => (
                    <Chip 
                      key={index} 
                      label={skill} 
                      variant="outlined" 
                      color="primary"
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleCreateLearningPlan}
                  startIcon={<SchoolIcon />}
                >
                  Create Learning Plan for This Career
                </Button>
              </Box>
            </Paper>
          ) : (
            <Paper sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary">
                Select a career from the list to view details
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CareerRecommendations;
