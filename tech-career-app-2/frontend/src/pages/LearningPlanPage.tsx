import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  LinearProgress,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ReactMarkdown from 'react-markdown';

const LearningPlanPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [learningPlan, setLearningPlan] = useState(null);
  const [progress, setProgress] = useState({
    overallProgressPercentage: 0,
    completedMilestones: 0,
    totalMilestones: 12,
    onTrack: true,
    timeProgressPercentage: 25
  });

  // Mock data - in a real app, this would come from the API
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const mockLearningPlan = {
        id: 1,
        title: "1-Year Career Path: Frontend Developer",
        description: "This personalized 1-year learning plan is designed to help you become a Frontend Developer. The plan is tailored to your current skills, learning style, and available resources. It includes a structured progression of learning activities, projects, and resources organized into weekly and monthly milestones. By following this plan, you'll develop the technical skills, portfolio projects, and professional network needed to successfully transition into this role.",
        startDate: "2025-03-26",
        endDate: "2026-03-26",
        milestones: [
          {
            id: 1,
            title: "Month 1: Orientation and Fundamentals",
            description: "Get oriented with the field and start building fundamental skills.",
            startDate: "2025-03-26",
            endDate: "2025-04-26",
            type: "MONTHLY",
            status: "IN_PROGRESS",
            progressPercentage: 60,
            content: `## Week 1-2: Introduction and Setup\n\n- Research and understand the Frontend Developer role\n- Set up your development environment\n- Begin learning the basics of HTML and CSS\n- Join online communities related to your field\n\n## Week 3-4: Building Core Knowledge\n\n- Continue learning HTML and CSS\n- Start exploring JavaScript\n- Complete your first small project combining these skills\n- Begin building a study routine that fits your schedule\n\n## Recommended Learning Resources:\n\n- Complete 1-2 courses on fundamental skills\n- Spend 3-5 hours per week on hands-on practice\n- Join at least 2 online communities or forums in your field`
          },
          {
            id: 2,
            title: "Month 2: Skill Building",
            description: "Focus on building core technical skills required for your role.",
            startDate: "2025-04-26",
            endDate: "2025-05-26",
            type: "MONTHLY",
            status: "NOT_STARTED",
            progressPercentage: 0,
            content: `## Week 5-6: Deepening Technical Skills\n\n- Continue practicing HTML and CSS\n- Expand knowledge of JavaScript\n- Start working on more complex exercises\n- Begin a medium-sized project that combines multiple skills\n- Start documenting your learning journey\n\n## Week 7-8: Practical Application\n\n- Complete your medium-sized project\n- Get feedback on your project from peers or mentors\n- Begin exploring how these skills are applied in real-world scenarios\n- Start following industry blogs and news sources\n\n## Recommended Learning Resources:\n\n- Complete 1-2 intermediate courses or tutorials\n- Spend 5-7 hours on project work\n- Find and follow 5 industry experts on social media`
          },
          // Additional milestones would be here
        ],
        recommendedResources: [
          {
            id: 1,
            title: "Getting Started with Frontend Development",
            description: "A comprehensive guide for beginners",
            resourceType: "COURSE",
            skillLevel: "BEGINNER",
            url: "https://example.com/course1",
            rating: 4.5,
            cost: "FREE"
          },
          {
            id: 2,
            title: "Frontend Developer Fundamentals",
            description: "Learn the core skills needed for this role",
            resourceType: "COURSE",
            skillLevel: "BEGINNER",
            url: "https://example.com/course2",
            rating: 4.7,
            cost: "PAID"
          },
          {
            id: 3,
            title: "Building Your Frontend Developer Portfolio",
            description: "Guide to creating impressive portfolio projects",
            resourceType: "GUIDE",
            skillLevel: "ALL",
            url: "https://example.com/portfolio-guide",
            rating: 4.5,
            cost: "FREE"
          }
        ]
      };
      
      setLearningPlan(mockLearningPlan);
      setLoading(false);
    }, 1500);
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleMilestoneProgress = (milestoneId, newStatus, newProgress) => {
    // In a real app, this would call an API to update the milestone
    console.log(`Updating milestone ${milestoneId} to ${newStatus} with progress ${newProgress}%`);
    
    // Update the local state
    setLearningPlan(prevPlan => {
      const updatedMilestones = prevPlan.milestones.map(milestone => 
        milestone.id === milestoneId 
          ? { ...milestone, status: newStatus, progressPercentage: newProgress } 
          : milestone
      );
      return { ...prevPlan, milestones: updatedMilestones };
    });
    
    // Update overall progress
    calculateOverallProgress();
  };
  
  const calculateOverallProgress = () => {
    // In a real app, this would be calculated based on all milestones
    // For now, we'll just update with some mock data
    setProgress(prev => ({
      ...prev,
      overallProgressPercentage: prev.overallProgressPercentage + 5,
      completedMilestones: prev.completedMilestones + 0.5
    }));
  };

  const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3]
  }));
  
  const ProgressChip = styled(Chip)(({ theme, ontrack }) => ({
    backgroundColor: ontrack === 'true' ? theme.palette.success.main : theme.palette.warning.main,
    color: theme.palette.common.white,
    fontWeight: 'bold'
  }));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!learningPlan) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Learning Plan</Typography>
        <Typography>No learning plan found. Complete your assessment to generate a personalized learning plan.</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Take Assessment
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" gutterBottom>Your Learning Plan</Typography>
      
      {/* Overview Card */}
      <StyledPaper elevation={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>{learningPlan.title}</Typography>
            <Typography variant="body1" paragraph>{learningPlan.description}</Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarMonthIcon sx={{ mr: 1 }} />
              <Typography variant="body2">
                {new Date(learningPlan.startDate).toLocaleDateString()} - {new Date(learningPlan.endDate).toLocaleDateString()}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>Overall Progress</Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Completion</Typography>
                <Typography variant="body2" fontWeight="bold">{Math.round(progress.overallProgressPercentage)}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={progress.overallProgressPercentage} 
                sx={{ mb: 2, height: 8, borderRadius: 4 }} 
              />
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Timeline</Typography>
                <Typography variant="body2" fontWeight="bold">{Math.round(progress.timeProgressPercentage)}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={progress.timeProgressPercentage} 
                sx={{ mb: 2, height: 8, borderRadius: 4 }} 
                color="secondary"
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">
                  {progress.completedMilestones} of {progress.totalMilestones} milestones completed
                </Typography>
                <ProgressChip 
                  label={progress.onTrack ? "On Track" : "Falling Behind"} 
                  ontrack={progress.onTrack.toString()}
                  size="small"
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </StyledPaper>
      
      {/* Milestone Timeline */}
      <StyledPaper elevation={3}>
        <Typography variant="h5" gutterBottom>Your Learning Journey</Typography>
        <Stepper activeStep={activeStep} orientation="vertical">
          {learningPlan.milestones.map((milestone, index) => (
            <Step key={milestone.id}>
              <StepLabel>
                <Typography variant="h6">{milestone.title}</Typography>
                <Typography variant="body2" color="textSecondary">{milestone.description}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <CalendarMonthIcon sx={{ mr: 1, fontSize: 'small' }} />
                  <Typography variant="body2" color="textSecondary">
                    {new Date(milestone.startDate).toLocaleDateString()} - {new Date(milestone.endDate).toLocaleDateString()}
                  </Typography>
                  <Chip 
                    label={milestone.status.replace('_', ' ')} 
                    size="small" 
                    color={
                      milestone.status === 'COMPLETED' ? 'success' : 
                      milestone.status === 'IN_PROGRESS' ? 'primary' : 
                      'default'
                    }
                    sx={{ ml: 2 }}
                  />
                </Box>
              </StepLabel>
              <Box sx={{ ml: 4, mt: 2, mb: 3 }}>
                {index === activeStep && (
                  <>
                    <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
                      <ReactMarkdown>{milestone.content}</ReactMarkdown>
                    </Paper>
                    
                    {milestone.status !== 'COMPLETED' && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" gutterBottom>Update your progress:</Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => handleMilestoneProgress(milestone.id, 'NOT_STARTED', 0)}
                          >
                            Not Started
                          </Button>
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => handleMilestoneProgress(milestone.id, 'IN_PROGRESS', 50)}
                          >
                            In Progress
                          </Button>
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => handleMilestoneProgress(milestone.id, 'COMPLETED', 100)}
                          >
                            Completed
                          </Button>
                        </Box>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                      <Button
                        color="inherit"
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Back
                      </Button>
                      <Box sx={{ flex: '1 1 auto' }} />
                      <Button 
                        onClick={handleNext}
                        disabled={index === learningPlan.milestones.length - 1}
                      >
                        Next
                      </Button>
                    </Box>
                  </>
                )}
              </Box>
            </Step>
          ))}
        </Stepper>
      </StyledPaper>
      
      {/* Recommended Resources */}
      <StyledPaper elevation={3}>
        <Typography variant="h5" gutterBottom>Recommended Resources</Typography>
        <Grid container spacing={3}>
          {learningPlan.recommendedResources.map((resource) => (
            <Grid item xs={12} sm={6} md={4} key={resource.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>{resource.title}</Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {resource.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    <Chip 
                      label={resource.resourceType} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                    <Chip 
                      label={resource.skillLevel} 
                      size="small" 
                      color="secondary" 
                      variant="outlined"
                    />
                    <Chip 
                      label={resource.cost} 
                      size="small" 
                      color={resource.cost === 'FREE' ? 'success' : 'default'} 
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2">Rating: {resource.rating}/5</Typography>
                  </Box>
                </CardContent>
                <Divider />
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary" 
                    href={resource.url} 
                    target="_blank"
                    startIcon={<BookmarkIc<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>