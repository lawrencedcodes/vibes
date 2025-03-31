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
  Chip,
  Autocomplete,
  Card,
  CardContent,
  CardActions,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import SecurityIcon from '@mui/icons-material/Security';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import CloudIcon from '@mui/icons-material/Cloud';
import DevicesIcon from '@mui/icons-material/Devices';

// Job Role Interest Selection Component
const JobRoleInterestSelection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [responses, setResponses] = useState({
    selectedRoles: [],
    customRoles: [],
    rolePreferences: {},
    industryPreferences: [],
    companySize: '',
    salaryExpectations: '',
    locationPreferences: '',
    remoteWork: '',
    additionalNotes: ''
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

  const handleRoleSelection = (role) => {
    setResponses(prev => ({
      ...prev,
      selectedRoles: prev.selectedRoles.includes(role)
        ? prev.selectedRoles.filter(r => r !== role)
        : [...prev.selectedRoles, role]
    }));
  };

  const handleRolePreferenceChange = (role, value) => {
    setResponses(prev => ({
      ...prev,
      rolePreferences: {
        ...prev.rolePreferences,
        [role]: value
      }
    }));
  };

  const handleCustomRoleAdd = (role) => {
    if (role && !responses.customRoles.includes(role)) {
      setResponses(prev => ({
        ...prev,
        customRoles: [...prev.customRoles, role]
      }));
    }
  };

  // Job role categories with common entry-level positions
  const jobRoles = {
    'Web Development': [
      'Frontend Developer',
      'Backend Developer',
      'Full Stack Developer',
      'WordPress Developer',
      'Web Content Manager'
    ],
    'Software Engineering': [
      'Junior Software Engineer',
      'Mobile App Developer',
      'QA Engineer',
      'Build Engineer',
      'Support Engineer'
    ],
    'Data': [
      'Data Analyst',
      'Junior Data Scientist',
      'Database Administrator',
      'Business Intelligence Analyst',
      'Data Engineer'
    ],
    'Design': [
      'UI Designer',
      'UX Designer',
      'Graphic Designer',
      'Product Designer',
      'Visual Designer'
    ],
    'DevOps & Cloud': [
      'Cloud Support Engineer',
      'Junior DevOps Engineer',
      'Systems Administrator',
      'Network Operations Technician',
      'IT Support Specialist'
    ],
    'Cybersecurity': [
      'Security Analyst',
      'IT Security Specialist',
      'Security Operations Center Analyst',
      'Compliance Specialist',
      'Identity Access Management Specialist'
    ],
    'Project Management': [
      'Project Coordinator',
      'Scrum Master',
      'Technical Project Manager',
      'Product Owner',
      'Agile Coach'
    ]
  };

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'E-commerce',
    'Entertainment',
    'Manufacturing',
    'Government',
    'Non-profit',
    'Consulting',
    'Retail',
    'Transportation'
  ];

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Web Development':
        return <CodeIcon />;
      case 'Software Engineering':
        return <DevicesIcon />;
      case 'Data':
        return <StorageIcon />;
      case 'Design':
        return <DesignServicesIcon />;
      case 'DevOps & Cloud':
        return <CloudIcon />;
      case 'Cybersecurity':
        return <SecurityIcon />;
      case 'Project Management':
        return <WorkIcon />;
      default:
        return <WorkIcon />;
    }
  };

  const steps = [
    {
      label: 'Job Role Selection',
      description: 'Select job roles you are interested in',
      content: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            Select all entry-level tech roles that interest you. You can select multiple roles across different categories.
          </Typography>
          
          {Object.entries(jobRoles).map(([category, roles]) => (
            <Box key={category} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {getCategoryIcon(category)}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {category}
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                {roles.map((role) => (
                  <Grid item xs={12} sm={6} md={4} key={role}>
                    <Card 
                      variant={responses.selectedRoles.includes(role) ? "elevation" : "outlined"} 
                      elevation={4}
                      sx={{ 
                        cursor: 'pointer',
                        bgcolor: responses.selectedRoles.includes(role) ? 'primary.dark' : 'background.paper',
                        color: responses.selectedRoles.includes(role) ? 'primary.contrastText' : 'text.primary',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: responses.selectedRoles.includes(role) ? 'primary.dark' : 'action.hover',
                        }
                      }}
                      onClick={() => handleRoleSelection(role)}
                    >
                      <CardContent>
                        <Typography variant="subtitle1">
                          {role}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Add Custom Job Roles
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              If you're interested in roles not listed above, you can add them here.
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                label="Custom Job Role"
                variant="outlined"
                size="small"
                sx={{ mr: 2, flexGrow: 1 }}
                id="customRoleInput"
              />
              <Button 
                variant="contained"
                onClick={() => {
                  const input = document.getElementById('customRoleInput') as HTMLInputElement;
                  handleCustomRoleAdd(input.value);
                  input.value = '';
                }}
              >
                Add
              </Button>
            </Box>
            
            {responses.customRoles.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Your Custom Roles:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {responses.customRoles.map((role) => (
                    <Chip 
                      key={role} 
                      label={role} 
                      color="primary" 
                      onDelete={() => {
                        setResponses(prev => ({
                          ...prev,
                          customRoles: prev.customRoles.filter(r => r !== role)
                        }));
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      )
    },
    {
      label: 'Role Preferences',
      description: 'Rate your interest level in your selected roles',
      content: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            For each role you selected, indicate your level of interest from 1 (somewhat interested) to 5 (extremely interested).
          </Typography>
          
          {[...responses.selectedRoles, ...responses.customRoles].length > 0 ? (
            <List>
              {[...responses.selectedRoles, ...responses.customRoles].map((role) => (
                <Box key={role} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {role}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 2, minWidth: '100px' }}>
                      Interest Level:
                    </Typography>
                    <RadioGroup
                      row
                      value={responses.rolePreferences[role] || '3'}
                      onChange={(e) => handleRolePreferenceChange(role, e.target.value)}
                    >
                      <FormControlLabel value="1" control={<Radio />} label="1" />
                      <FormControlLabel value="2" control={<Radio />} label="2" />
                      <FormControlLabel value="3" control={<Radio />} label="3" />
                      <FormControlLabel value="4" control={<Radio />} label="4" />
                      <FormControlLabel value="5" control={<Radio />} label="5" />
                    </RadioGroup>
                  </Box>
                </Box>
              ))}
            </List>
          ) : (
            <Typography variant="body1" color="error" sx={{ mt: 2 }}>
              Please go back and select at least one job role to continue.
            </Typography>
          )}
        </Box>
      )
    },
    {
      label: 'Industry Preferences',
      description: 'Which industries are you most interested in working in?',
      content: (
        <Box sx={{ mt: 2 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Select all industries that interest you:</FormLabel>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {industries.map((industry) => (
                <Grid item xs={12} sm={6} md={4} key={industry}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={responses.industryPreferences.includes(industry)}
                        onChange={(e) => handleCheckboxChange(e, 'industryPreferences')}
                        value={industry}
                      />
                    }
                    label={industry}
                  />
                </Grid>
              ))}
            </Grid>
          </FormControl>
          
          <Box sx={{ mt: 4 }}>
            <FormLabel component="legend">What size of company would you prefer to work for?</FormLabel>
            <RadioGroup
              aria-label="company-size"
              name="company-size"
              value={responses.companySize}
              onChange={(e) => handleRadioChange(e, 'companySize')}
            >
              <FormControlLabel 
                value="startup" 
                control={<Radio />} 
                label="Startup (1-50 employees)" 
              />
              <FormControlLabel 
                value="small" 
                control={<Radio />} 
                label="Small company (51-200 employees)" 
              />
              <FormControlLabel 
                value="medium" 
                control={<Radio />} 
                label="Medium company (201-1000 employees)" 
              />
              <FormControlLabel 
                value="large" 
                control={<Radio />} 
                label="Large company (1000+ employees)" 
              />
              <FormControlLabel 
                value="no-preference" 
                control={<Radio />} 
                label="No preference" 
              />
            </RadioGroup>
          </Box>
        </Box>
      )
    },
    {
      label: 'Additional Preferences',
      description: 'Tell us about your other job preferences',
      content: (
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Salary Expectations"
                variant="outlined"
                placeholder="What are your salary expectations for an entry-level position?"
                value={responses.salaryExpectations}
                onChange={(e) => handleTextChange(e, 'salaryExpectations')}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location Preferences"
                variant="outlined"
                placeholder="Do you have any location preferences? (cities, regions, countries)"
                value={responses.locationPreferences}
                onChange={(e) => handleTextChange(e, 'locationPreferences')}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Remote Work Preference:</FormLabel>
                <RadioGroup
                  aria-label="remote-work"
                  name="remote-work"
                  value={responses.remoteWork}
                  onChange={(e) => handleRadioChange(e, 'remoteWork')}
                >
                  <FormControlLabel 
                    value="fully-remote" 
                    control={<Radio />} 
                    label="Fully remote only" 
                  />
                  <FormControlLabel 
                    value="hybrid" 
                    control={<Radio />} 
                    label="Hybrid (mix of remote and in-office)" 
                  />
                  <FormControlLabel 
                    value="in-office" 
                    control={<Radio />} 
                    label="In-office only" 
                  />
                  <FormControlLabel 
                    value="flexible" 
                    control={<Radio />} 
                    label="Flexible (open to any arrangement)" 
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Notes"
                variant="outlined"
                multiline
                rows={4}
                placeholder="Any other preferences or requirements for your ideal job role?"
                <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>