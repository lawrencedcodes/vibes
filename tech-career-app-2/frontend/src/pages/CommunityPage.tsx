import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  Paper, 
  Divider,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
  TextField,
  IconButton
} from '@mui/material';
import { 
  Forum as ForumIcon, 
  QuestionAnswer as QAIcon, 
  EmojiEvents as SuccessIcon, 
  People as PeerSupportIcon,
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
  Visibility as VisibilityIcon,
  PushPin as PinIcon
} from '@mui/icons-material';

// Mock data - would be replaced with API calls
const mockCategories = [
  { id: 1, name: 'Web Development', description: 'Discuss HTML, CSS, JavaScript, and web frameworks', displayOrder: 1 },
  { id: 2, name: 'Data Science', description: 'Topics related to data analysis, machine learning, and AI', displayOrder: 2 },
  { id: 3, name: 'Cybersecurity', description: 'Security concepts, tools, and career paths', displayOrder: 3 },
  { id: 4, name: 'Career Advice', description: 'General career guidance, interview tips, and job searching', displayOrder: 4 },
];

const mockTopics = [
  { 
    id: 1, 
    title: 'How to start learning React?', 
    content: 'I want to learn React but not sure where to begin. Any recommendations?',
    categoryId: 1,
    author: { id: 1, username: 'newdeveloper' },
    isPinned: true,
    isLocked: false,
    viewCount: 120,
    replyCount: 5,
    createdAt: '2025-03-20T10:00:00Z',
    lastActivityAt: '2025-03-25T15:30:00Z'
  },
  { 
    id: 2, 
    title: 'Best resources for Python data analysis?', 
    content: 'Looking for recommendations on books, courses, or tutorials for data analysis with Python.',
    categoryId: 2,
    author: { id: 2, username: 'dataenthusiast' },
    isPinned: false,
    isLocked: false,
    viewCount: 85,
    replyCount: 3,
    createdAt: '2025-03-22T14:20:00Z',
    lastActivityAt: '2025-03-24T09:15:00Z'
  },
];

const mockQASessions = [
  {
    id: 1,
    title: 'Breaking into Tech as a Career Changer',
    description: 'Join this Q&A session to learn about transitioning into tech from a non-technical background.',
    expert: { id: 3, username: 'careercoach', name: 'Alex Johnson' },
    scheduledDate: '2025-04-15T18:00:00Z',
    duration: 60,
    maxParticipants: 20,
    currentParticipants: 12
  },
  {
    id: 2,
    title: 'Frontend Development Best Practices',
    description: 'Learn about modern frontend development practices, tools, and career opportunities.',
    expert: { id: 4, username: 'seniordev', name: 'Maria Garcia' },
    scheduledDate: '2025-04-10T17:00:00Z',
    duration: 90,
    maxParticipants: 30,
    currentParticipants: 25
  }
];

const mockSuccessStories = [
  {
    id: 1,
    title: 'From Teacher to Software Engineer in 12 Months',
    author: { id: 5, username: 'formereducator', name: 'Jamie Smith' },
    content: 'After 8 years as a high school teacher, I decided to make a career change...',
    previousRole: 'High School Teacher',
    currentRole: 'Junior Software Engineer',
    company: 'TechCorp Inc.',
    keyLessons: 'Consistency in learning, building projects, networking',
    isFeatured: true,
    likeCount: 45
  },
  {
    id: 2,
    title: 'My Journey from Retail to Data Analysis',
    author: { id: 6, username: 'datadriven', name: 'Taylor Wong' },
    content: 'I spent 5 years working in retail management before discovering my passion for data...',
    previousRole: 'Retail Manager',
    currentRole: 'Data Analyst',
    company: 'Analytics Partners',
    keyLessons: 'Transferable skills matter, SQL is essential, find a mentor',
    isFeatured: true,
    likeCount: 38
  }
];

function CommunityPage() {
  const [tabValue, setTabValue] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSelectedCategory(null);
  };
  
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const renderForumSection = () => {
    if (!selectedCategory) {
      return (
        <Box>
          <Typography variant="h5" gutterBottom>
            Discussion Categories
          </Typography>
          <Grid container spacing={3}>
            {mockCategories.map(category => (
              <Grid item xs={12} md={6} key={category.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 6
                    }
                  }}
                  onClick={() => handleCategorySelect(category)}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div">
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    } else {
      return (
        <Box>
          <Box display="flex" alignItems="center" mb={3}>
            <Button variant="outlined" onClick={() => setSelectedCategory(null)} sx={{ mr: 2 }}>
              Back to Categories
            </Button>
            <Typography variant="h5">
              {selectedCategory.name}
            </Typography>
          </Box>
          
          <Box mb={3}>
            <Button variant="contained" color="primary">
              Create New Topic
            </Button>
          </Box>
          
          {mockTopics
            .filter(topic => topic.categoryId === selectedCategory.id)
            .map(topic => (
              <Paper 
                key={topic.id} 
                sx={{ 
                  p: 2, 
                  mb: 2,
                  border: topic.isPinned ? '1px solid #f57c00' : 'none',
                  position: 'relative'
                }}
              >
                {topic.isPinned && (
                  <PinIcon 
                    color="warning" 
                    sx={{ 
                      position: 'absolute', 
                      top: 10, 
                      right: 10 
                    }} 
                  />
                )}
                <Typography variant="h6" component="div">
                  {topic.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Posted by {topic.author.username} on {formatDate(topic.createdAt)}
                </Typography>
                <Typography variant="body1" paragraph>
                  {topic.content.length > 150 
                    ? `${topic.content.substring(0, 150)}...` 
                    : topic.content}
                </Typography>
                <Box display="flex" alignItems="center">
                  <Chip 
                    icon={<VisibilityIcon fontSize="small" />} 
                    label={topic.viewCount} 
                    size="small" 
                    sx={{ mr: 1 }} 
                  />
                  <Chip 
                    icon={<CommentIcon fontSize="small" />} 
                    label={topic.replyCount} 
                    size="small" 
                    sx={{ mr: 1 }} 
                  />
                  <Box flexGrow={1} />
                  <Button variant="outlined" size="small">
                    View Discussion
                  </Button>
                </Box>
              </Paper>
            ))}
        </Box>
      );
    }
  };
  
  const renderQASection = () => {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Upcoming Expert Q&A Sessions
        </Typography>
        <Grid container spacing={3}>
          {mockQASessions.map(session => (
            <Grid item xs={12} md={6} key={session.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {session.title}
                  </Typography>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>
                      {session.expert.name.charAt(0)}
                    </Avatar>
                    <Typography variant="subtitle1">
                      {session.expert.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    {session.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>When:</strong> {formatDate(session.scheduledDate)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Duration:</strong> {session.duration} minutes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Spots:</strong> {session.currentParticipants}/{session.maxParticipants}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    variant="contained" 
                    fullWidth
                    disabled={session.currentParticipants >= session.maxParticipants}
                  >
                    {session.currentParticipants >= session.maxParticipants 
                      ? 'Session Full' 
                      : 'Register'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Request a Q&A Topic
          </Typography>
          <Paper sx={{ p: 3 }}>
            <TextField
              label="What topic would you like to see covered?"
              fullWidth
              multiline
              rows={3}
              margin="normal"
            />
            <Button variant="contained" sx={{ mt: 2 }}>
              Submit Request
            </Button>
          </Paper>
        </Box>
      </Box>
    );
  };
  
  const renderSuccessStoriesSection = () => {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Success Stories
        </Typography>
        <Typography variant="subtitle1" paragraph>
          Real stories from people who successfully transitioned into tech careers
        </Typography>
        
        <Grid container spacing={3}>
          {mockSuccessStories.map(story => (
            <Grid item xs={12} key={story.id}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box display="flex" alignItems="flex-start">
                  <Avatar 
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      mr: 2,
                      bgcolor: 'secondary.main'
                    }}
                  >
                    {story.author.name.charAt(0)}
                  </Avatar>
                  <Box flexGrow={1}>
                    <Typography variant="h6" gutterBottom>
                      {story.title}
                      {story.isFeatured && (
                        <Chip 
                          label="Featured" 
                          size="small" 
                          color="secondary" 
                          sx={{ ml: 1 }} 
                        />
                      )}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                      {story.author.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>From:</strong> {story.previousRole} <strong>To:</strong> {story.currentRole} at {story.company}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body1" paragraph>
                      {story.content.length > 200 
                        ? `${story.content.substring(0, 200)}...` 
                        : story.content}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                      Key Lessons:
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {story.keyLessons}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <IconButton color="primary" size="small">
                        <FavoriteIcon fontSize="small" />
                      </IconButton>
                      <Typography variant="body2" sx={{ mr: 2 }}>
                        {story.likeCount}
                      </Typography>
                      <Button variant="outlined" size="small">
                        Read Full Story
                      </Button>
                      <Box flexGrow={1} />
                      <Button variant="text" size="small" color="primary">
                        Share Your Story
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };
  
  const renderPeerSupportSection = () => {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Peer Support Network
        </Typography>
        <Typography variant="subtitle1" paragraph>
          Connect with peers for mentorship, advice, and support
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Find Support
              </Typography>
              <Typography variant="body2" paragraph>
                Connect with peers who can help you with specific challenges in your tech journey.
              </Typography>
              <TextField
                select
                label="Support Area"
                fullWidth
                margin="normal"
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">Select an area</option>
                <option value="coding">Coding Help</option>
                <option value="career">Career Advice</option>
                <option value="interview">Interview Preparation</option>
                <option value="portfolio">Portfolio Review</option>
                <option value="resume">Resume Feedback</option>
              </TextField>
              <TextField
                label="Describe what you need help with"
                fullWidth
                multiline
                rows={4}
                margin="normal"
              />
              <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                Request Support
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Offer Support
              </Typography>
              <Typography variant="body2" paragraph>
                Share your knowledge and experience to help others on their tech jo<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>