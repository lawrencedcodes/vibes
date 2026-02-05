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
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Avatar,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ForumIcon from '@mui/icons-material/Forum';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
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
      id={`community-tabpanel-${index}`}
      aria-labelledby={`community-tab-${index}`}
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

const Community: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState<any[]>([]);
  const [successStories, setSuccessStories] = useState<any[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [openNewTopicDialog, setOpenNewTopicDialog] = useState(false);
  const navigate = useNavigate();

  // Form state for new topic
  const [newTopic, setNewTopic] = useState({
    title: '',
    content: '',
    category: ''
  });

  useEffect(() => {
    // In a real application, this would fetch data from your API
    // For now, we'll simulate loading with a timeout and mock data
    const timer = setTimeout(() => {
      setTopics([
        {
          id: 1,
          title: 'How to prepare for frontend developer interviews?',
          content: 'I have an interview coming up for a junior frontend developer position. What kind of questions should I expect and how should I prepare?',
          user: {
            id: 1,
            name: 'Alex Johnson',
            avatar: 'https://i.pravatar.cc/150?img=1'
          },
          category: 'Career Advice',
          createdAt: '2025-03-25T14:30:00Z',
          updatedAt: '2025-03-27T09:15:00Z',
          replies: 8,
          likes: 12
        },
        {
          id: 2,
          title: 'Best resources for learning React in 2025?',
          content: 'I\'m looking for up-to-date resources to learn React. What courses, books, or tutorials would you recommend for someone with basic JavaScript knowledge?',
          user: {
            id: 2,
            name: 'Sarah Miller',
            avatar: 'https://i.pravatar.cc/150?img=5'
          },
          category: 'Learning Resources',
          createdAt: '2025-03-24T10:45:00Z',
          updatedAt: '2025-03-27T16:20:00Z',
          replies: 15,
          likes: 24
        },
        {
          id: 3,
          title: 'How to balance learning and working full-time?',
          content: 'I\'m currently working a full-time job and trying to transition into tech. How do you manage your time effectively to learn new skills while working?',
          user: {
            id: 3,
            name: 'Michael Chen',
            avatar: 'https://i.pravatar.cc/150?img=3'
          },
          category: 'Learning Strategies',
          createdAt: '2025-03-23T08:15:00Z',
          updatedAt: '2025-03-26T12:30:00Z',
          replies: 12,
          likes: 18
        },
        {
          id: 4,
          title: 'Portfolio feedback request - Junior Web Developer',
          content: 'I\'ve just completed my portfolio website and would appreciate some feedback before I start applying for jobs. Here\'s the link: [portfolio URL]',
          user: {
            id: 4,
            name: 'Emily Rodriguez',
            avatar: 'https://i.pravatar.cc/150?img=9'
          },
          category: 'Portfolio Review',
          createdAt: '2025-03-22T16:20:00Z',
          updatedAt: '2025-03-25T14:10:00Z',
          replies: 6,
          likes: 9
        },
        {
          id: 5,
          title: 'Imposter syndrome as a self-taught developer',
          content: 'I\'m about to start my first tech job after learning on my own for a year. I\'m feeling major imposter syndrome. Has anyone else experienced this and how did you overcome it?',
          user: {
            id: 5,
            name: 'David Kim',
            avatar: 'https://i.pravatar.cc/150?img=4'
          },
          category: 'Mental Health',
          createdAt: '2025-03-21T11:30:00Z',
          updatedAt: '2025-03-24T09:45:00Z',
          replies: 22,
          likes: 35
        }
      ]);
      
      setSuccessStories([
        {
          id: 1,
          title: 'From Teacher to Frontend Developer in 10 Months',
          content: 'After 8 years as an elementary school teacher, I decided to make a career change. I started learning web development through Tech Pathways, and within 10 months I landed my first job as a junior frontend developer. The structured learning plan and community support made all the difference.',
          user: {
            id: 6,
            name: 'Jessica Taylor',
            avatar: 'https://i.pravatar.cc/150?img=6',
            previousRole: 'Elementary School Teacher',
            currentRole: 'Frontend Developer at TechCorp'
          },
          careerPath: 'Frontend Developer',
          createdAt: '2025-03-20T15:45:00Z',
          likes: 48
        },
        {
          id: 2,
          title: 'How I Became a Data Analyst with No Prior Experience',
          content: 'I was working in retail management when I discovered my passion for data. I took the Tech Pathways assessment and was surprised to see Data Analyst as my top match. I followed the learning plan, built projects, and after 14 months of consistent study, I got hired as a junior data analyst. Now I\'m helping my company make data-driven decisions!',
          user: {
            id: 7,
            name: 'Robert Wilson',
            avatar: 'https://i.pravatar.cc/150?img=7',
            previousRole: 'Retail Manager',
            currentRole: 'Data Analyst at DataInsights'
          },
          careerPath: 'Data Analyst',
          createdAt: '2025-03-18T09:30:00Z',
          likes: 36
        },
        {
          id: 3,
          title: 'My Journey from Graphic Designer to UX/UI Designer',
          content: 'As a graphic designer, I always enjoyed the digital aspects of my work. When I discovered UX/UI design, I knew it was the perfect transition. Tech Pathways helped me identify the skills I already had and what I needed to learn. The personalized learning path helped me focus on the right skills and build a portfolio that got me hired. I couldn\'t have done it without this community!',
          user: {
            id: 8,
            name: 'Priya Patel',
            avatar: 'https://i.pravatar.cc/150?img=8',
            previousRole: 'Graphic Designer',
            currentRole: 'UX/UI Designer at DesignHub'
          },
          careerPath: 'UX Designer',
          createdAt: '2025-03-15T14:20:00Z',
          likes: 42
        }
      ]);
      
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenNewTopicDialog = () => {
    setOpenNewTopicDialog(true);
  };

  const handleCloseNewTopicDialog = () => {
    setOpenNewTopicDialog(false);
  };

  const handleNewTopicChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    setNewTopic({
      ...newTopic,
      [name as string]: value
    });
  };

  const handleSubmitNewTopic = () => {
    // In a real application, this would send the new topic to your API
    // For now, we'll just add it to the local state
    const newTopicData = {
      id: topics.length + 1,
      title: newTopic.title,
      content: newTopic.content,
      user: {
        id: 1,
        name: 'Alex Johnson',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      category: newTopic.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replies: 0,
      likes: 0
    };
    
    setTopics([newTopicData, ...topics]);
    setNewTopic({ title: '', content: '', category: '' });
    handleCloseNewTopicDialog();
  };

  const filterTopics = () => {
    if (!searchQuery) return topics;
    
    return topics.filter(topic => 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filterSuccessStories = () => {
    if (!searchQuery) return successStories;
    
    return successStories.filter(story => 
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.careerPath.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
      <Typography variant="h4" component="h1" gutterBottom>
        Community
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Connect with peers, share experiences, and learn from others on similar career paths.
      </Typography>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <TextField
              fullWidth
              placeholder="Search topics, success stories, or users..."
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenNewTopicDialog}
            >
              New Topic
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<ForumIcon />} label="Discussion Forum" />
          <Tab icon={<PeopleIcon />} label="Success Stories" />
          <Tab icon={<QuestionAnswerIcon />} label="Q&A Sessions" />
        </Tabs>

        <Box>
          <TabPanel value={tabValue} index={0}>
            <List>
              {filterTopics().map((topic, index) => (
                <React.Fragment key={topic.id}>
                  <ListItem 
                    alignItems="flex-start" 
                    sx={{ 
                      py: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                    onClick={() => {/* Navigate to topic detail in a real app */}}
                  >
                    <Grid container spacing={2}>
                      <Grid item>
                        <Avatar src={topic.user.avatar} alt={topic.user.name} />
                      </Grid>
                      <Grid item xs>
                        <Typography variant="h6" component="h3">
                          {topic.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" paragraph>
                          {topic.content.length > 150 
                            ? `${topic.content.substring(0, 150)}...` 
                            : topic.content}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                          <Chip 
                            label={topic.category} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                          <Typography variant="caption" color="textSecondary">
                            Posted by {topic.user.name} • {new Date(topic.createdAt).toLocaleDateString()}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                              <CommentIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                              <Typography variant="body2" color="textSecondary">
                                {topic.replies}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <ThumbUpIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                              <Typography variant="body2" color="textSecondary">
                                {topic.likes}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </ListItem>
                  {index < filterTopics().length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              {filterSuccessStories().map((story) => (
                <Grid item xs={12} key={story.id}>
                  <Card sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar 
                          src={story.user.avatar} 
                          alt={story.user.name}
                          sx={{ width: 56, height: 56, mr: 2 }}
                        />
                        <Box>
                          <Typography variant="h6" component="h3">
                            {story.user.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {story.user.previousRole} → {story.user.currentRole}
                          </Typography>
                        </Box>
                        <Chip 
                          label={story.careerPath} 
                          color="primary" 
                          sx={{ ml: 'auto' }} 
                        />
                      </Box>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {story.title}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {story.content}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="textSecondary">
                          Posted on {new Date(story.createdAt).toLocaleDateString()}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ThumbUpIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                          <Typography variant="body2" color="primary">
                            {story.likes}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom>
                Upcoming Q&A Sessions
              </Typography>
              <Typography variant="body1" paragraph>
                Join live Q&A sessions with industry professionals to get your questions answered.
              </Typography>
              <Card sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    Frontend Development Career Path Q&A
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Join senior frontend developers from top tech companies as they answer your questions about breaking into the field.
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Date: April 15, 2025 • Time: 7:00 PM EST
                  </Typography>
                  <Button variant="contained" color="primary">
                    Register
                  </Button>
                </CardContent>
              </Card>
              <Card sx={{ maxWidth: 600, mx: 'auto' }}>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    Data Science Career Transition
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Learn from professionals who successfully transitioned from other fields into data science roles.
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Date: April 22, 2025 • Time: 6:30 PM EST
                  </Typography>
                  <Button variant="contained" color="primary">
                    Register
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </TabPanel>
        </Box>
      </Paper>

      {/* New Topic Dialog */}
      <Dialog open={openNewTopicDialog} onClose={handleCloseNewTopicDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Topic</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Topic Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newTopic.title}
            onChange={handleNewTopicChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={newTopic.category}
              label="Category"
              onChange={handleNewTopicChange}
            >
              <MenuItem value="Career Advice">Career Advice</MenuItem>
              <MenuItem value="Learning Resources">Learning Resources</MenuItem>
              <MenuItem value="Learning Strategies">Learning Strategies</MenuItem>
              <MenuItem value="Portfolio Review">Portfolio Review</MenuItem>
              <MenuItem value="Technical Questions">Technical Questions</MenuItem>
              <MenuItem value="Job Hunting">Job Hunting</MenuItem>
              <MenuItem value="Mental Health">Mental Health</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="content"
            label="Content"
            multiline
            rows={6}
            fullWidth
            variant="outlined"
            value={newTopic.content}
            onChange={handleNewTopicChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewTopicDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmitNewTopic} 
            variant="contained" 
            color="primary"
            disabled={!newTopic.title || !newTopic.content || !newTopic.category}
          >
            Post Topic
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Community;
