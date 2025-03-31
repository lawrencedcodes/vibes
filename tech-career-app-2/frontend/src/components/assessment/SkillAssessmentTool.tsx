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
  Rating,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Skill and Strength Assessment Component
const SkillAssessmentTool = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [responses, setResponses] = useState({
    technicalSkills: {},
    softSkills: {},
    strengths: [],
    weaknesses: [],
    learningGoals: '',
    selfAssessment: ''
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

  const handleSkillRatingChange = (skill, newValue, category) => {
    setResponses(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [skill]: newValue
      }
    }));
  };

  const handleTextChange = (event, category) => {
    setResponses(prev => ({
      ...prev,
      [category]: event.target.value
    }));
  };

  const technicalSkills = [
    'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js',
    'Node.js', 'Python', 'Java', 'C#', 'PHP', 'SQL', 'NoSQL',
    'Git', 'Docker', 'AWS', 'Azure', 'Google Cloud',
    'Data Analysis', 'Machine Learning', 'UI/UX Design', 'Mobile Development',
    'Testing/QA', 'DevOps', 'Cybersecurity'
  ];

  const softSkills = [
    'Communication', 'Teamwork', 'Problem Solving', 'Critical Thinking',
    'Time Management', 'Adaptability', 'Leadership', 'Creativity',
    'Attention to Detail', 'Emotional Intelligence', 'Conflict Resolution',
    'Presentation Skills', 'Project Management', 'Customer Service'
  ];

  const steps = [
    {
      label: 'Technical Skills Assessment',
      description: 'Rate your proficiency in the following technical skills',
      content: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            Rate your current skill level from 0 (No Experience) to 5 (Expert)
          </Typography>
          
          <Grid container spacing={3}>
            {technicalSkills.map((skill) => (
              <Grid item xs={12} sm={6} md={4} key={skill}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    {skill}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      None
                    </Typography>
                    <Rating
                      name={`tech-skill-${skill}`}
                      value={responses.technicalSkills[skill] || 0}
                      onChange={(event, newValue) => {
                        handleSkillRatingChange(skill, newValue, 'technicalSkills');
                      }}
                      max={5}
                      sx={{ mx: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Expert
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ mt: 3 }}>
            <FormLabel component="legend">Any other technical skills not listed above?</FormLabel>
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              placeholder="List any other technical skills and your proficiency level..."
              multiline
              rows={2}
              onChange={(e) => handleTextChange(e, 'otherTechnicalSkills')}
            />
          </Box>
        </Box>
      )
    },
    {
      label: 'Soft Skills Assessment',
      description: 'Rate your proficiency in the following soft skills',
      content: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            Rate your current skill level from 0 (Needs Improvement) to 5 (Excellent)
          </Typography>
          
          <Grid container spacing={3}>
            {softSkills.map((skill) => (
              <Grid item xs={12} sm={6} key={skill}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    {skill}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Needs Work
                    </Typography>
                    <Rating
                      name={`soft-skill-${skill}`}
                      value={responses.softSkills[skill] || 0}
                      onChange={(event, newValue) => {
                        handleSkillRatingChange(skill, newValue, 'softSkills');
                      }}
                      max={5}
                      sx={{ mx: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Excellent
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )
    },
    {
      label: 'Strengths Identification',
      description: 'What do you consider to be your greatest strengths?',
      content: (
        <Box sx={{ mt: 2 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Select all that apply to you:</FormLabel>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {[
                'Quick learner', 
                'Analytical thinking', 
                'Creative problem solving', 
                'Attention to detail', 
                'Working under pressure',
                'Adapting to new technologies',
                'Visual thinking',
                'Logical reasoning',
                'Written communication',
                'Verbal communication',
                'Teaching/explaining concepts',
                'Organization and planning',
                'Self-motivation',
                'Persistence through challenges'
              ].map((strength) => (
                <Grid item xs={12} sm={6} key={strength}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={responses.strengths.includes(strength)}
                        onChange={(e) => handleCheckboxChange(e, 'strengths')}
                        value={strength}
                      />
                    }
                    label={strength}
                  />
                </Grid>
              ))}
            </Grid>
          </FormControl>
          
          <Box sx={{ mt: 3 }}>
            <FormLabel component="legend">Describe your top 3 strengths in more detail:</FormLabel>
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              rows={3}
              placeholder="Explain how these strengths have helped you in past situations..."
              onChange={(e) => handleTextChange(e, 'strengthsDetail')}
            />
          </Box>
        </Box>
      )
    },
    {
      label: 'Areas for Improvement',
      description: 'Identifying areas for growth is an important part of career development',
      content: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            Everyone has areas they can improve. Identifying these honestly will help us create a more effective learning plan.
          </Typography>
          
          <FormControl component="fieldset">
            <FormLabel component="legend">Select areas where you'd like to improve:</FormLabel>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {[
                'Technical knowledge gaps', 
                'Public speaking', 
                'Networking with others', 
                'Time management', 
                'Focus and concentration',
                'Asking for help when needed',
                'Giving/receiving feedback',
                'Working in teams',
                'Leadership skills',
                'Setting realistic goals',
                'Handling criticism',
                'Work-life balance',
                'Confidence in abilities'
              ].map((weakness) => (
                <Grid item xs={12} sm={6} key={weakness}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={responses.weaknesses.includes(weakness)}
                        onChange={(e) => handleCheckboxChange(e, 'weaknesses')}
                        value={weakness}
                      />
                    }
                    label={weakness}
                  />
                </Grid>
              ))}
            </Grid>
          </FormControl>
          
          <Box sx={{ mt: 3 }}>
            <FormLabel component="legend">What specific challenges have you faced when learning technical skills?</FormLabel>
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              rows={3}
              placeholder="Describe any obstacles or difficulties you've encountered..."
              onChange={(e) => handleTextChange(e, 'learningChallenges')}
            />
          </Box>
        </Box>
      )
    },
    {
      label: 'Learning Goals',
      description: 'What are your goals for skill development?',
      content: (
        <Box sx={{ mt: 2 }}>
          <FormLabel component="legend">What specific skills would you like to develop in the next year?</FormLabel>
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            multiline
            rows={3}
            placeholder="List the top skills you want to learn or improve..."
            onChange={(e) => handleTextChange(e, 'learningGoals')}
          />
          
          <Box sx={{ mt: 4 }}>
            <FormLabel component="legend">How would you describe your overall approach to learning?</FormLabel>
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              rows={3}
              placeholder="Describe how you typically approach learning new skills..."
              onChange={(e) => handleTextChange(e, 'learningApproach')}
            />
          </Box>
          
          <Box sx={{ mt: 4 }}>
            <FormLabel component="legend">Final self-assessment:</FormLabel>
            <Typography variant="body2" color="text.secondary" paragraph>
              In a few sentences, summarize your current skill level, strengths, areas for improvement, and learning goals.
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              rows={4}
              placeholder="Provide a brief self-assessment..."
              onChange={(e) => handleTextChange(e, 'selfAssessment')}
            />
          </Box>
        </Box>
      )
    }
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Skill & Strength Assessment
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          This assessment will help us understand your current skills and strengths to create a personalized learning plan.
        </Typography>
        
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {step.description}
                </Typography>
                {step.content}
                <Box sx={{ mb: 2, mt: 3 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={index === steps.length - 1 ? handleComplete : handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === steps.length - 1 ? 'Submit' : 'Continue'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>
    </Container>
  );
};

export default SkillAssessmentTool;
