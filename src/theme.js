import { createTheme } from '@mui/material/styles';

const UITheme = createTheme({
    palette: {
        primary: {
            main: '#ca142a',
            light: '#e54855',
            dark: '#8f0e1d',
        },
        secondary: {
            main: '#00285E',
            light: '#33507f',
            dark: '#001c42',
        },
        background: {
            default: '#F5F5F5',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#333333',
            secondary: '#666666',
        },
        error: {
            main: '#d32f2f',
        },
        warning: {
            main: '#ffa000',
        },
        info: {
            main: '#1976d2',
        },
        success: {
            main: '#388e3c',
        },
    },
    typography: {
        fontFamily: '"Arial", "Helvetica", sans-serif',
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 600,
        },
        h3: {
            fontWeight: 600,
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 4,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
    },
});

export default UITheme;