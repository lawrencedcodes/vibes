import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  TextField, 
  Button, 
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  CardActions,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
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

const ProfilePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  
  // User profile state
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [learningProgress, setLearningProgress] = useState<any[]>([]);
  
  // Form state
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    // Mock data loading - would be replaced with actual API calls
    setTimeout(() => {
      const mockProfile = {
        id: 1,
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        bio: 'Aspiring frontend developer with a background in graphic design. Currently learning React and modern JavaScript frameworks.',
        currentOccupation: 'Graphic Designer',
        yearsOfExperience: 3,
        educationLevel: 'Bachelor\'s Degree',
        location: 'San Francisco, CA',
        technologicalAccess: 'High-speed internet, laptop, and smartphone',
        preferredWorkEnvironment: 'Remote with occasional in-office collaboration',
        profileCompleted: true,
        joinDate: '2025-01-15T00:00:00'
      };
      
      setProfile(mockProfile);
      setFormData(mockProfile);
      
      setSkills([
        {
          id: 1,
          name: 'HTML',
          level: 4,
          isStrength: true,
          isInterest: true
        },
        {
          id: 2,
          name: 'CSS',
          level: 4,
          isStrength: true,
          isInterest: true
        },
        {
          id: 3,
          name: 'JavaScript',
          level: 3,
          isStrength: false,
          isInterest: true
        },
        {
          id: 4,
          name: 'React',
          level: 2,
          isStrength: false,
          isInterest: true
        },
        {
          id: 5,
          name: 'UI Design',
          level: 4,
          isStrength: true,
          isInterest: true
        },
        {
          id: 6,
          name: 'Graphic Design',
          level: 5,
          isStrength: true,
          isInterest: true
        }
      ]);
      
      setLearningProgress([
        {
          id: 1,
          title: 'Frontend Development Path',
          progress: 35,
          completedMilestones: 2,
          totalMilestones: 10,
          lastActivity: '2025-03-25T14:30:00'
        }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    setProfile(formData);
    setEditMode(false);
  };

  const handleToggleStrength = (skillId: number) => {
    setSkills(skills.map(skill => 
      skill.id === skillId 
        ? { ...skill, isStrength: !skill.isStrength } 
        : skill
    ));
  };

  const handleToggleInterest = (skillId: number) => {
    setSkills(skills.map(skill => 
      skill.id === skillId 
        ? { ...skill, isInterest: !skill.isInterest } 
        : skill
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
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
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar 
                sx={{ width: 100, height: 100, mb: 2, bgcolor: theme.palette.primary.main }}
              >
                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
              </Avatar>
              <Typography variant="h5" component="h1" align="center">
                {profile.firstName} {profile.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                @{profile.username}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                Member since {formatDate(profile.joinDate)}
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <WorkIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Current Occupation" 
                  secondary={profile.currentOccupation} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Education" 
                  secondary={profile.educationLevel} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Location" 
                  secondary={profile.location} 
                />
              </ListItem>
            </List>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Bio
              </Typography>
              <Typography variant="body2">
                {profile.bio}
              </Typography>
            </Box>
            
            <Button 
              fullWidth 
              variant="outlined" 
              startIcon={<EditIcon />}
              onClick={() => setEditMode(true)}
              sx={{ mt: 3 }}
            >
              Edit Profile
            </Button>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Skills & Interests
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {skills.map((skill) => (
              <Box key={skill.id} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="body1">
                    {skill.name}
                  </Typography>
                  <Box>
                    {skill.isStrength && (
                      <Chip 
                        label="Strength" 
                        size="small" 
                        color="success" 
                        sx={{ mr: 0.5 }} 
                      />
                    )}
                    {skill.isInterest && (
                      <Chip 
                        label="Interest" 
                        size="small" 
                        color="primary" 
                      />
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={(skill.level / 5) * 100} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {skill.level}/5
                  </Typography>
                </Box>
              </Box>
            ))}
            
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={() => navigate('/assessment')}
              sx={{ mt: 2 }}
            >
              Update Skills Assessment
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ mb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons={isMobile ? "auto" : undefined}
              aria-label="profile tabs"
            >
              <Tab icon={<PersonIcon />} label="Profile Details" />
              <Tab icon={<SchoolIcon />} label="Learning Progress" />
              <Tab icon={<SettingsIcon />} label="Settings" />
            </Tabs>
            
            <TabPanel value={tabValue} index={0}>
              {editMode ? (
                <Box component="form">
                  <Typography variant="h6" gutterBottom>
                    Edit Profile
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Bio"
                        name="bio"
                        multiline
                        rows={4}
                        value={formData.bio}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Current Occupation"
                        name="currentOccupation"
                        value={formData.currentOccupation}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Years of Experience"
                        name="yearsOfExperience"
                        type="number"
                        value={formData.yearsOfExperience}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Education Level"
                        name="educationLevel"
                        value={formData.educationLevel}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Technological Access"
                        name="technologicalAccess"
                        value={formData.technologicalAccess}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Preferred Work Environment"
                        name="preferredWorkEnvironment"
                        value={formData.preferredWorkEnvironment}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button 
                      variant="outlined" 
                      onClick={() => setEditMode(false)}
                      sx={{ mr: 2 }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="contained" 
                      startIcon={<SaveIcon />}
                      onClick={handleSaveProfile}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Profile Details
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {profile.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Username
                      </Typography>
                      <Typography<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>