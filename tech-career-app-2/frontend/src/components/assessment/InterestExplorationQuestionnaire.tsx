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
  Chip,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Interest and Passion Exploration Questionnaire Component
const InterestExplorationQuestionnaire = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [responses, setResponses] = useState({
    techInterests: [],
    problemSolving: '',
    creativity: '',
    communication: '',
    teamwork: '',
    analyticalThinking: '',
    detailOrientation: '',
    projectManagement: '',
    userFocus: '',
    learningStyle: '',
    preferredResources: [],
    timeCommitment: '',
    motivations: '',
    previousExperience: ''
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
      label: 'Tech Interests',
      description: 'Which areas of technology interest you the most?',
      content: (
        <Box sx={{ mt: 2 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Select all that apply:</FormLabel>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {[
                'Web Development', 
                'Mobile App Development', 
                'Data Science', 
                'Machine Learning', 
                'Cybersecurity',
                'Cloud Computing',
                'DevOps',
                'UX/UI Design',
                'Game Development',
                'Blockchain',
                'IoT (Internet of Things)',
                'AR/VR Development'
              ].map((interest) => (
                <Grid item xs={12} sm={6} md={4} key={interest}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={responses.techInterests.includes(interest)}
                        onChange={(e) => handleCheckboxChange(e, 'techInterests')}
                        value={interest}
                      />
                    }
                    label={interest}
                  />
                </Grid>
              ))}
            </Grid>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Any other tech interests not listed above?"
            variant="outlined"
            multiline
            rows={2}
            onChange={(e) => handleTextChange(e, 'otherTechInterests')}
          />
        </Box>
      )
    },
    {
      label: 'Problem Solving Approach',
      description: 'How do you typically approach solving problems?',
      content: (
        <Box sx={{ mt: 2 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Select the option that best describes you:</FormLabel>
            <RadioGroup
              aria-label="problem-solving"
              name="problem-solving"
              value={responses.problemSolving}
              onChange={(e) => handleRadioChange(e, 'problemSolving')}
            >
              <FormControlLabel 
                value="methodical" 
                control={<Radio />} 
                label="I prefer a methodical, step-by-step approach to solving problems" 
              />
              <FormControlLabel 
                value="creative" 
                control={<Radio />} 
                label="I like to think outside the box and find creative solutions" 
              />
              <FormControlLabel 
                value="collaborative" 
                control={<Radio />} 
                label="I enjoy collaborating with others to solve complex problems" 
              />
              <FormControlLabel 
                value="analytical" 
                control={<Radio />} 
                label="I analyze data and patterns to find the most efficient solution" 
              />
              <FormControlLabel 
                value="intuitive" 
                control={<Radio />} 
                label="I rely on intuition and experience to guide my problem-solving" 
              />
            </RadioGroup>
          </FormControl>
        </Box>
      )
    },
    {
      label: 'Learning Style',
      description: 'How do you prefer to learn new skills?',
      content: (
        <Box sx={{ mt: 2 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Select the option that best describes your learning style:</FormLabel>
            <RadioGroup
              aria-label="learning-style"
              name="learning-style"
              value={responses.learningStyle}
              onChange={(e) => handleRadioChange(e, 'learningStyle')}
            >
              <FormControlLabel 
                value="visual" 
                control={<Radio />} 
                label="Visual: I learn best through images, diagrams, and demonstrations" 
              />
              <FormControlLabel 
                value="auditory" 
                control={<Radio />} 
                label="Auditory: I prefer listening to explanations and discussions" 
              />
              <FormControlLabel 
                value="reading" 
                control={<Radio />} 
                label="Reading/Writing: I learn best by reading materials and taking notes" 
              />
              <FormControlLabel 
                value="kinesthetic" 
                control={<Radio />} 
                label="Kinesthetic: I prefer hands-on practice and learning by doing" 
              />
              <FormControlLabel 
                value="mixed" 
                control={<Radio />} 
                label="Mixed: I use a combination of different learning styles" 
              />
            </RadioGroup>
          </FormControl>
          
          <Box sx={{ mt: 4 }}>
            <FormLabel component="legend">What types of learning resources do you prefer?</FormLabel>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {[
                'Online courses with video lectures',
                'Interactive tutorials and exercises',
                'Books and written documentation',
                'Project-based learning',
                'One-on-one mentoring',
                'Group classes or workshops',
                'Community forums and discussions'
              ].map((resource) => (
                <Grid item xs={12} sm={6} key={resource}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={responses.preferredResources.includes(resource)}
                        onChange={(e) => handleCheckboxChange(e, 'preferredResources')}
                        value={resource}
                      />
                    }
                    label={resource}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      )
    },
    {
      label: 'Time Commitment',
      description: 'How much time can you dedicate to learning each week?',
      content: (
        <Box sx={{ mt: 2 }}>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">Select your weekly time availability:</FormLabel>
            <RadioGroup
              aria-label="time-commitment"
              name="time-commitment"
              value={responses.timeCommitment}
              onChange={(e) => handleRadioChange(e, 'timeCommitment')}
            >
              <FormControlLabel 
                value="0-5" 
                control={<Radio />} 
                label="0-5 hours per week (1 hour or less per day)" 
              />
              <FormControlLabel 
                value="5-10" 
                control={<Radio />} 
                label="5-10 hours per week (1-2 hours per day)" 
              />
              <FormControlLabel 
                value="10-20" 
                control={<Radio />} 
                label="10-20 hours per week (2-3 hours per day)" 
              />
              <FormControlLabel 
                value="20-30" 
                control={<Radio />} 
                label="20-30 hours per week (part-time focus)" 
              />
              <FormControlLabel 
                value="30+" 
                control={<Radio />} 
                label="30+ hours per week (full-time focus)" 
              />
            </RadioGroup>
          </FormControl>
          
          <Box sx={{ mt: 4 }}>
            <FormLabel component="legend">What is your primary motivation for pursuing a tech career?</FormLabel>
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              rows={3}
              placeholder="Describe what drives you to pursue a career in technology..."
              onChange={(e) => handleTextChange(e, 'motivations')}
            />
          </Box>
        </Box>
      )
    },
    {
      label: 'Previous Experience',
      description: 'Tell us about any previous experience with technology',
      content: (
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Describe any previous experience with technology or related fields"
            variant="outlined"
            multiline
            rows={4}
            placeholder="Include any courses, self-learning, projects, or work experience..."
            onChange={(e) => handleTextChange(e, 'previousExperience')}
          />
          
          <Box sx={{ mt: 4 }}>
            <FormLabel component="legend">Rate your current comfort level with technology:</FormLabel>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Beginner
              </Typography>
              <Rating
                name="tech-comfort"
                value={responses.techComfort || 0}
                onChange={(event, newValue) => {
                  setResponses(prev => ({
                    ...prev,
                    techComfort: newValue
                  }));
                }}
                max={5}
                sx={{ mx: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                Advanced
              </Typography>
            </Box>
          </Box>
        </Box>
      )
    }
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Interest & Passion Exploration
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Help us understand your interests and passions in technology to provide tailored career recommendations.
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

export default InterestExplorationQuestionnaire;
