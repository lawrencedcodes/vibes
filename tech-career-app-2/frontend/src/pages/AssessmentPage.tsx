import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Paper,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Slider,
  Chip,
  Divider,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AssessmentPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState(0);
  const [assessmentType, setAssessmentType] = useState('interest');
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  // Mock assessment questions
  const assessmentTypes = [
    { value: 'interest', label: 'Interest & Passion' },
    { value: 'skill', label: 'Skills & Strengths' },
    { value: 'workStyle', label: 'Work Style & Preferences' },
    { value: 'techAccess', label: 'Technological Access' }
  ];

  const interestQuestions = [
    {
      id: 'interest_1',
      question: 'How interested are you in designing user interfaces?',
      type: 'scale',
      min: 1,
      max: 5,
      minLabel: 'Not interested',
      maxLabel: 'Very interested'
    },
    {
      id: 'interest_2',
      question: 'How interested are you in writing code and programming?',
      type: 'scale',
      min: 1,
      max: 5,
      minLabel: 'Not interested',
      maxLabel: 'Very interested'
    },
    {
      id: 'interest_3',
      question: 'Which of these activities do you enjoy the most?',
      type: 'radio',
      options: [
        'Solving complex problems',
        'Creating visual designs',
        'Analyzing data and finding patterns',
        'Writing and documenting',
        'Teaching and explaining concepts to others'
      ]
    },
    {
      id: 'interest_4',
      question: 'What type of projects would you be most excited to work on?',
      type: 'radio',
      options: [
        'Web applications',
        'Mobile apps',
        'Data analysis and visualization',
        'Cybersecurity',
        'Artificial intelligence/Machine learning',
        'Game development'
      ]
    },
    {
      id: 'interest_5',
      question: 'What aspects of technology interest you the most?',
      type: 'text'
    }
  ];

  const skillQuestions = [
    {
      id: 'skill_1',
      question: 'Rate your problem-solving abilities:',
      type: 'scale',
      min: 1,
      max: 5,
      minLabel: 'Beginner',
      maxLabel: 'Expert'
    },
    {
      id: 'skill_2',
      question: 'Rate your communication skills:',
      type: 'scale',
      min: 1,
      max: 5,
      minLabel: 'Beginner',
      maxLabel: 'Expert'
    },
    {
      id: 'skill_3',
      question: 'Which of these skills do you consider your strongest?',
      type: 'radio',
      options: [
        'Attention to detail',
        'Creative thinking',
        'Logical reasoning',
        'Teamwork',
        'Time management',
        'Learning new concepts quickly'
      ]
    },
    {
      id: 'skill_4',
      question: 'Do you have any experience with programming languages?',
      type: 'radio',
      options: [
        'No experience',
        'Basic understanding of concepts',
        'Some experience with simple programs',
        'Moderate experience with one or more languages',
        'Extensive experience with multiple languages'
      ]
    },
    {
      id: 'skill_5',
      question: 'What technical or non-technical skills do you already possess that might be relevant to a tech career?',
      type: 'text'
    }
  ];

  const workStyleQuestions = [
    {
      id: 'workStyle_1',
      question: 'Do you prefer working independently or as part of a team?',
      type: 'scale',
      min: 1,
      max: 5,
      minLabel: 'Independently',
      maxLabel: 'Team-based'
    },
    {
      id: 'workStyle_2',
      question: 'How do you feel about remote work?',
      type: 'radio',
      options: [
        'I prefer working in an office',
        'I prefer a hybrid approach',
        'I prefer working fully remote',
        'No strong preference'
      ]
    },
    {
      id: 'workStyle_3',
      question: 'What type of work environment helps you be most productive?',
      type: 'radio',
      options: [
        'Structured with clear guidelines',
        'Flexible with general direction',
        'Creative with minimal constraints',
        'Fast-paced with deadlines',
        'Collaborative with frequent interaction'
      ]
    },
    {
      id: 'workStyle_4',
      question: 'How important is work-life balance to you?',
      type: 'scale',
      min: 1,
      max: 5,
      minLabel: 'Less important',
      maxLabel: 'Very important'
    },
    {
      id: 'workStyle_5',
      question: 'Describe your ideal work environment and schedule:',
      type: 'text'
    }
  ];

  const techAccessQuestions = [
    {
      id: 'techAccess_1',
      question: 'What type of computer do you have regular access to?',
      type: 'radio',
      options: [
        'Desktop computer',
        'Laptop',
        'Tablet only',
        'Smartphone only',
        'No regular computer access'
      ]
    },
    {
      id: 'techAccess_2',
      question: 'How would you describe your internet connection?',
      type: 'radio',
      options: [
        'High-speed reliable connection',
        'Moderate speed, generally reliable',
        'Slow but consistent',
        'Unreliable or intermittent',
        'Limited or no regular internet access'
      ]
    },
    {
      id: 'techAccess_3',
      question: 'How many hours per week can you dedicate to learning?',
      type: 'radio',
      options: [
        'Less than 5 hours',
        '5-10 hours',
        '10-20 hours',
        '20-30 hours',
        'More than 30 hours'
      ]
    },
    {
      id: 'techAccess_4',
      question: 'Do you have a quiet space where you can focus on learning?',
      type: 'radio',
      options: [
        'Yes, consistently available',
        'Yes, but with limited availability',
        'Sometimes',
        'Rarely or never'
      ]
    },
    {
      id: 'techAccess_5',
      question: 'Are there any technological limitations or constraints that might affect your learning journey?',
      type: 'text'
    }
  ];

  const getQuestions = () => {
    switch (assessmentType) {
      case 'interest':
        return interestQuestions;
      case 'skill':
        return skillQuestions;
      case 'workStyle':
        return workStyleQuestions;
      case 'techAccess':
        return techAccessQuestions;
      default:
        return [];
    }
  };

  const questions = getQuestions();
  const steps = questions.map((_, index) => `Question ${index + 1}`);

  const handleNext = () => {
    if (activeStep === questions.length - 1) {
      // Submit assessment
      handleSubmit();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    // In a real app, this would send the answers to the backend
    console.log('Assessment answers:', answers);
    setCompleted(true);
    
    // Mock API call
    // fetch('/api/assessment/submit/' + assessmentType, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(answers),
    // })
    // .then(response => response.json())
    // .then(data => {
    //   setCompleted(true);
    // })
    // .catch(error => {
    //   console.error('Error submitting assessment:', error);
    // });
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const handleAssessmentTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAssessmentType(event.target.value);
    setActiveStep(0);
    setAnswers({});
    setCompleted(false);
  };

  const renderQuestion = (question: any) => {
    switch (question.type) {
      case 'scale':
        return (
          <Box sx={{ width: '100%', mt: 4 }}>
            <Typography gutterBottom>{question.question}</Typography>
            <Box sx={{ px: 2, mt: 4 }}>
              <Slider
                value={answers[question.id] || question.min}
                onChange={(_, value) => handleAnswerChange(question.id, value)}
                min={question.min}
                max={question.max}
                step={1}
                marks={[
                  { value: question.min, label: question.minLabel },
                  { value: question.max, label: question.maxLabel }
                ]}
                valueLabelDisplay="on"
              />
            </Box>
          </Box>
        );
      case 'radio':
        return (
          <FormControl component="fieldset" sx={{ width: '100%', mt: 4 }}>
            <FormLabel component="legend">{question.question}</FormLabel>
            <RadioGroup
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            >
              {question.options.map((option: string, index: number) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      case 'text':
        return (
          <Box sx={{ width: '100%', mt: 4 }}>
            <Typography gutterBottom>{question.question}</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              variant="outlined"
              placeholder="Type your answer here..."
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Assessment
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Select Assessment Type
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            row={!isMobile}
            value={assessmentType}
            onChange={handleAssessmentTypeChange}
          >
            {assessmentTypes.map((type) => (
              <FormControlLabel
                key={type.value}
                value={type.value}
                control={<Radio />}
                label={type.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Paper>
      
      {completed ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom color="primary">
            Assessment Completed!
          </Typography>
          <Typography variant="body1" paragraph>
            Thank you for completing the {assessmentTypes.find(t => t.value === assessmentType)?.label} assessment.
            Your responses will help us provide personalized career recommendations and learning plans.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => {
                setAssessmentType(
                  assessmentTypes[(assessmentTypes.findIndex(t => t.value === assessmentType) + 1) % assessmentTypes.length].value
                );
                setActiveStep(0);
                setAnswers({});
                setCompleted(false);
              }}
            >
              Take Another Assessment
            </Button>
            <Button 
              variant="contained" 
              onClick={() => navigate('/dashboard')}
            >
              Return to Dashboard
            </Button>
          </Box>
        </Paper>
      ) : (
        <Paper sx={{ p: { xs: 2, sm: 4 } }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              {assessmentTypes.find(t => t.value === assessmentType)?.label} Assessment
            </Typography>
            <Divider />
          </Box>
          
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box sx={{ mt: 4, mb: 4 }}>
            {renderQuestion(questions[activeStep])}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!answers[questions[activeStep].id]}
            >
              {activeStep === questions.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default AssessmentPage;
