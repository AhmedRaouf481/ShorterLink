import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material';
import { style } from './global/style';

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: style.white,
          },

        }
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          overflow: 'auto',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: style.white,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: style.light_blue,

          },
        },
      },
    },
  },

  typography: {
    body1: {
      color: style.white,
    },
    fontFamily: "'Poppins', sans-serif"
  },
  palette: {
    primary: {
      main: style.yellow
    },
    secondary: {
      main: style.dark_blue
    },
    info: {
      main: style.light_blue
    },
    text: {
      primary: style.white
      , secondary: style.white
    },
    mode: 'dark',



  }
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>

      <App />
    </ThemeProvider>
  </React.StrictMode>
);
