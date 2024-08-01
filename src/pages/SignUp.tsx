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
	Stepper,
	Step,
	StepLabel,
	useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import axios from "axios";

const steps = [
	"Account Information",
	"Personal Information",
	"Address Information",
	"Financial Information",
];

const SignUp = () => {
	const [activeStep, setActiveStep] = useState(0);
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
		firstName: "",
		lastName: "",
		dateOfBirth: "",
		address: "",
		city: "",
		state: "",
		zipCode: "",
		ssn: "",
		bankName: "",
		bankAccountNumber: "",
		initialBalance: "",
	});
	const [error, setError] = useState<String>(null);
	const navigate = useNavigate();
	const theme = useTheme();

	const handleChange =
		(prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
			setFormData({ ...formData, [prop]: event.target.value });
		};

	const handleNext = () => {
		if (activeStep === steps.length - 1) {
			handleSignUp();
		} else {
			setActiveStep((prevActiveStep) => prevActiveStep + 1);
		}
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleSignUp = async () => {
		try {
			const response = await axios.post("http://127.0.0.1:5000/register", {
				username: formData.username,
				password: formData.password,
				email: formData.email,
				firstname: formData.firstName,
				lastname: formData.lastName,
				dob: formData.dateOfBirth,
				address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
				tin: formData.ssn,
				bank_name: formData.bankName,
				bank_account_no: formData.bankAccountNumber,
				account_balance: parseFloat(formData.initialBalance),
			});

			console.log("User registered:", response.data);
			navigate("/login");
		} catch (error: any) {
			console.error(
				"Registration error:",
				error.response ? error.response.data : error.message
			);
			setError("Registration failed. Please try again.");
		}
	};

	const getStepContent = (step: number) => {
		switch (step) {
			case 0:
				return (
					<>
						<TextField
							margin="normal"
							required
							fullWidth
							id="username"
							label="Username"
							name="username"
							autoComplete="username"
							value={formData.username}
							onChange={handleChange("username")}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							value={formData.email}
							onChange={handleChange("email")}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="new-password"
							value={formData.password}
							onChange={handleChange("password")}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="confirmPassword"
							label="Confirm Password"
							type="password"
							id="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleChange("confirmPassword")}
						/>
					</>
				);
			case 1:
				return (
					<>
						<TextField
							margin="normal"
							required
							fullWidth
							id="firstName"
							label="First Name"
							name="firstName"
							value={formData.firstName}
							onChange={handleChange("firstName")}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							id="lastName"
							label="Last Name"
							name="lastName"
							value={formData.lastName}
							onChange={handleChange("lastName")}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							id="dateOfBirth"
							label="Date of Birth"
							name="dateOfBirth"
							type="date"
							InputLabelProps={{
								shrink: true,
							}}
							value={formData.dateOfBirth}
							onChange={handleChange("dateOfBirth")}
						/>
					</>
				);
			case 2:
				return (
					<>
						<TextField
							margin="normal"
							required
							fullWidth
							id="address"
							label="Address"
							name="address"
							value={formData.address}
							onChange={handleChange("address")}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							id="city"
							label="City"
							name="city"
							value={formData.city}
							onChange={handleChange("city")}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							id="state"
							label="State"
							name="state"
							value={formData.state}
							onChange={handleChange("state")}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							id="zipCode"
							label="Zip Code"
							name="zipCode"
							value={formData.zipCode}
							onChange={handleChange("zipCode")}
						/>
					</>
				);
			case 3:
				return (
					<>
						<TextField
							margin="normal"
							required
							fullWidth
							id="ssn"
							label="Social Security Number (SSN)"
							name="ssn"
							value={formData.ssn}
							onChange={handleChange("ssn")}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							id="bankName"
							label="Bank Name"
							name="bankName"
							value={formData.bankName}
							onChange={handleChange("bankName")}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							id="bankAccountNumber"
							label="Bank Account Number"
							name="bankAccountNumber"
							value={formData.bankAccountNumber}
							onChange={handleChange("bankAccountNumber")}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							id="initialBalance"
							label="Initial Account Balance"
							name="initialBalance"
							type="number"
							value={formData.initialBalance}
							onChange={handleChange("initialBalance")}
						/>
					</>
				);
			default:
				return "Unknown step";
		}
	};

	return (
		<Container
			component="main"
			maxWidth="sm"
			sx={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Paper
				elevation={6}
				sx={{
					p: 4,
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
					<PersonAddIcon
						sx={{ fontSize: 40, mb: 2, color: theme.palette.primary.main }}
					/>
					<Typography
						component="h1"
						variant="h5"
						sx={{ color: "text.primary", mb: 3 }}
					>
						Sign Up
					</Typography>
					<Stepper
						activeStep={activeStep}
						alternativeLabel
						sx={{ width: "100%", mb: 4 }}
					>
						{steps.map((label) => (
							<Step key={label}>
								<StepLabel>{label}</StepLabel>
							</Step>
						))}
					</Stepper>
					<Box component="form" sx={{ mt: 1, width: "100%" }}>
						{getStepContent(activeStep)}
						{error && (
							<Typography color="error" sx={{ mt: 2 }}>
								{error}
							</Typography>
						)}
						<Box
							sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
						>
							<Button
								onClick={handleBack}
								disabled={activeStep === 0}
								sx={{
									color: theme.palette.text.secondary,
									"&:hover": {
										backgroundColor: theme.palette.action.hover,
									},
								}}
							>
								Back
							</Button>
							<Button
								variant="contained"
								color="primary"
								onClick={handleNext}
								sx={{
									py: 1,
									px: 3,
									fontSize: "1rem",
									"&:hover": {
										backgroundColor: theme.palette.primary.dark,
									},
								}}
							>
								{activeStep === steps.length - 1 ? "Sign Up" : "Next"}
							</Button>
						</Box>
					</Box>
					<Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
						<Grid item>
							<Link
								href="/login"
								variant="body2"
								sx={{
									color: theme.palette.primary.main,
									"&:hover": {
										color: theme.palette.primary.light,
									},
								}}
							>
								Already have an account? Sign in
							</Link>
						</Grid>
					</Grid>
				</Box>
			</Paper>
		</Container>
	);
};

export default SignUp;
