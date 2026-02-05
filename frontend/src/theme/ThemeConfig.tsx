import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React, { useState, useEffect, createContext, useMemo } from 'react';
import { PaletteMode } from '@mui/material';

// Create a theme context
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: 'dark' as PaletteMode,
});

export const ThemeConfig: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use dark mode by default as per requirements
  const [mode, setMode] = useState<PaletteMode>('dark');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode]
  );

  // Store the user's preference in local storage
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  // Create a theme instance
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#6200EE',
            light: '#BB86FC',
            dark: '#3700B3',
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#03DAC6',
            light: '#66FFF8',
            dark: '#00A896',
            contrastText: '#000000',
          },
          background: {
            default: mode === 'dark' ? '#121212' : '#FAFAFA',
            paper: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
          },
          text: {
            primary: mode === 'dark' ? '#FFFFFF' : '#000000',
            secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
          },
          error: {
            main: '#CF6679',
          },
        },
        typography: {
          fontFamily: [
            'Roboto',
            'Arial',
            'sans-serif',
          ].join(','),
          h1: {
            fontSize: '2.5rem',
            fontWeight: 500,
            '@media (max-width:600px)': {
              fontSize: '2rem',
            },
          },
          h2: {
            fontSize: '2rem',
            fontWeight: 500,
            '@media (max-width:600px)': {
              fontSize: '1.75rem',
            },
          },
          h3: {
            fontSize: '1.75rem',
            fontWeight: 500,
            '@media (max-width:600px)': {
              fontSize: '1.5rem',
            },
          },
          h4: {
            fontSize: '1.5rem',
            fontWeight: 500,
            '@media (max-width:600px)': {
              fontSize: '1.25rem',
            },
          },
          h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
            '@media (max-width:600px)': {
              fontSize: '1.1rem',
            },
          },
          h6: {
            fontSize: '1.1rem',
            fontWeight: 500,
            '@media (max-width:600px)': {
              fontSize: '1rem',
            },
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 500,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: mode === 'dark' 
                  ? '0px 4px 8px rgba(0, 0, 0, 0.4)' 
                  : '0px 4px 8px rgba(0, 0, 0, 0.1)',
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                boxShadow: mode === 'dark' 
                  ? '0px 2px 4px rgba(0, 0, 0, 0.4)' 
                  : '0px 2px 4px rgba(0, 0, 0, 0.1)',
              },
            },
          },
        },
        breakpoints: {
          values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ThemeConfig;
