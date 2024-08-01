import React, { useState } from "react";
import {
	Container,
	Typography,
	Box,
	TextField,
	Button,
	Grid,
	Paper,
	Snackbar,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	useTheme,
} from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useWallet } from "../contexts/WalletContext";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const predefinedAmounts = [20, 50, 100, 1000];

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref
) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Wallet = () => {
	const { balance, addBalance } = useWallet();
	const [amount, setAmount] = useState("");
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [openDialog, setOpenDialog] = useState(false);
	const [dialogAmount, setDialogAmount] = useState(0);
	const theme = useTheme();

	const handleAddBalance = () => {
		const numAmount = parseFloat(amount);
		if (!isNaN(numAmount) && numAmount > 0) {
			setDialogAmount(numAmount);
			setOpenDialog(true);
		} else {
			setSnackbarMessage("Please enter a valid amount.");
			setOpenSnackbar(true);
		}
	};

	const handleConfirmAddBalance = () => {
		addBalance(dialogAmount);
		setSnackbarMessage(`Added $${dialogAmount.toFixed(2)} to your wallet.`);
		setOpenSnackbar(true);
		setAmount("");
		setOpenDialog(false);
	};

	const handleAddPredefinedAmount = (predefAmount: number) => {
		setDialogAmount(predefAmount);
		setOpenDialog(true);
	};

	const handleCloseSnackbar = (
		event?: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === "clickaway") {
			return;
		}
		setOpenSnackbar(false);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	return (
		<Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
			<Paper
				elevation={3}
				className="elevated"
				sx={{
					p: 4,
					borderRadius: 2,
					transition: "all 0.3s ease-in-out",
					"&:hover": {
						transform: "translateY(-5px)",
					},
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
					<AccountBalanceWalletIcon
						sx={{ fontSize: 40, mr: 2, color: theme.palette.primary.main }}
					/>
					<Typography variant="h4" gutterBottom sx={{ color: "text.primary" }}>
						Wallet
					</Typography>
				</Box>
				<Typography
					variant="h5"
					gutterBottom
					sx={{ color: "text.primary", mb: 3 }}
				>
					Current Balance:{" "}
					<span style={{ color: theme.palette.success.main }}>
						${balance.toFixed(2)}
					</span>
				</Typography>
				<Box sx={{ mt: 3 }}>
					<TextField
						fullWidth
						label="Amount"
						variant="outlined"
						type="number"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						sx={{ mb: 2 }}
					/>
					<Button
						fullWidth
						variant="contained"
						color="primary"
						onClick={handleAddBalance}
						sx={{
							py: 1.5,
							fontSize: "1.1rem",
							"&:hover": {
								backgroundColor: theme.palette.primary.dark,
							},
						}}
					>
						Add Amount
					</Button>
				</Box>
				<Grid container spacing={2} sx={{ mt: 3 }}>
					{predefinedAmounts.map((predefAmount) => (
						<Grid item xs={6} key={predefAmount}>
							<Button
								fullWidth
								variant="outlined"
								onClick={() => handleAddPredefinedAmount(predefAmount)}
								sx={{
									py: 1,
									"&:hover": {
										backgroundColor: theme.palette.action.hover,
									},
								}}
							>
								${predefAmount}
							</Button>
						</Grid>
					))}
				</Grid>
			</Paper>
			<Snackbar
				open={openSnackbar}
				autoHideDuration={3000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity="success"
					sx={{ width: "100%" }}
				>
					{snackbarMessage}
				</Alert>
			</Snackbar>
			<Dialog
				open={openDialog}
				onClose={handleCloseDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{"Confirm Deposit"}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Do you want to deposit ${dialogAmount.toFixed(2)} into NovaTransfer
						from your bank account?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog} color="primary">
						No
					</Button>
					<Button onClick={handleConfirmAddBalance} color="primary" autoFocus>
						Yes
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default Wallet;
