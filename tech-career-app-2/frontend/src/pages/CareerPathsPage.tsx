import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SchoolIcon from '@mui/icons-material/School';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`career-tabpanel-${index}`}
      aria-labelledby={`career-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const CareerPathsPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [careerPaths, setCareerPaths] = useState<any[]>([]);
  const [jobRoles, setJobRoles] = useState<any[]>([]);

  useEffect(() => {
    // Mock data loading - would be replaced with actual API calls
    setTimeout(() => {
      setCareerPaths([
        {
          id: 1,
          name: 'Web Development',
          description: 'Design and build websites and web applications that are responsive, accessible, and user-friendly.',
          requiredSkills: 'HTML, CSS, JavaScript, responsive design, version control',
          averageSalaryRange: '$60,000 - $120,000',
          marketDemand: 'High',
          growthPotential: 'Strong growth expected as businesses continue to expand their online presence.',
          entryLevelFriendly: true,
          image: 'https://source.unsplash.com/random/300x200/?coding'
        },
        {
          id: 2,
          name: 'Data Science',
          description: 'Analyze and interpret complex data to help organizations make better decisions.',
          requiredSkills: 'Statistics, Python, R, SQL, data visualization, machine learning',
          averageSalaryRange: '$70,000 - $140,000',
          marketDemand: 'High',
          growthPotential: 'Rapid growth as organizations increasingly rely on data-driven decision making.',
          entryLevelFriendly: false,
          image: 'https://source.unsplash.com/random/300x200/?data'
        },
        {
          id: 3,
          name: 'UX/UI Design',
          description: 'Create intuitive, accessible, and visually appealing user interfaces for digital products.',
          requiredSkills: 'User research, wireframing, prototyping, visual design, usability testing',
          averageSalaryRange: '$65,000 - $125,000',
          marketDemand: 'Medium',
          growthPotential: 'Steady growth as companies focus more on user experience.',
          entryLevelFriendly: true,
          image: 'https://source.unsplash.com/random/300x200/?design'
        },
        {
          id: 4,
          name: 'Cybersecurity',
          description: 'Protect systems, networks, and programs from digital attacks.',
          requiredSkills: 'Network security, encryption, security protocols, ethical hacking, risk assessment',
          averageSalaryRange: '$75,000 - $150,000',
          marketDemand: 'High',
          growthPotential: 'Very strong growth as cyber threats continue to evolve and increase.',
          entryLevelFriendly: false,
          image: 'https://source.unsplash.com/random/300x200/?security'
        }
      ]);
      
      setJobRoles([
        {
          id: 1,
          careerPathId: 1,
          title: 'Frontend Developer',
          description: 'Build the user-facing parts of websites and web applications.',
          responsibilities: 'Implement visual elements, ensure responsive design, optimize for performance',
          requiredSkills: 'HTML, CSS, JavaScript, React/Angular/Vue',
          preferredSkills: 'TypeScript, testing frameworks, accessibility standards',
          averageSalaryRange: '$60,000 - $110,000',
          marketDemand: 'High',
          entryLevelFriendly: true
        },
        {
          id: 2,
          careerPathId: 1,
          title: 'Backend Developer',
          description: 'Build and maintain the server-side of web applications.',
          responsibilities: 'Create APIs, manage databases, ensure security and performance',
          requiredSkills: 'Node.js, Python, Java, or PHP, databases, API design',
          preferredSkills: 'Cloud services, microservices architecture, security best practices',
          averageSalaryRange: '$65,000 - $120,000',
          marketDemand: 'High',
          entryLevelFriendly: false
        },
        {
          id: 3,
          careerPathId: 1,
          title: 'Full Stack Developer',
          description: 'Work on both client and server-side of web applications.',
          responsibilities: 'Develop end-to-end features, manage databases, implement UI components',
          requiredSkills: 'Frontend and backend technologies, databases, version control',
          preferredSkills: 'DevOps, testing, performance optimization',
          averageSalaryRange: '$70,000 - $130,000',
          marketDemand: 'High',
          entryLevelFriendly: false
        },
        {
          id: 4,
          careerPathId: 2,
          title: 'Data Analyst',
          description: 'Analyze data to help companies make better business decisions.',
          responsibilities: 'Clean and process data, create visualizations, generate reports',
          requiredSkills: 'SQL, Excel, data visualization tools, basic statistics',
          preferredSkills: 'Python or R, business intelligence tools, domain knowledge',
          averageSalaryRange: '$55,000 - $95,000',
          marketDemand: 'Medium',
          entryLevelFriendly: true
        },
        {
          id: 5,
          careerPathId: 2,
          title: 'Data Scientist',
          description: 'Use advanced analytics to extract insights from complex data.',
          responsibilities: 'Build predictive models, conduct statistical analysis, communicate findings',
          requiredSkills: 'Python or R, statistics, machine learning, data visualization',
          preferredSkills: 'Deep learning, big data technologies, domain expertise',
          averageSalaryRange: '$80,000 - $140,000',
          marketDemand: 'High',
          entryLevelFriendly: false
        },
        {
          id: 6,
          careerPathId: 3,
          title: 'UX Designer',
          description: 'Focus on how users interact with products to create intuitive experiences.',
          responsibilities: 'Conduct user research, create wireframes, develop user flows, usability testing',
          requiredSkills: 'User research, wireframing, prototyping, usability testing',
          preferredSkills: 'Psychology background, accessibility knowledge, coding basics',
          averageSalaryRange: '$65,000 - $115,000',
          marketDemand: 'Medium',
          entryLevelFriendly: true
        },
        {
          id: 7,
          careerPathId: 3,
          title: 'UI Designer',
          description: 'Create visually appealing interfaces for digital products.',
          responsibilities: 'Design visual elements, create style guides, ensure brand consistency',
          requiredSkills: 'Visual design, typography, color theory, design tools (Figma, Adobe XD)',
          preferredSkills: 'Animation, illustration, frontend coding basics',
          averageSalaryRange: '$60,000 - $110,000',
          marketDemand: 'Medium',
          entryLevelFriendly: true
        },
        {
          id: 8,
          careerPathId: 4,
          title: 'Security Analyst',
          description: 'Monitor and protect information systems from security threats.',
          responsibilities: 'Monitor security systems, investigate breaches, implement security measures',
          requiredSkills: 'Network security, security tools, threat detection, incident response',
          preferredSkills: 'Security certifications, scripting, cloud security',
          averageSalaryRange: '$65,000 - $110,000',
          marketDemand: 'High',
          entryLevelFriendly: false
        }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getJobRolesForPath = (pathId: number) => {
    return jobRoles.filter(role => role.careerPathId === pathId);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Career Paths
      </Typography>
      
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : undefined}
          aria-label="career paths tabs"
        >
          <Tab label="All Paths" />
          <Tab label="Entry-Level Friendly" />
          <Tab label="High Demand" />
          <Tab label="Job Roles" />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {careerPaths.map((path) => (
              <Grid item xs={12} md={6} key={path.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={path.image}
                    alt={path.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {path.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {path.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TrendingUpIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '1rem' }} />
                      <Typography variant="body2" color="text.secondary">
                        Demand: {path.marketDemand}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AttachMoneyIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '1rem' }} />
                      <Typography variant="body2" color="text.secondary">
                        Salary: {path.averageSalaryRange}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      {path.entryLevelFriendly && (
                        <Chip 
                          label="Entry-Level Friendly" 
                          color="success" 
                          size="small" 
                          sx={{ mr: 1, mb: 1 }} 
                        />
                      )}
                      <Chip 
                        label={`${path.marketDemand} Demand`} 
                        color={path.marketDemand === 'High' ? 'primary' : 'default'} 
                        size="small" 
                        sx={{ mr: 1, mb: 1 }} 
                      />
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => navigate(`/careers/path/${path.id}`)}>
                      Learn More
                    </Button>
                    <Button 
                      size="small" 
                      variant="contained" 
                      onClick={() => navigate(`/learning/create?path=${path.id}`)}
                    >
                      Explore This Path
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {careerPaths
              .filter(path => path.entryLevelFriendly)
              .map((path) => (
                <Grid item xs={12} md={6} key={path.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={path.image}
                      alt={path.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {path.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {path.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <TrendingUpIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '1rem' }} />
                        <Typography variant="body2" color="text.secondary">
                          Demand: {path.marketDemand}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AttachMoneyIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '1rem' }} />
                        <Typography variant="body2" color="text.secondary">
                          Salary: {path.averageSalaryRange}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Chip 
                          label="Entry-Level Friendly" 
                          color="success" 
                          size="small" 
                          sx={{ mr: 1, mb: 1 }} 
                        />
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => navigate(`/careers/path/${path.id}`)}>
                        Learn More
                      </Button>
                      <Button 
                        size="small" 
                        variant="contained" 
                        onClick={() => navigate(`/learning/create?path=${path.id}`)}
                      >
                        Explore This Path
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {careerPaths
              .filter(path => path.marketDemand === 'High')
              .map((path) => (
                <Grid item xs={12} md={6} key={path.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={path.image}
                      alt={path.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {path.name}
<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>