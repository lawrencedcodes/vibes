import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  TextField,
  IconButton,
  Tabs,
  Tab,
  LinearProgress,
  Chip,
  Switch,
  FormControlLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ForumIcon from '@mui/icons-material/Forum';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';

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
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editedUserData, setEditedUserData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // In a real application, this would fetch user data from your API
    // For now, we'll simulate loading with a timeout and mock data
    const timer = setTimeout(() => {
      const mockUserData = {
        id: 1,
        username: 'alexjohnson',
        email: 'alex.johnson@example.com',
        firstName: 'Alex',
        lastName: 'Johnson',
        avatar: 'https://i.pravatar.cc/150?img=1',
        bio: 'Former marketing professional transitioning to frontend development. Passionate about creating intuitive user experiences and solving problems through code.',
        location: 'Chicago, IL',
        joinDate: '2025-01-15T00:00:00Z',
        careerGoal: 'Frontend Developer',
        learningPreferences: {
          learningStyle: 'Visual',
          pacePreference: 'Steady',
          preferredResources: ['Interactive Tutorials', 'Video Courses', 'Project-Based Learning']
        },
        skills: [
          { name: 'HTML', level: 75 },
          { name: 'CSS', level: 70 },
          { name: 'JavaScript', level: 60 },
          { name: 'React', level: 45 },
          { name: 'UI/UX Design', level: 65 }
        ],
        activity: [
          { id: 1, type: 'assessment', title: 'Completed Career Assessment', date: '2025-02-10T14:30:00Z' },
          { id: 2, type: 'learning', title: 'Completed HTML Basics milestone', date: '2025-02-20T16:45:00Z' },
          { id: 3, type: 'forum', title: 'Posted in "Getting Started with React"', date: '2025-03-05T09:15:00Z' },
          { id: 4, type: 'resource', title: 'Saved "Frontend Masters" resource', date: '2025-03-12T11:30:00Z' },
          { id: 5, type: 'learning', title: 'Completed CSS Fundamentals task', date: '2025-03-18T15:20:00Z' }
        ],
        savedResources: [
          { id: 1, title: 'Frontend Masters', type: 'Video Courses' },
          { id: 2, title: 'MDN Web Docs', type: 'Documentation' },
          { id: 3, title: 'CSS-Tricks', type: 'Blog/Tutorials' }
        ],
        forumActivity: [
          { id: 1, title: 'How to prepare for frontend developer interviews?', type: 'Topic', date: '2025-03-25T14:30:00Z' },
          { id: 2, title: 'Re: Best resources for learning React in 2025?', type: 'Reply', date: '2025-03-24T16:45:00Z' },
          { id: 3, title: 'Re: Portfolio feedback request - Junior Web Developer', type: 'Reply', date: '2025-03-22T09:15:00Z' }
        ],
        settings: {
          emailNotifications: true,
          darkMode: true,
          publicProfile: true
        }
      };
      
      setUserData(mockUserData);
      setEditedUserData(mockUserData);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Cancel edit mode
      setEditedUserData(userData);
    }
    setEditMode(!editMode);
  };

  const handleSaveProfile = () => {
    // In a real application, this would send the updated data to your API
    setUserData(editedUserData);
    setEditMode(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedUserData({
      ...editedUserData,
      [name]: value
    });
  };

  const handleSettingChange = (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUserData({
      ...editedUserData,
      settings: {
        ...editedUserData.settings,
        [setting]: event.target.checked
      }
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm="auto">
            <Avatar
              src={userData.avatar}
              alt={`${userData.firstName} ${userData.lastName}`}
              sx={{ width: 120, height: 120 }}
            />
          </Grid>
          <Grid item xs={12} sm>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Box>
                {editMode ? (
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      label="First Name"
                      name="firstName"
                      value={editedUserData.firstName}
                      onChange={handleInputChange}
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                    <TextField
                      label="Last Name"
                      name="lastName"
                      value={editedUserData.lastName}
                      onChange={handleInputChange}
                      variant="outlined"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  </Box>
                ) : (
                  <Typography variant="h4" component="h1" gutterBottom>
                    {userData.firstName} {userData.lastName}
                  </Typography>
                )}
                
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  @{userData.username} • Joined {new Date(userData.joinDate).toLocaleDateString()}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip 
                    icon={<WorkIcon />} 
                    label={`Career Goal: ${userData.careerGoal}`} 
                    color="primary" 
                    variant="outlined"
                    size="small"
                  />
                </Box>
                
                {editMode ? (
                  <TextField
                    label="Bio"
                    name="bio"
                    value={editedUserData.bio}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    fullWidth
                    multiline
                    rows={3}
                  />
                ) : (
                  <Typography variant="body1">
                    {userData.bio}
                  </Typography>
                )}
              </Box>
              
              <Box>
                {editMode ? (
                  <Box>
                    <IconButton color="primary" onClick={handleSaveProfile}>
                      <SaveIcon />
                    </IconButton>
                    <IconButton color="error" onClick={handleEditToggle}>
                      <CancelIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <IconButton color="primary" onClick={handleEditToggle}>
                    <EditIcon />
                  </IconButton>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<PersonIcon />} label="Profile" />
          <Tab icon={<SchoolIcon />} label="Skills & Learning" />
          <Tab icon={<AssignmentIcon />} label="Activity" />
          <Tab icon={<ForumIcon />} label="Community" />
          <Tab icon={<BookmarkIcon />} label="Saved Resources" />
          <Tab icon={<SettingsIcon />} label="Settings" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" component="h2" gutterBottom>
                  Personal Information
                </Typography>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Email" 
                          secondary={
                            editMode ? (
                              <TextField
                                name="email"
                                value={editedUserData.email}
                                onChange={handleInputChange}
                                variant="outlined"
                                size="small"
                                fullWidth
                                sx={{ mt: 1 }}
                              />
                            ) : userData.email
                          } 
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText 
                          primary="Location" 
                          secondary={
                            editMode ? (
                              <TextField
                                name="location"
                                value={editedUserData.location}
                                onChange={handleInputChange}
                                variant="outlined"
                                size="small"
                                fullWidth
                                sx={{ mt: 1 }}
                              />
                            ) : userData.location
                          } 
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" component="h2" gutterBottom>
                  Learning Preferences
                </Typography>
                <Card variant="outlined">
                  <CardContent>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Learning Style" 
                          secondary={userData.learningPreferences.learningStyle} 
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText 
                          primary="Pace Preference" 
                          secondary={userData.learningPreferences.pacePreference} 
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText 
                          primary="Preferred Resources" 
                          secondary={
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                              {userData.learningPreferences.preferredResources.map((resource: string, index: number) => (
                                <Chip key={index} label={resource} size="small" />
                              ))}
                            </Box>
                          } 
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" component="h2" gutterBottom>
              Skills
            </Typography>
            <Card variant="outlined" sx={{ mb: 4 }}>
              <CardContent>
                <Grid container spacing={2}>
                  {userData.skills.map((skill: any) => (
                    <Grid item xs={12} sm={6} key={skill.name}>
                      <Typography variant="body2" gutterBottom>
                        {skill.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={skill.level} 
                            sx={{ 
                              height: 8, 
                              borderRadius: 4,
                              backgroundColor: 'rgba(0, 0, 0, 0.1)',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 4
                              }
                            }}
                          />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2" color="textSecondary">
                            {skill.level}%
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2">
                Learning Plan Progress
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                size="small"
                onClick={() => navigate('/learning-plan')}
              >
                View Full Plan
              </Button>
            </Box>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Frontend Developer Learning Path
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={35} 
                      sx={{ 
                        height: 10, 
                        borderRadius: 5,
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5
                        }
                      }}
                    />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="textSecondary">
                      35%
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Current milestone: CSS Frameworks & Responsive Design
                </Typography>
                <Typography variant="caption" color="error">
                  Due in 14 days
                </Typography>
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" component="h2" gutterBottom>
              Recent Activity
            </Typography>
            <Card variant="outlined">
              <List>
                {userData.activity.map((activity: any, index: number) => (
                  <React.Fragment key={activity.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemIcon>
                        {activity.type === 'assessment' && <AssignmentIcon color="primary" />}
                        {activity.type === 'learning' && <SchoolIcon color="success" />}
                        {activity.type === 'forum' && <ForumIcon color="secondary" />}
                        {activity.type === 'resource' && <BookmarkIcon color="info" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.title}
                        secondary={new Date(activity.date).toLocaleString()}
                      />
                    </ListItem>
                    {index < userData.activity.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Card>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" component="h2" gutterBottom>
              Forum Activity
            </Typography>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <List>
                {userData.forumActivity.map((activity: any, index: number) => (
                  <React.Fragment key={activity.id}>
                    <ListItem 
                      alignItems="flex-start"
                      button
                      onClick={() => {/* Navigate to forum post in a real app */}}
                    >
                      <ListItemIcon>
                        <ForumIcon color={activity.type === 'Topic' ? 'primary' : 'action'} />
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.title}
                        secondary={`${activity.type} • ${new Date(activity.date).toLocaleString()}`}
                      />
                    </ListItem>
                    {index < userData.forumActivity.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Card>
            
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/community')}
              >
                Go to Community
              </Button>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <Typography variant="h6" component="h2" gutterBottom>
              Saved Resources
            </Typography>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <List>
                {userData.savedResources.map((resource: any, index: number) => (
                  <React.Fragment key={resource.id}>
                    <ListItem 
                      alignItems="flex-start"
                      button
                      onClick={() => {/* Navigate to resource in a real app */}}
                    >
                      <ListItemIcon>
                        <BookmarkIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={resource.title}
                        secondary={resource.type}
                      />
                    </ListItem>
                    {index < userData.savedResources.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Card>
            
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/resources')}
              >
                Explore More Resources
              </Button>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={5}>
            <Typography variant="h6" component="h2" gutterBottom>
              Account Settings
            </Typography>
            <Card variant="outlined">
              <CardContent>
                <List>
                  <ListItem>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editedUserData.settings.emailNotifications}
                          onChange={handleSettingChange('emailNotifications')}
                          color="primary"
                        />
                      }
                      label="Email Notifications"
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editedUserData.settings.darkMode}
                          onChange={handleSettingChange('darkMode')}
                          color="primary"
                        />
                      }
                      label="Dark Mode"
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editedUserData.settings.publicProfile}
                          onChange={handleSettingChange('publicProfile')}
                          color="primary"
                        />
                      }
                      label="Public Profile"
                    />
                  </ListItem>
                </List>
                
                {editMode && (
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSaveProfile}
                    >
                      Save Settings
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
