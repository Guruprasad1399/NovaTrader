import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
	Container,
	Typography,
	Box,
	Paper,
	Button,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Grid,
	Divider,
	Snackbar,
	useTheme,
} from "@mui/material";
import axios from "axios";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useWallet } from "../contexts/WalletContext";

interface StockHolding {
	net_qty: number;
	net_value: number;
	averagePrice?: number; // Adding optional as it might not be directly available
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref
) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const buyStock = async (stockData: any) => {
	const token = localStorage.getItem("token");
	if (!token) {
		throw new Error("No token found. Please log in.");
	}

	const response = await axios.post(
		"http://127.0.0.1:5000/buy_stock",
		stockData,
		{
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		}
	);
	return response.data;
};

const sellStock = async (stockData: any) => {
	const token = localStorage.getItem("token");
	const response = await axios.post(
		"http://127.0.0.1:5000/sell_stock",
		stockData,
		{
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		}
	);
	return response.data;
};

const placeLimitOrder = async (orderData: any) => {
	const token = localStorage.getItem("token");
	const response = await axios.post(
		"http://127.0.0.1:5000/order_limit",
		orderData,
		{
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		}
	);
	return response.data;
};

const StockDetail: React.FC = () => {
	const theme = useTheme();
	const { symbol } = useParams<{ symbol: string }>();
	const navigate = useNavigate();
	const location = useLocation();
	console.log("Initial price:", location.state);
	const initialPrice = location.state?.initialPrice || 0;
	const holding: StockHolding = location.state?.holding || {
		net_qty: 0,
		net_value: 0,
	};

	// Calculate averagePrice if not available directly in holding
	holding.averagePrice =
		holding.net_qty > 0 ? holding.net_value / holding.net_qty : 0;

	const { balance } = useWallet();

	const [quantity, setQuantity] = useState<number>(0);
	const [orderType, setOrderType] = useState<string>("market");
	const [limitPrice, setLimitPrice] = useState<number | "">("");
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	const stockIds = { ibm: 0, msft: 1, tsla: 2, race: 3 };
	const stockId = stockIds[symbol?.toLowerCase() as keyof typeof stockIds];

	const currentPrice = initialPrice;
	console.log("Current price:", holding.net_qty);
	const profitLoss =
		holding.net_qty > 0
			? (currentPrice - holding.averagePrice!) * holding.net_qty
			: 0;
	const profitLossPercentage =
		holding.net_qty > 0
			? ((currentPrice - holding.averagePrice!) / holding.averagePrice!) * 100
			: 0;

	const handlePlaceOrder = async (action: "buy" | "sell") => {
		let message = "";
		try {
			const stockData = {
				stock_id: stockId,
				qty: quantity,
				price: currentPrice,
			};

			const userId = localStorage.getItem("userId"); // Get user ID from local storage
			if (!userId) {
				throw new Error("User ID not found. Please log in.");
			}

			if (orderType === "market") {
				if (action === "buy") {
					if (balance < currentPrice * quantity) {
						message = `Insufficient funds to buy ${quantity} shares of ${symbol?.toUpperCase()}.`;
						setSnackbarMessage(message);
						setOpenSnackbar(true);
						return;
					}
					await buyStock(stockData);
				} else {
					await sellStock(stockData);
				}
				message = `${action.toUpperCase()} order filled for ${quantity} shares of ${symbol?.toUpperCase()} at market price.`;
			} else {
				await placeLimitOrder({
					user_id: userId,
					stock_id: stockId,
					qty: quantity,
					price: limitPrice,
					order_type: orderType,
				});
				message = `${action.toUpperCase()} order placed for ${quantity} shares of ${symbol?.toUpperCase()} at limit price $${limitPrice}.`;
			}
		} catch (error) {
			message = `Error placing ${action} order.`;
		}
		setSnackbarMessage(message);
		setOpenSnackbar(true);

		setTimeout(() => {
			navigate("/");
		}, 1500);
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

	return (
		<Container maxWidth="lg" sx={{ mt: 4 }}>
			<Button
				onClick={() => navigate("/")}
				sx={{
					mb: 2,
					color: "text.secondary",
					"&:hover": {
						color: "text.primary",
					},
				}}
			>
				Back to Home
			</Button>
			<Grid container spacing={3}>
				<Grid item xs={12} md={8}>
					<Paper
						elevation={3}
						className="elevated"
						sx={{
							p: 3,
							borderRadius: 2,
							transition: "all 0.3s ease-in-out",
							"&:hover": {
								transform: "translateY(-5px)",
							},
						}}
					>
						<Typography variant="h4" gutterBottom color="text.primary">
							{symbol?.toUpperCase()} Stock Details
						</Typography>
						<Typography
							variant="h3"
							sx={{ fontWeight: "bold", mb: 2, color: "text.primary" }}
						>
							${currentPrice.toFixed(2)}
						</Typography>
						<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
							{profitLoss >= 0 ? (
								<TrendingUpIcon color="success" />
							) : (
								<TrendingDownIcon color="error" />
							)}
							<Typography
								color={profitLoss >= 0 ? "success.main" : "error.main"}
								sx={{ ml: 1 }}
							>
								{holding.net_qty > 0
									? `${profitLossPercentage.toFixed(2)}% (${
											profitLoss >= 0 ? "+" : ""
									  }$${profitLoss.toFixed(2)})`
									: "-"}
							</Typography>
						</Box>
						<Divider sx={{ my: 2, bgcolor: "rgba(255, 255, 255, 0.12)" }} />
						{holding.net_qty > 0 && (
							<Box sx={{ mt: 3 }}>
								<Typography variant="h6" gutterBottom color="text.primary">
									Your Holdings
								</Typography>
								<Grid container spacing={2}>
									<Grid item xs={6}>
										<Typography variant="body2" color="text.secondary">
											Quantity
										</Typography>
										<Typography variant="h6" color="text.primary">
											{holding.net_qty}
										</Typography>
									</Grid>
									<Grid item xs={6}>
										<Typography variant="body2" color="text.secondary">
											Average Buy Price
										</Typography>
										<Typography variant="h6" color="text.primary">
											{holding.averagePrice
												? `$${holding.averagePrice.toFixed(2)}`
												: "-"}
										</Typography>
									</Grid>
								</Grid>
							</Box>
						)}
					</Paper>
				</Grid>
				<Grid item xs={12} md={4}>
					<Paper
						elevation={3}
						className="elevated"
						sx={{
							p: 3,
							borderRadius: 2,
							transition: "all 0.3s ease-in-out",
							"&:hover": {
								transform: "translateY(-5px)",
							},
						}}
					>
						<Typography variant="h5" gutterBottom color="text.primary">
							Place Order
						</Typography>
						<FormControl fullWidth sx={{ mb: 2 }}>
							<InputLabel>Order Type</InputLabel>
							<Select
								value={orderType}
								label="Order Type"
								onChange={(e) => setOrderType(e.target.value as string)}
							>
								<MenuItem value="market">Market</MenuItem>
								<MenuItem value="limit">Limit</MenuItem>
							</Select>
						</FormControl>
						<TextField
							fullWidth
							label="Quantity"
							type="number"
							value={quantity}
							onChange={(e) => setQuantity(Number(e.target.value))}
							sx={{ mb: 2 }}
						/>
						{orderType === "limit" && (
							<TextField
								fullWidth
								label="Limit Price"
								type="number"
								value={limitPrice}
								onChange={(e) => setLimitPrice(Number(e.target.value))}
								sx={{ mb: 2 }}
							/>
						)}
						<Box sx={{ display: "flex", gap: 2 }}>
							<Button
								fullWidth
								variant="contained"
								color="success"
								onClick={() => handlePlaceOrder("buy")}
								disabled={
									quantity <= 0 || (orderType === "limit" && !limitPrice)
								}
							>
								Buy
							</Button>
							<Button
								fullWidth
								variant="contained"
								color="error"
								onClick={() => handlePlaceOrder("sell")}
								disabled={
									quantity <= 0 || (orderType === "limit" && !limitPrice)
								}
							>
								Sell
							</Button>
						</Box>
					</Paper>
				</Grid>
			</Grid>
			<Snackbar
				open={openSnackbar}
				onClose={handleCloseSnackbar}
				autoHideDuration={3000}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbarMessage.includes("Error") ? "error" : "success"}
					sx={{ width: "100%" }}
				>
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</Container>
	);
};

export default StockDetail;
