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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useParams, useNavigate } from 'react-router-dom';

const LearningPlan: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [loading, setLoading] = useState(true);
  const [learningPlan, setLearningPlan] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // In a real application, this would fetch the learning plan from your API
    // For now, we'll simulate loading with a timeout and mock data
    const timer = setTimeout(() => {
      setLearningPlan({
        id: id || '1',
        title: '1-Year Frontend Developer Learning Path',
        description: 'A comprehensive learning plan to help you become a Frontend Developer within one year.',
        careerPath: 'Frontend Developer',
        progress: 35,
        milestones: [
          {
            id: 1,
            title: 'Web Development Fundamentals',
            description: 'Learn the core technologies of the web: HTML, CSS, and JavaScript.',
            dueDate: '2025-05-15',
            completed: true,
            orderIndex: 1,
            tasks: [
              { id: 1, title: 'Learn HTML basics', description: 'Understand HTML structure, elements, and semantic markup.', completed: true },
              { id: 2, title: 'Learn CSS basics', description: 'Understand CSS selectors, properties, and layout techniques.', completed: true },
              { id: 3, title: 'Learn JavaScript basics', description: 'Understand variables, data types, functions, and control flow.', completed: true },
              { id: 4, title: 'Build a simple static website', description: 'Apply your HTML and CSS knowledge to create a personal portfolio.', completed: true }
            ]
          },
          {
            id: 2,
            title: 'CSS Frameworks & Responsive Design',
            description: 'Learn how to create responsive websites that work well on all devices.',
            dueDate: '2025-07-15',
            completed: false,
            orderIndex: 2,
            tasks: [
              { id: 5, title: 'Learn responsive design principles', description: 'Understand media queries, flexible grids, and responsive images.', completed: true },
              { id: 6, title: 'Learn a CSS framework (Bootstrap or Tailwind)', description: 'Understand how to use a CSS framework to speed up development.', completed: false },
              { id: 7, title: 'Build a responsive website', description: 'Apply your knowledge to create a responsive website that works on mobile and desktop.', completed: false },
              { id: 8, title: 'Optimize for performance', description: 'Learn techniques to improve website loading speed and performance.', completed: false }
            ]
          },
          {
            id: 3,
            title: 'JavaScript & DOM Manipulation',
            description: 'Deepen your JavaScript knowledge and learn how to manipulate the DOM.',
            dueDate: '2025-09-15',
            completed: false,
            orderIndex: 3,
            tasks: [
              { id: 9, title: 'Advanced JavaScript concepts', description: 'Learn about closures, promises, async/await, and ES6+ features.', completed: false },
              { id: 10, title: 'DOM manipulation', description: 'Understand how to select, modify, and create HTML elements with JavaScript.', completed: false },
              { id: 11, title: 'Event handling', description: 'Learn how to handle user interactions and events.', completed: false },
              { id: 12, title: 'Build an interactive web application', description: 'Apply your knowledge to create a simple interactive application.', completed: false }
            ]
          },
          {
            id: 4,
            title: 'Frontend Frameworks',
            description: 'Learn a modern JavaScript framework like React, Vue, or Angular.',
            dueDate: '2025-11-15',
            completed: false,
            orderIndex: 4,
            tasks: [
              { id: 13, title: 'Learn React fundamentals', description: 'Understand components, props, state, and the React lifecycle.', completed: false },
              { id: 14, title: 'State management', description: 'Learn about state management solutions like Redux or Context API.', completed: false },
              { id: 15, title: 'Routing and navigation', description: 'Understand how to implement navigation in a single-page application.', completed: false },
              { id: 16, title: 'Build a React application', description: 'Apply your knowledge to create a more complex React application.', completed: false }
            ]
          },
          {
            id: 5,
            title: 'Professional Development & Job Readiness',
            description: 'Prepare for the job market and develop professional skills.',
            dueDate: '2026-01-15',
            completed: false,
            orderIndex: 5,
            tasks: [
              { id: 17, title: 'Build a portfolio website', description: 'Create a professional portfolio to showcase your projects.', completed: false },
              { id: 18, title: 'Prepare for technical interviews', description: 'Practice common frontend interview questions and coding challenges.', completed: false },
              { id: 19, title: 'Create a resume/CV', description: 'Develop a professional resume highlighting your skills and projects.', completed: false },
              { id: 20, title: 'Network with professionals', description: 'Join communities, attend meetups, and connect with professionals in the field.', completed: false }
            ]
          }
        ],
        resources: [
          { id: 1, title: 'MDN Web Docs', url: 'https://developer.mozilla.org', type: 'Documentation' },
          { id: 2, title: 'freeCodeCamp', url: 'https://www.freecodecamp.org', type: 'Interactive Learning' },
          { id: 3, title: 'Frontend Masters', url: 'https://frontendmasters.com', type: 'Video Courses' },
          { id: 4, title: 'CSS-Tricks', url: 'https://css-tricks.com', type: 'Blog/Tutorials' },
          { id: 5, title: 'React Documentation', url: 'https://reactjs.org', type: 'Documentation' }
        ]
      });
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [id]);

  const handleTaskToggle = (taskId: number) => {
    // In a real application, this would update the task status in your API
    setLearningPlan((prevPlan: any) => {
      const updatedMilestones = prevPlan.milestones.map((milestone: any) => {
        const updatedTasks = milestone.tasks.map((task: any) => {
          if (task.id === taskId) {
            return { ...task, completed: !task.completed };
          }
          return task;
        });
        
        // Check if all tasks are completed to update milestone status
        const allTasksCompleted = updatedTasks.every((task: any) => task.completed);
        
        return {
          ...milestone,
          tasks: updatedTasks,
          completed: allTasksCompleted
        };
      });
      
      // Calculate new overall progress
      const totalTasks = updatedMilestones.reduce((total: number, milestone: any) => 
        total + milestone.tasks.length, 0);
      const completedTasks = updatedMilestones.reduce((total: number, milestone: any) => 
        total + milestone.tasks.filter((task: any) => task.completed).length, 0);
      const newProgress = Math.round((completedTasks / totalTasks) * 100);
      
      return {
        ...prevPlan,
        milestones: updatedMilestones,
        progress: newProgress
      };
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
      <Typography variant="h4" component="h1" gutterBottom>
        {learningPlan.title}
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        {learningPlan.description}
      </Typography>

      <Grid container spacing={4}>
        {/* Learning Plan Progress */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress 
                  variant="determinate" 
                  value={learningPlan.progress} 
                  size={80}
                  thickness={5}
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
                  <Typography variant="h6" component="div" color="text.secondary" fontWeight="bold">
                    {`${learningPlan.progress}%`}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Overall Progress
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Career Path: {learningPlan.careerPath}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Chip 
                    icon={<SchoolIcon />} 
                    label={`${learningPlan.milestones.filter((m: any) => m.completed).length}/${learningPlan.milestones.length} Milestones Completed`} 
                    color="primary" 
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Milestones Timeline */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Learning Path Milestones
            </Typography>
            <Stepper orientation="vertical" sx={{ mt: 3 }}>
              {learningPlan.milestones.map((milestone: any) => (
                <Step key={milestone.id} active={!milestone.completed} completed={milestone.completed}>
                  <StepLabel
                    StepIconProps={{
                      icon: milestone.completed ? <CheckCircleIcon color="success" /> : milestone.orderIndex,
                    }}
                  >
                    <Typography variant="h6">{milestone.title}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Due: {new Date(milestone.dueDate).toLocaleDateString()}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" paragraph>
                      {milestone.description}
                    </Typography>
                    <List dense>
                      {milestone.tasks.map((task: any) => (
                        <ListItem key={task.id} disablePadding>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={task.completed}
                                onChange={() => handleTaskToggle(task.id)}
                                color="primary"
                              />
                            }
                            label={
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    textDecoration: task.completed ? 'line-through' : 'none',
                                    color: task.completed ? 'text.secondary' : 'text.primary',
                                  }}
                                >
                                  {task.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {task.description}
                                </Typography>
                              </Box>
                            }
                            sx={{ my: 0.5 }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>

        {/* Resources Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Recommended Resources
            </Typography>
            <List>
              {learningPlan.resources.map((resource: any) => (
                <ListItem key={resource.id} disablePadding sx={{ mb: 1 }}>
                  <Card variant="outlined" sx={{ width: '100%' }}>
                    <CardContent sx={{ pb: '16px !important' }}>
                      <Typography variant="subtitle1" component="div">
                        {resource.title}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" gutterBottom>
                        {resource.type}
                      </Typography>
                      <Button
                        variant="text"
                        color="primary"
                        size="small"
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ mt: 1, p: 0 }}
                      >
                        Visit Resource
                      </Button>
                    </CardContent>
                  </Card>
                </ListItem>
              ))}
            </List>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate('/resources')}
            >
              Explore More Resources
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LearningPlan;
