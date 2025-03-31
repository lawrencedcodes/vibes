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
import ComputerIcon from '@mui/icons-material/Computer';
import WifiIcon from '@mui/icons-material/Wifi';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Technological Access Assessment Component
const TechnologicalAccessAssessment = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [responses, setResponses] = useState({
    computerAccess: '',
    computerType: '',
    computerAge: '',
    internetAccess: '',
    internetSpeed: '',
    internetReliability: '',
    mobileDevices: [],
    softwareAccess: [],
    workspaceAccess: '',
    timeAvailability: '',
    locationConstraints: '',
    accessibilityNeeds: '',
    additionalResources: ''
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
      label: 'Computer Access',
      description: 'Tell us about your computer access',
      content: (
        <Box sx={{ mt: 2 }}>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">Do you have regular access to a computer?</FormLabel>
            <RadioGroup
              aria-label="computer-access"
              name="computer-access"
              value={responses.computerAccess}
              onChange={(e) => handleRadioChange(e, 'computerAccess')}
            >
              <FormControlLabel 
                value="dedicated" 
                control={<Radio />} 
                label="Yes, I have my own dedicated computer" 
              />
              <FormControlLabel 
                value="shared" 
                control={<Radio />} 
                label="Yes, but I share it with others" 
              />
              <FormControlLabel 
                value="limited" 
                control={<Radio />} 
                label="Limited access (e.g., public library, friend's computer)" 
              />
              <FormControlLabel 
                value="none" 
                control={<Radio />} 
                label="No regular computer access" 
              />
            </RadioGroup>
          </FormControl>
          
          {(responses.computerAccess === 'dedicated' || responses.computerAccess === 'shared') && (
            <>
              <Box sx={{ mt: 4 }}>
                <FormLabel component="legend">What type of computer do you have?</FormLabel>
                <RadioGroup
                  aria-label="computer-type"
                  name="computer-type"
                  value={responses.computerType}
                  onChange={(e) => handleRadioChange(e, 'computerType')}
                >
                  <FormControlLabel 
                    value="desktop-windows" 
                    control={<Radio />} 
                    label="Desktop PC (Windows)" 
                  />
                  <FormControlLabel 
                    value="desktop-mac" 
                    control={<Radio />} 
                    label="Desktop Mac" 
                  />
                  <FormControlLabel 
                    value="laptop-windows" 
                    control={<Radio />} 
                    label="Laptop PC (Windows)" 
                  />
                  <FormControlLabel 
                    value="laptop-mac" 
                    control={<Radio />} 
                    label="Laptop Mac" 
                  />
                  <FormControlLabel 
                    value="chromebook" 
                    control={<Radio />} 
                    label="Chromebook" 
                  />
                  <FormControlLabel 
                    value="linux" 
                    control={<Radio />} 
                    label="Linux Computer" 
                  />
                  <FormControlLabel 
                    value="other" 
                    control={<Radio />} 
                    label="Other" 
                  />
                </RadioGroup>
              </Box>
              
              <Box sx={{ mt: 4 }}>
                <FormLabel component="legend">How old is your computer?</FormLabel>
                <RadioGroup
                  aria-label="computer-age"
                  name="computer-age"
                  value={responses.computerAge}
                  onChange={(e) => handleRadioChange(e, 'computerAge')}
                >
                  <FormControlLabel 
                    value="less-than-1" 
                    control={<Radio />} 
                    label="Less than 1 year old" 
                  />
                  <FormControlLabel 
                    value="1-3" 
                    control={<Radio />} 
                    label="1-3 years old" 
                  />
                  <FormControlLabel 
                    value="3-5" 
                    control={<Radio />} 
                    label="3-5 years old" 
                  />
                  <FormControlLabel 
                    value="more-than-5" 
                    control={<Radio />} 
                    label="More than 5 years old" 
                  />
                  <FormControlLabel 
                    value="unknown" 
                    control={<Radio />} 
                    label="I don't know" 
                  />
                </RadioGroup>
              </Box>
            </>
          )}
        </Box>
      )
    },
    {
      label: 'Internet Access',
      description: 'Tell us about your internet connectivity',
      content: (
        <Box sx={{ mt: 2 }}>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">What type of internet access do you have?</FormLabel>
            <RadioGroup
              aria-label="internet-access"
              name="internet-access"
              value={responses.internetAccess}
              onChange={(e) => handleRadioChange(e, 'internetAccess')}
            >
              <FormControlLabel 
                value="high-speed" 
                control={<Radio />} 
                label="High-speed broadband at home" 
              />
              <FormControlLabel 
                value="moderate" 
                control={<Radio />} 
                label="Moderate speed internet at home" 
              />
              <FormControlLabel 
                value="mobile" 
                control={<Radio />} 
                label="Mobile data / hotspot only" 
              />
              <FormControlLabel 
                value="public" 
                control={<Radio />} 
                label="Public Wi-Fi (coffee shops, libraries, etc.)" 
              />
              <FormControlLabel 
                value="limited" 
                control={<Radio />} 
                label="Limited or unreliable internet access" 
              />
              <FormControlLabel 
                value="none" 
                control={<Radio />} 
                label="No regular internet access" 
              />
            </RadioGroup>
          </FormControl>
          
          {responses.internetAccess && responses.internetAccess !== 'none' && (
            <>
              <Box sx={{ mt: 4 }}>
                <FormLabel component="legend">How would you rate your internet speed?</FormLabel>
                <Box sx={{ px: 2, py: 1 }}>
                  <Slider
                    value={responses.internetSpeed || 5}
                    onChange={(e, newValue) => handleSliderChange(e, newValue, 'internetSpeed')}
                    step={1}
                    marks={[
                      { value: 1, label: 'Very slow' },
                      { value: 3, label: 'Adequate' },
                      { value: 5, label: 'Fast' },
                      { value: 7, label: 'Very fast' },
                      { value: 10, label: 'Extremely fast' }
                    ]}
                    min={1}
                    max={10}
                  />
                </Box>
              </Box>
              
              <Box sx={{ mt: 4 }}>
                <FormLabel component="legend">How reliable is your internet connection?</FormLabel>
                <Box sx={{ px: 2, py: 1 }}>
                  <Slider
                    value={responses.internetReliability || 5}
                    onChange={(e, newValue) => handleSliderChange(e, newValue, 'internetReliability')}
                    step={1}
                    marks={[
                      { value: 1, label: 'Frequently drops' },
                      { value: 3, label: 'Occasional issues' },
                      { value: 5, label: 'Generally reliable' },
                      { value: 7, label: 'Very reliable' },
                      { value: 10, label: 'Extremely reliable' }
                    ]}
                    min={1}
                    max={10}
                  />
                </Box>
              </Box>
            </>
          )}
        </Box>
      )
    },
    {
      label: 'Mobile Devices & Software',
      description: 'Tell us about your mobile devices and software access',
      content: (
        <Box sx={{ mt: 2 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Which mobile devices do you have access to?</FormLabel>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {[
                'Smartphone (Android)', 
                'Smartphone (iPhone)', 
                'Tablet (Android)', 
                'Tablet (iPad)', 
                'E-reader (Kindle, etc.)',
                'Smartwatch',
                'None of the above'
              ].map((device) => (
                <Grid item xs={12} sm={6} key={device}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={responses.mobileDevices.includes(device)}
                        onChange={(e) => handleCheckboxChange(e, 'mobileDevices')}
                        value={device}
                      />
                    }
                    label={device}
                  />
                </Grid>
              ))}
            </Grid>
          </FormControl>
          
          <Box sx={{ mt: 4 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Which software or tools do you currently have access to?</FormLabel>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {[
                  'Microsoft Office (Word, Excel, etc.)', 
                  'Google Workspace (Docs, Sheets, etc.)', 
                  'Adobe Creative Suite (Photoshop, etc.)', 
                  'Code editors (VS Code, etc.)', 
                  'Video conferencing tools (Zoom, etc.)',
                  'Project management tools (Trello, etc.)',
                  'Design tools (Figma, etc.)',
                  'Cloud storage (Dropbox, Google Drive, etc.)'
                ].map((software) => (
                  <Grid item xs={12} sm={6} key={software}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={responses.softwareAccess.includes(software)}
                          onChange={(e) => handleCheckboxChange(e, 'softwareAccess')}
                          value={software}
                        />
                      }
                      label={software}
                    />
                  </Grid>
                ))}
              </Grid>
            </FormControl>
          </Box>
        </Box>
      )
    },
    {
      label: 'Workspace & Availability',
      description: 'Tell us about your workspace and time availability',
      content: (
        <Box sx={{ mt: 2 }}>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">Do you have access to a dedicated workspace for learning?</FormLabel>
            <RadioGroup
              aria-label="workspace-access"
              name="workspace-access"
              value={responses.workspaceAccess}
              onChange={(e) => handleRadioChange(e, 'workspaceAccess')}
            >
              <FormControlLabel 
                value="dedicated" 
                control={<Radio />} 
                label="Yes, I have a dedicated workspace at home" 
              />
              <FormControlLabel 
                value="shared" 
                control={<Radio />} 
                label="Yes, but it's a shared space at home" 
              />
              <FormControlLabel 
                value="public" 
                control={<Radio />} 
                label="I use public spaces (library, coffee shop, etc.)" 
              />
              <FormControlLabel 
                value="work" 
                control={<Radio />} 
                label="I use my workspace at work/school" 
              />
              <FormControlLabel 
                value="limited" 
                control={<Radio />} 
                label="I have limited workspace options" 
              />
            </RadioGroup>
          </FormControl>
          
          <Box sx={{ mt: 4 }}>
            <FormLabel component="legend">How much time can you dedicate to learning each week?</FormLabel>
            <RadioGroup
              aria-label="time-availability"
              name="time-availability"
              value={responses.timeAvailability}
              onChange={(e) => handleRadioChange(e, 'timeAvailability')}
            >
              <FormControlLabel 
                value="less-than-5" 
                control={<Radio />} 
                label="Less than 5 hours per week" 
              />
              <FormControlLabel 
                value="5-10" 
                control={<Radio />} 
                label="5-10 hours per week" 
              />
              <FormControlLabel 
                value="10-20" 
                control={<Radio />} 
                label="10-20 hours per week" 
              />
              <FormControlLabel 
                value="20-30" 
                control={<Radio />} 
                label="20-30 hours per week" 
              />
              <FormControlLabel 
                value="30+" 
                control={<Radio />} 
                label="30+ hours per week" 
              />
            </RadioGroup>
          </Box>
          
       <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>