import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  TextField, 
  Button, 
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  Slider,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Work Style and Preferences Assessment Component
const WorkStylePreferencesAssessment = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [responses, setResponses] = useState({
    workEnvironment: '',
    teamSize: '',
    workSchedule: '',
    remotePreference: '',
    workCulture: [],
    workLifeBalance: '',
    feedbackStyle: '',
    managementStyle: '',
    careerGrowth: [],
    stressManagement: '',
    workplaceValues: []
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleComplete = () => {
    // In a real app, this would submit the responses to the backend
    console.log('Submitting responses:', responses);
    navigate('/assessment/results');
  };

  const handleCheckboxChange = (event, category) => {
    const { value, checked } = event.target;
    setResponses(prev => ({
      ...prev,
      [category]: checked 
        ? [...prev[category], value]
        : prev[category].filter(item => item !== value)
    }));
  };

  const handleRadioChange = (event, category) => {
    setResponses(prev => ({
      ...prev,
      [category]: event.target.value
    }));
  };

  const handleTextChange = (event, category) => {
    setResponses(prev => ({
      ...prev,
      [category]: event.target.value
    }));
  };

  const handleSliderChange = (event, newValue, category) => {
    setResponses(prev => ({
      ...prev,
      [category]: newValue
    }));
  };

  const steps = [
    {
      label: 'Work Environment',
      description: 'What type of work environment do you prefer?',
      content: (
        <Box sx={{ mt: 2 }}>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">Select your preferred work environment:</FormLabel>
            <RadioGroup
              aria-label="work-environment"
              name="work-environment"
              value={responses.workEnvironment}
              onChange={(e) => handleRadioChange(e, 'workEnvironment')}
            >
              <FormControlLabel 
                value="office" 
                control={<Radio />} 
                label="Traditional office environment" 
              />
              <FormControlLabel 
                value="hybrid" 
                control={<Radio />} 
                label="Hybrid (mix of office and remote)" 
              />
              <FormControlLabel 
                value="remote" 
                control={<Radio />} 
                label="Fully remote" 
              />
              <FormControlLabel 
                value="coworking" 
                control={<Radio />} 
                label="Coworking space" 
              />
              <FormControlLabel 
                value="flexible" 
                control={<Radio />} 
                label="Flexible (I can adapt to different environments)" 
              />
            </RadioGroup>
          </FormControl>
          
          <Box sx={{ mt: 4 }}>
            <FormLabel component="legend">If you prefer remote work, how often would you like to meet in person?</FormLabel>
            <RadioGroup
              aria-label="remote-preference"
              name="remote-preference"
              value={responses.remotePreference}
              onChange={(e) => handleRadioChange(e, 'remotePreference')}
            >
              <FormControlLabel 
                value="never" 
                control={<Radio />} 
                label="Never - fully remote" 
              />
              <FormControlLabel 
                value="quarterly" 
                control={<Radio />} 
                label="Quarterly team meetings" 
              />
              <FormControlLabel 
                value="monthly" 
                control={<Radio />} 
                label="Monthly in-person days" 
              />
              <FormControlLabel 
                value="weekly" 
                control={<Radio />} 
                label="1-2 days per week in office" 
              />
              <FormControlLabel 
                value="mostly-office" 
                control={<Radio />} 
                label="Mostly in office with occasional remote days" 
              />
            </RadioGroup>
          </Box>
        </Box>
      )
    },
    {
      label: 'Team Dynamics',
      description: 'How do you prefer to work with others?',
      content: (
        <Box sx={{ mt: 2 }}>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">What team size do you prefer?</FormLabel>
            <RadioGroup
              aria-label="team-size"
              name="team-size"
              value={responses.teamSize}
              onChange={(e) => handleRadioChange(e, 'teamSize')}
            >
              <FormControlLabel 
                value="solo" 
                control={<Radio />} 
                label="Working independently/solo" 
              />
              <FormControlLabel 
                value="small" 
                control={<Radio />} 
                label="Small team (2-5 people)" 
              />
              <FormControlLabel 
                value="medium" 
                control={<Radio />} 
                label="Medium team (6-15 people)" 
              />
              <FormControlLabel 
                value="large" 
                control={<Radio />} 
                label="Large team (15+ people)" 
              />
              <FormControlLabel 
                value="flexible" 
                control={<Radio />} 
                label="No preference - I can adapt to different team sizes" 
              />
            </RadioGroup>
          </FormControl>
          
          <Box sx={{ mt: 4 }}>
            <FormLabel component="legend">What management style do you work best with?</FormLabel>
            <RadioGroup
              aria-label="management-style"
              name="management-style"
              value={responses.managementStyle}
              onChange={(e) => handleRadioChange(e, 'managementStyle')}
            >
              <FormControlLabel 
                value="hands-off" 
                control={<Radio />} 
                label="Hands-off (autonomous with minimal supervision)" 
              />
              <FormControlLabel 
                value="supportive" 
                control={<Radio />} 
                label="Supportive (guidance when needed, but mostly independent)" 
              />
              <FormControlLabel 
                value="collaborative" 
                control={<Radio />} 
                label="Collaborative (regular check-ins and team decision-making)" 
              />
              <FormControlLabel 
                value="structured" 
                control={<Radio />} 
                label="Structured (clear expectations and regular feedback)" 
              />
              <FormControlLabel 
                value="mentoring" 
                control={<Radio />} 
                label="Mentoring (close guidance and teaching)" 
              />
            </RadioGroup>
          </Box>
        </Box>
      )
    },
    {
      label: 'Work Schedule',
      description: 'What are your preferences regarding work hours and scheduling?',
      content: (
        <Box sx={{ mt: 2 }}>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">What type of work schedule do you prefer?</FormLabel>
            <RadioGroup
              aria-label="work-schedule"
              name="work-schedule"
              value={responses.workSchedule}
              onChange={(e) => handleRadioChange(e, 'workSchedule')}
            >
              <FormControlLabel 
                value="standard" 
                control={<Radio />} 
                label="Standard 9-5 work hours" 
              />
              <FormControlLabel 
                value="flexible" 
                control={<Radio />} 
                label="Flexible hours (core hours with flexibility around them)" 
              />
              <FormControlLabel 
                value="fully-flexible" 
                control={<Radio />} 
                label="Fully flexible (work when you want as long as work gets done)" 
              />
              <FormControlLabel 
                value="part-time" 
                control={<Radio />} 
                label="Part-time hours" 
              />
              <FormControlLabel 
                value="project-based" 
                control={<Radio />} 
                label="Project-based (focused on deliverables rather than hours)" 
              />
            </RadioGroup>
          </FormControl>
          
          <Box sx={{ mt: 4 }}>
            <FormLabel component="legend">How important is work-life balance to you?</FormLabel>
            <Box sx={{ px: 2, py: 1 }}>
              <Slider
                value={responses.workLifeBalance || 5}
                onChange={(e, newValue) => handleSliderChange(e, newValue, 'workLifeBalance')}
                step={1}
                marks={[
                  { value: 1, label: 'Work comes first' },
                  { value: 5, label: 'Equal balance' },
                  { value: 10, label: 'Life comes first' }
                ]}
                min={1}
                max={10}
              />
            </Box>
          </Box>
        </Box>
      )
    },
    {
      label: 'Work Culture',
      description: 'What type of workplace culture do you thrive in?',
      content: (
        <Box sx={{ mt: 2 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Select the cultural aspects that are important to you:</FormLabel>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {[
                'Innovation and creativity', 
                'Structure and stability', 
                'Collaborative teamwork', 
                'Individual autonomy', 
                'Fast-paced environment',
                'Relaxed atmosphere',
                'Learning and development focus',
                'Results-oriented',
                'Social and fun workplace',
                'Professional and formal',
                'Diverse and inclusive',
                'Mission-driven'
              ].map((culture) => (
                <Grid item xs={12} sm={6} key={culture}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={responses.workCulture.includes(culture)}
                        onChange={(e) => handleCheckboxChange(e, 'workCulture')}
                        value={culture}
                      />
                    }
                    label={culture}
                  />
                </Grid>
              ))}
            </Grid>
          </FormControl>
          
          <Box sx={{ mt: 4 }}>
            <FormLabel component="legend">What are your most important workplace values?</FormLabel>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {[
                'Transparency', 
                'Integrity', 
                'Work-life balance', 
                'Recognition', 
                'Innovation',
                'Diversity',
                'Collaboration',
                'Customer focus',
                'Social responsibility',
                'Career growth',
                'Competitive compensation',
                'Job security'
              ].map((value) => (
                <Grid item xs={12} sm={6} key={value}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={responses.workplaceValues.includes(value)}
                        onChange={(e) => handleCheckboxChange(e, 'workplaceValues')}
                        value={value}
                      />
                    }
                    label={value}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      )
    },
    {
      label: 'Career Growth',
      description: 'What are your career growth and development preferences?',
      content: (
        <Box sx={{ mt: 2 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">What types of career growth opportunities are important to you?</FormLabel>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {[
                'Learning new technical skills', 
                'Developing leadership abilities', 
                'Specializing in a specific domain', 
                'Working on diverse projects', 
                'Mentoring others',
                'Being mentored by experts',
                'Regular promotions',
                'Increasing responsibility',
                'Building a professional network',
                'Contributing to open source',
                'Speaking at conferences',
                'Publishing articles/research'
              ].map((growth) => (
                <Grid item xs={12} sm={6} key={growth}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={responses.careerGrowth.includes(growth)}
                        onChange={(e) => handleCheckboxChange(e, 'careerGrowth')}
                        value={growth}
                      />
                    }
                    label={growth}
                  />
                </Grid>
              ))}
            </Grid>
          </FormControl>
          
          <Box sx={{ mt: 4 }}>
            <FormLabel component="legend">How do you prefer to receive feedback?</FormLabel>
            <RadioGroup
              aria-label="feedback-style"
              name="feedback-style"
              value={responses.feedbackStyle}
              onChange={(e) => handleRadioChange(e, 'feedbackStyle')}
            >
              <FormControlLabel 
                value="direct" 
                control={<Radio />} 
                label="Direct and straightforward" 
              />
              <FormControlLabel 
                value="gentle" 
                control={<Radio />} 
                label="Gentle and supportive" 
              />
              <FormControlLabel 
                value="written" 
                control={<Radio />} 
                label="Written rather than verbal" 
              />
              <FormControlLabel 
                value="private" 
                control={<Radio />} 
                label="Private one-on-one conversations" 
              />
              <FormControlLabel 
                value="immediate" 
                control={<Radio />} 
                label="Immediate rather than delayed" 
              />
            </RadioGroup>
          </Box>
        </Box>
      )
    }
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Work Style & Preferences Assessment
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Understanding your work style and preferences will help us recommend career paths that align with your ideal work environment.
 <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>