import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Paper 
      component="footer" 
      square 
      variant="outlined" 
      sx={{ 
        mt: 'auto',
        py: 3,
        backgroundColor: 'background.paper'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'center', sm: 'flex-start' },
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          <Box sx={{ mb: { xs: 2, sm: 0 } }}>
            <Typography variant="h6" gutterBottom>
              Tech Career Guidance
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Empowering diverse individuals to find their path in technology
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Tech Career Guidance
            </Typography>
          </Box>
        </Box>
      </Container>
    </Paper>
  );
};

export default Footer;
