import { createTheme } from "@mui/material/styles";

const UITheme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#ca142a",
			light: "#e54855",
			dark: "#8f0e1d",
		},
		secondary: {
			main: "#4caf50",
			light: "#80e27e",
			dark: "#087f23",
		},
		background: {
			default: "#121212",
			paper: "#1E1E1E",
		},
		text: {
			primary: "#ffffff",
			secondary: "#b0b0b0",
		},
		error: {
			main: "#f44336",
		},
		warning: {
			main: "#ff9800",
		},
		info: {
			main: "#2196f3",
		},
		success: {
			main: "#4caf50",
		},
	},
	typography: {
		fontFamily: '"Roboto", "Arial", sans-serif',
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
		borderRadius: 8,
	},
	components: {
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundImage: "none",
					"&.elevated": {
						backgroundColor: "rgba(35, 35, 35, 0.9)",
						boxShadow: `
                  0 4px 8px 0 rgba(100, 100, 100, 0.2),
                  0 0 4px 0 rgba(150, 150, 150, 0.1),
                  inset 0 0 0 1px rgba(255, 255, 255, 0.05)
                `,
						"&:hover": {
							boxShadow: `
                    0 6px 12px 0 rgba(100, 100, 100, 0.3),
                    0 0 6px 0 rgba(150, 150, 150, 0.2),
                    inset 0 0 0 1px rgba(255, 255, 255, 0.1)
                  `,
						},
					},
				},
			},
		},
	},
});

export default UITheme;
