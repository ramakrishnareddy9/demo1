import { createTheme } from '@mui/material/styles';

// Create Material UI theme
const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#f97316', // orange-500
      light: '#fb923c',
      dark: '#ea580c',
      contrastText: '#fff',
    },
    secondary: {
      main: '#a855f7', // purple-500
      light: '#c084fc',
      dark: '#9333ea',
      contrastText: '#fff',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
      contrastText: '#fff',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#fff',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#fff',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
      contrastText: '#fff',
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      disabled: '#9ca3af',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: '1rem',
    },
    subtitle2: {
      fontSize: '0.875rem',
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      fontSize: '0.875rem',
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
    },
    overline: {
      fontSize: '0.75rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        },
        outlined: {
          borderWidth: '2px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          borderRadius: '12px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#f97316',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        },
        elevation2: {
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        },
        elevation3: {
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
        },
        bar: {
          borderRadius: '4px',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1f2937',
          fontSize: '0.75rem',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: '0',
        },
      },
    },
  },
});


// Export dark theme variant
export const muiDarkTheme = createTheme({
  ...muiTheme,
  palette: {
    ...muiTheme.palette,
    mode: 'dark',
    primary: {
      main: '#fb923c', // orange-400
      light: '#fdba74',
      dark: '#f97316',
      contrastText: '#000',
    },
    secondary: {
      main: '#c084fc', // purple-400
      light: '#d8b4fe',
      dark: '#a855f7',
      contrastText: '#000',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
      disabled: '#64748b',
    },
  },
  components: {
    ...muiTheme.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.5)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default muiTheme;
