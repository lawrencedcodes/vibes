import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Divider,
  Checkbox,
  FormGroup
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Assessment: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const navigate = useNavigate();

  // Mock assessment data
  const assessmentSections = [
    {
      title: 'Interest & Passion Exploration',
      description: 'Let\'s discover what areas of technology interest you the most.',
      questions: [
        {
          id: 'interest_1',
          text: 'Which of these activities do you enjoy the most?',
          type: 'radio',
          options: [
            'Designing user interfaces and visual elements',
            'Solving complex logical problems',
            'Analyzing data and finding patterns',
            'Building and fixing things',
            'Teaching or explaining concepts to others'
          ]
        },
        {
          id: 'interest_2',
          text: 'What type of projects would you be most excited to work on?',
          type: 'radio',
          options: [
            'Websites and mobile applications',
            'Data analysis and visualization',
            'Cybersecurity and system protection',
            'Artificial intelligence and machine learning',
            'Game development'
          ]
        },
        {
          id: 'interest_3',
          text: 'Which technologies are you most curious about? (Select all that apply)',
          type: 'checkbox',
          options: [
            'Web development (HTML, CSS, JavaScript)',
            'Mobile app development',
            'Data science and analytics',
            'Cloud computing',
            'Cybersecurity',
            'Artificial intelligence/Machine learning',
            'Blockchain',
            'Internet of Things (IoT)'
          ]
        }
      ]
    },
    {
      title: 'Skill & Strength Assessment',
      description: 'Let\'s identify your existing skills and strengths that could transfer well to a tech career.',
      questions: [
        {
          id: 'skill_1',
          text: 'How would you rate your problem-solving abilities?',
          type: 'radio',
          options: [
            'Very strong - I enjoy complex problems',
            'Strong - I can usually find solutions',
            'Average - I can solve problems with some guidance',
            'Developing - I find problem-solving challenging',
            'Not sure'
          ]
        },
        {
          id: 'skill_2',
          text: 'How comfortable are you with learning new technologies?',
          type: 'radio',
          options: [
            'Very comfortable - I enjoy learning new tech',
            'Comfortable - I can adapt to new tech with some effort',
            'Neutral - It depends on the technology',
            'Somewhat uncomfortable - I prefer familiar tools',
            'Very uncomfortable - I find new tech intimidating'
          ]
        },
        {
          id: 'skill_3',
          text: 'Which of these skills do you believe are your strengths? (Select all that apply)',
          type: 'checkbox',
          options: [
            'Attention to detail',
            'Creative thinking',
            'Logical reasoning',
            'Communication',
            'Organization',
            'Persistence',
            'Teamwork',
            'Self-motivation'
          ]
        }
      ]
    },
    {
      title: 'Work Style & Preferences',
      description: 'Let\'s understand your preferred work environment and style.',
      questions: [
        {
          id: 'work_1',
          text: 'What type of work environment do you prefer?',
          type: 'radio',
          options: [
            'Office-based with a team',
            'Remote work from home',
            'Hybrid (mix of remote and office)',
            'Flexible co-working spaces',
            'No strong preference'
          ]
        },
        {
          id: 'work_2',
          text: 'How do you prefer to solve problems?',
          type: 'radio',
          options: [
            'Independently, figuring things out on my own',
            'Collaboratively, discussing with others',
            'Research-based, looking up solutions',
            'Structured approach with clear guidelines',
            'Mix of approaches depending on the problem'
          ]
        },
        {
          id: 'work_3',
          text: 'What aspects of a job are most important to you? (Select up to 3)',
          type: 'checkbox',
          options: [
            'Work-life balance',
            'High salary potential',
            'Creative freedom',
            'Clear advancement path',
            'Making a positive impact',
            'Continuous learning',
            'Job security',
            'Recognition for achievements'
          ]
        }
      ]
    },
    {
      title: 'Technological Access',
      description: 'Let\'s understand what technology resources you have available.',
      questions: [
        {
          id: 'tech_1',
          text: 'What type of computer do you have regular access to?',
          type: 'radio',
          options: [
            'Modern desktop or laptop (less than 3 years old)',
            'Older desktop or laptop (3+ years old)',
            'Tablet device only',
            'Smartphone only',
            'Limited or shared computer access',
            'No regular computer access'
          ]
        },
        {
          id: 'tech_2',
          text: 'How would you describe your internet connection?',
          type: 'radio',
          options: [
            'High-speed reliable connection',
            'Moderate speed, generally reliable',
            'Slow but functional',
            'Unreliable or limited data',
            'Public access only (library, cafe, etc.)',
            'No regular internet access'
          ]
        },
        {
          id: 'tech_3',
          text: 'How many hours per week can you dedicate to learning?',
          type: 'radio',
          options: [
            '20+ hours',
            '10-20 hours',
            '5-10 hours',
            '1-5 hours',
            'Less than 1 hour',
            'Irregular schedule'
          ]
        }
      ]
    }
  ];

  // State to store answers
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const handleRadioChange = (questionId: string, value: string) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const handleCheckboxChange = (questionId: string, value: string, checked: boolean) => {
    const currentValues = answers[questionId] || [];
    let newValues;
    
    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter((v: string) => v !== value);
    }
    
    setAnswers({
      ...answers,
      [questionId]: newValues
    });
  };

  const isStepComplete = () => {
    const currentSection = assessmentSections[activeStep];
    return currentSection.questions.every(question => {
      if (question.type === 'radio') {
        return answers[question.id] !== undefined;
      } else if (question.type === 'checkbox') {
        return (answers[question.id] || []).length > 0;
      }
      return false;
    });
  };

  const handleNext = () => {
    if (activeStep === assessmentSections.length - 1) {
      handleSubmit();
    } else {
      setActiveStep(prevStep => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  const handleSubmit = () => {
    setLoading(true);
    
    // In a real application, this would send the assessment data to your API
    // For now, we'll simulate with a timeout
    setTimeout(() => {
      setLoading(false);
      setAssessmentComplete(true);
    }, 2000);
  };

  const renderQuestion = (question: any) => {
    if (question.type === 'radio') {
      return (
        <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
          <FormLabel component="legend" sx={{ mb: 1 }}>{question.text}</FormLabel>
          <RadioGroup
            value={answers[question.id] || ''}
            onChange={(e) => handleRadioChange(question.id, e.target.value)}
          >
            {question.options.map((option: string, index: number) => (
              <FormControlLabel
                key={index}
                value={option}
                control={<Radio />}
                label={option}
                sx={{ mb: 1 }}
              />
            ))}
          </RadioGroup>
        </FormControl>
      );
    } else if (question.type === 'checkbox') {
      return (
        <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
          <FormLabel component="legend" sx={{ mb: 1 }}>{question.text}</FormLabel>
          <FormGroup>
            {question.options.map((option: string, index: number) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={(answers[question.id] || []).includes(option)}
                    onChange={(e) => handleCheckboxChange(question.id, option, e.target.checked)}
                  />
                }
                label={option}
                sx={{ mb: 0.5 }}
              />
            ))}
          </FormGroup>
        </FormControl>
      );
    }
    return null;
  };

  if (assessmentComplete) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        <Paper sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Assessment Complete!
          </Typography>
          <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
            <img 
              src="https://cdn.pixabay.com/photo/2020/04/10/13/23/success-5025797_960_720.png" 
              alt="Success" 
              style={{ width: '150px', height: 'auto' }}
            />
          </Box>
          <Typography variant="body1" paragraph>
            Thank you for completing the assessment. We've analyzed your responses and generated personalized career recommendations for you.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/career-recommendations')}
            sx={{ mt: 2 }}
          >
            View Your Career Recommendations
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Career Assessment
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          This assessment will help us understand your interests, skills, and preferences to recommend the best tech career paths for you.
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {assessmentSections.map((section, index) => (
            <Step key={index}>
              <StepLabel>{section.title}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            {assessmentSections[activeStep].title}
          </Typography>
          <Typography variant="body1" paragraph>
            {assessmentSections[activeStep].description}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mt: 4 }}>
            {assessmentSections[activeStep].questions.map((question) => (
              <Box key={question.id} sx={{ mb: 4 }}>
                {renderQuestion(question)}
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0 || loading}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={!isStepComplete() || loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : activeStep === assessmentSections.length - 1 ? (
                'Submit'
              ) : (
                'Next'
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Assessment;
