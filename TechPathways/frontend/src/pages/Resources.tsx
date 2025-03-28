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
  Chip,
  Rating,
  IconButton,
  CardMedia,
  CardActions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import SchoolIcon from '@mui/icons-material/School';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CodeIcon from '@mui/icons-material/Code';
import PeopleIcon from '@mui/icons-material/People';
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
      id={`resources-tabpanel-${index}`}
      aria-labelledby={`resources-tab-${index}`}
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

const Resources: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<any[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // In a real application, this would fetch resources from your API
    // For now, we'll simulate loading with a timeout and mock data
    const timer = setTimeout(() => {
      setResources([
        {
          id: 1,
          title: 'freeCodeCamp',
          description: 'Learn to code with free interactive tutorials covering HTML, CSS, JavaScript, and more.',
          type: 'Interactive Learning',
          url: 'https://www.freecodecamp.org',
          image: 'https://design-style-guide.freecodecamp.org/downloads/fcc_primary_large.jpg',
          rating: 4.8,
          cost: 'Free',
          learningStyle: 'Interactive',
          categories: ['Web Development', 'JavaScript', 'Frontend']
        },
        {
          id: 2,
          title: 'The Odin Project',
          description: 'A free, open-source curriculum for learning web development from scratch.',
          type: 'Curriculum',
          url: 'https://www.theodinproject.com',
          image: 'https://www.theodinproject.com/assets/og-logo-022832d4cefeec1d5266237be260192f5980f9bcbf1c9ca151b358f0ce1fd2df.png',
          rating: 4.7,
          cost: 'Free',
          learningStyle: 'Project-based',
          categories: ['Web Development', 'Full Stack', 'JavaScript']
        },
        {
          id: 3,
          title: 'Frontend Masters',
          description: 'Expert-led video courses on frontend development topics.',
          type: 'Video Courses',
          url: 'https://frontendmasters.com',
          image: 'https://static.frontendmasters.com/assets/fm/js/frontendmasters.0e71088726.svg',
          rating: 4.9,
          cost: 'Paid',
          learningStyle: 'Video',
          categories: ['Frontend', 'JavaScript', 'React']
        },
        {
          id: 4,
          title: 'Codecademy',
          description: 'Interactive coding lessons for various programming languages and technologies.',
          type: 'Interactive Learning',
          url: 'https://www.codecademy.com',
          image: 'https://www.codecademy.com/resources/blog/content/images/2021/08/blog-meta.png',
          rating: 4.5,
          cost: 'Freemium',
          learningStyle: 'Interactive',
          categories: ['Programming', 'Web Development', 'Data Science']
        },
        {
          id: 5,
          title: 'MDN Web Docs',
          description: 'Comprehensive documentation for web technologies including HTML, CSS, and JavaScript.',
          type: 'Documentation',
          url: 'https://developer.mozilla.org',
          image: 'https://developer.mozilla.org/mdn-social-share.cd6c4a5a.png',
          rating: 4.9,
          cost: 'Free',
          learningStyle: 'Reading',
          categories: ['Web Development', 'Reference', 'Documentation']
        },
        {
          id: 6,
          title: 'Coursera - Web Development Specialization',
          description: 'A series of courses covering full-stack web development from Johns Hopkins University.',
          type: 'Online Course',
          url: 'https://www.coursera.org/specializations/web-development',
          image: 'https://s3.amazonaws.com/coursera_assets/meta_images/generated/SPECIALIZATION_LOGO_2/SPECIALIZATION_LOGO_2~SPECIALIZATION%2FLOGO_JOSXPYQEEI8L/SPECIALIZATION_LOGO_2~SPECIALIZATION%2FLOGO_JOSXPYQEEI8L.jpeg',
          rating: 4.6,
          cost: 'Paid (Financial aid available)',
          learningStyle: 'Video + Projects',
          categories: ['Web Development', 'Full Stack', 'Academic']
        },
        {
          id: 7,
          title: 'Udemy - React - The Complete Guide',
          description: 'Comprehensive course on React, Redux, React Hooks, and more.',
          type: 'Video Course',
          url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
          image: 'https://img-c.udemycdn.com/course/750x422/1362070_b9a1_2.jpg',
          rating: 4.7,
          cost: 'Paid',
          learningStyle: 'Video',
          categories: ['React', 'Frontend', 'JavaScript']
        },
        {
          id: 8,
          title: 'GitHub Learning Lab',
          description: 'Interactive courses on GitHub that teach Git, GitHub, and development workflows.',
          type: 'Interactive Learning',
          url: 'https://lab.github.com',
          image: 'https://github.githubassets.com/images/modules/open_graph/github-mark.png',
          rating: 4.5,
          cost: 'Free',
          learningStyle: 'Interactive',
          categories: ['Git', 'Version Control', 'Collaboration']
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

  const [savedResources, setSavedResources] = useState<number[]>([]);

  const handleToggleSave = (resourceId: number) => {
    if (savedResources.includes(resourceId)) {
      setSavedResources(savedResources.filter(id => id !== resourceId));
    } else {
      setSavedResources([...savedResources, resourceId]);
    }
  };

  const filterResources = () => {
    if (!searchQuery) return resources;
    
    return resources.filter(resource => 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.categories.some((category: string) => 
        category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const getResourcesByType = (type: string) => {
    return filterResources().filter(resource => resource.type === type);
  };

  const getResourcesByCategory = (category: string) => {
    return filterResources().filter(resource => 
      resource.categories.includes(category)
    );
  };

  const getSavedResourcesData = () => {
    return resources.filter(resource => savedResources.includes(resource.id));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const renderResourceCard = (resource: any) => (
    <Grid item xs={12} sm={6} md={4} key={resource.id}>
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)'
          }
        }}
      >
        <CardMedia
          component="img"
          height="140"
          image={resource.image}
          alt={resource.title}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {resource.title}
            </Typography>
            <IconButton 
              size="small" 
              onClick={() => handleToggleSave(resource.id)}
              color="primary"
            >
              {savedResources.includes(resource.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          </Box>
          <Typography variant="body2" color="textSecondary" paragraph>
            {resource.description}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={resource.rating} precision={0.1} readOnly size="small" />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {resource.rating}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            <Chip label={resource.type} size="small" color="primary" variant="outlined" />
            <Chip label={resource.cost} size="small" color="secondary" variant="outlined" />
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {resource.categories.slice(0, 2).map((category: string, index: number) => (
              <Chip key={index} label={category} size="small" />
            ))}
            {resource.categories.length > 2 && (
              <Chip label={`+${resource.categories.length - 2}`} size="small" variant="outlined" />
            )}
          </Box>
        </CardContent>
        <CardActions>
          <Button 
            size="small" 
            color="primary" 
            href={resource.url} 
            target="_blank" 
            rel="noopener noreferrer"
            fullWidth
          >
            Visit Resource
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Learning Resources
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Discover curated learning resources to help you on your tech career journey.
      </Typography>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <TextField
          fullWidth
          placeholder="Search resources by title, description, or category..."
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <FilterListIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <Paper sx={{ borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<SchoolIcon />} label="All Resources" />
          <Tab icon={<VideoLibraryIcon />} label="Courses" />
          <Tab icon={<MenuBookIcon />} label="Documentation" />
          <Tab icon={<CodeIcon />} label="Interactive" />
          <Tab icon={<PeopleIcon />} label="Communities" />
          <Tab icon={<BookmarkIcon />} label="Saved" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              {filterResources().map(resource => renderResourceCard(resource))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              {getResourcesByType('Video Course').concat(getResourcesByType('Online Course')).map(resource => renderResourceCard(resource))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              {getResourcesByType('Documentation').map(resource => renderResourceCard(resource))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={3}>
              {getResourcesByType('Interactive Learning').map(resource => renderResourceCard(resource))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <Grid container spacing={3}>
              {getResourcesByCategory('Community').map(resource => renderResourceCard(resource))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={5}>
            {savedResources.length > 0 ? (
              <Grid container spacing={3}>
                {getSavedResourcesData().map(resource => renderResourceCard(resource))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No saved resources yet
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Click the bookmark icon on any resource to save it for later.
                </Typography>
              </Box>
            )}
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
};

export default Resources;
