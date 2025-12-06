import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",   

    primary: {
      main: "#b4b2b2ff", 
    },
    secondary: {
      main: "#ff5722", 
    },
    
    background: {
      default: "#fffdfdff",
      paper: "#969595ff",
    },

    text: {
      primary: "#0f0e0eff",
      secondary: "#bbbbbb",
    },
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#846d6dff",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
