import { useState, useEffect } from "react";
import {
	Container,
	Typography,
	Box,
	Paper,
	Avatar,
	Grid,
	Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { History, Logout } from "@mui/icons-material";
import PaymentIcon from "@mui/icons-material/Payment";

const Account = () => {
	const [user, setUser] = useState({
		username: "",
		email: "",
		fullName: "",
		joinDate: "",
		accountType: "",
		profilePicture: "",
	});
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUserData = async () => {
			const token = localStorage.getItem("token");
			if (token) {
				try {
					const response = await fetch("http://127.0.0.1:5000/user", {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					});
					if (response.ok) {
						const data = await response.json();
						setUser({
							username: data.username,
							email: data.email,
							fullName: `${data.firstname} ${data.lastname}`,
							joinDate: "January 15, 2023", // Replace with actual join date if available
							accountType: "Premium", // Replace with actual account type if available
							profilePicture: "https://randomuser.me/api/portraits/men/1.jpg", // Replace with actual profile picture if available
						});
					} else {
						// Handle the case where the token is invalid or expired
						localStorage.removeItem("token");
						navigate("/login");
					}
				} catch (error) {
					console.error("Error fetching user data:", error);
				}
			} else {
				navigate("/login");
			}
		};

		fetchUserData();
	}, [navigate]);

	const InfoItem = ({ label, value }) => (
		<Box sx={{ mb: 2 }}>
			<Typography variant="subtitle2" color="text.secondary">
				{label}
			</Typography>
			<Typography variant="body1">{value}</Typography>
		</Box>
	);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("username");
		navigate("/login");
		window.location.reload();
	};

	const AccountSection = ({ title, icon, action, onClick }) => (
		<Paper
			elevation={2}
			sx={{ p: 2, display: "flex", alignItems: "center", mb: 2 }}
		>
			<Box sx={{ mr: 2 }}>{icon}</Box>
			<Typography variant="h6" sx={{ flexGrow: 1 }}>
				{title}
			</Typography>
			<Button
				variant="outlined"
				size="small"
				startIcon={<EditIcon />}
				onClick={onClick}
			>
				{action}
			</Button>
		</Paper>
	);

	return (
		<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
			<Typography
				variant="h4"
				gutterBottom
				sx={{ mb: 4, fontWeight: "bold", color: "text.primary" }}
			>
				Account Management
			</Typography>
			<Grid container spacing={4}>
				<Grid item xs={12} md={4}>
					<Paper
						className="elevated"
						sx={{
							p: 3,
							textAlign: "center",
							borderRadius: 2,
							transition: "all 0.3s ease-in-out",
						}}
					>
						<Avatar
							src={user.profilePicture}
							sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
						/>
						<Typography variant="h5" gutterBottom>
							{user.fullName}
						</Typography>
						<Typography variant="subtitle1" color="text.secondary" gutterBottom>
							@{user.username}
						</Typography>
						<Button
							variant="contained"
							startIcon={<EditIcon />}
							sx={{ mt: 2 }}
							onClick={() => navigate("/edit-profile")}
						>
							Edit Profile
						</Button>
					</Paper>
				</Grid>
				<Grid item xs={12} md={8}>
					<Paper
						className="elevated"
						sx={{
							p: 3,
							mb: 3,
							borderRadius: 2,
							transition: "all 0.3s ease-in-out",
						}}
					>
						<Typography variant="h6" gutterBottom>
							Account Information
						</Typography>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<InfoItem label="Email" value={user.email} />
								<InfoItem label="Account Type" value={user.accountType} />
							</Grid>
							<Grid item xs={12} sm={6}>
								<InfoItem label="Member Since" value={user.joinDate} />
								<InfoItem label="Last Login" value="2 hours ago" />
							</Grid>
						</Grid>
					</Paper>
					<AccountSection
						title="Payment Methods"
						icon={<PaymentIcon color="primary" />}
						action="Manage"
						onClick={() => navigate("/wallet")}
					/>
					<AccountSection
						title="Logout"
						icon={<Logout color="primary" />}
						action="Log Out"
						onClick={handleLogout}
					/>
				</Grid>
			</Grid>
		</Container>
	);
};

export default Account;
