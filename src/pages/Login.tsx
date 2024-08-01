import { useState } from "react";
import {
	Container,
	TextField,
	Button,
	Typography,
	Box,
	Link,
	Grid,
	Paper,
	useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }: any) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const theme = useTheme();

	const handleLogin = async () => {
		try {
			const response = await fetch("http://127.0.0.1:5000/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			});

			if (response.ok) {
				const data = await response.json();
				localStorage.setItem("token", data.token);
				localStorage.setItem("username", data.username);
				localStorage.setItem("userId", data.id);
				onLogin();
				navigate("/");
			} else {
				const errorData = await response.json();
				setError(errorData.error);
			}
		} catch (error) {
			setError("An error occurred. Please try again.");
		}
	};

	return (
		<Container
			component="main"
			maxWidth="xs"
			sx={{
				height: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Paper
				elevation={6}
				sx={{
					p: 3,
					width: "100%",
					borderRadius: 2,
					backgroundColor: "background.paper",
					transition: "all 0.3s ease-in-out",
					"&:hover": {
						transform: "translateY(-5px)",
						boxShadow: theme.shadows[10],
					},
				}}
			>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Typography
						component="h1"
						variant="h5"
						sx={{ color: "text.primary", mb: 3 }}
					>
						Sign In
					</Typography>

					<Box component="form" sx={{ mt: 1, width: "100%" }}>
						<TextField
							margin="normal"
							required
							fullWidth
							id="username"
							label="Username"
							name="username"
							autoComplete="username"
							autoFocus
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							sx={{ mb: 2 }}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							sx={{ mb: 2 }}
						/>
						{error && (
							<Typography color="error" sx={{ mt: 2, mb: 2 }}>
								{error}
							</Typography>
						)}
						<Button
							type="button"
							fullWidth
							variant="contained"
							color="primary"
							sx={{
								mt: 3,
								mb: 2,
								py: 1.5,
								fontSize: "1.1rem",
								"&:hover": {
									backgroundColor: theme.palette.primary.dark,
								},
							}}
							onClick={handleLogin}
						>
							Sign In
						</Button>
						<Grid container spacing={2} sx={{ mt: 2 }}>
							<Grid item xs={12} sm={6}>
								<Link
									href="/forgot-username"
									variant="body2"
									sx={{
										color: theme.palette.primary.main,
										"&:hover": {
											color: theme.palette.primary.light,
										},
									}}
								>
									Forgot username?
								</Link>
							</Grid>
							<Grid item xs={12} sm={6} sx={{ textAlign: { sm: "right" } }}>
								<Link
									href="/signup"
									variant="body2"
									sx={{
										color: theme.palette.primary.main,
										"&:hover": {
											color: theme.palette.primary.light,
										},
									}}
								>
									Don't have an account? Sign Up
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Paper>
		</Container>
	);
};

export default Login;
