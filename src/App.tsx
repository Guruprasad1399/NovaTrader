import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Account from "./pages/Account";
import Navbar from "./components/NavBar";
import SignUp from "./pages/SignUp";
import ForgotUsername from "./pages/ForgotUsername";
import StockDetail from "./pages/StockDetail";
import { WalletProvider } from "./contexts/WalletContext";
import Wallet from "./pages/Wallet";
import OrderHistory from "./pages/OrderHistory";

const queryClient = new QueryClient();

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setIsLoggedIn(true);
		}
	}, []);

	const handleLogin = () => {
		setIsLoggedIn(true);
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("username");
		setIsLoggedIn(false);
		navigate("/login");
	};

	return (
		<QueryClientProvider client={queryClient}>
			<WalletProvider>
				<Box
					sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
				>
					<Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
					<Box component="main" sx={{ flexGrow: 1, width: "100%" }}>
						<Routes>
							<Route
								path="/login"
								element={
									isLoggedIn ? (
										<Navigate to="/" />
									) : (
										<Login onLogin={handleLogin} />
									)
								}
							/>
							<Route path="/signup" element={<SignUp />} />
							<Route path="/forgot-username" element={<ForgotUsername />} />
							<Route
								path="/"
								element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
							/>
							<Route
								path="/account"
								element={isLoggedIn ? <Account /> : <Navigate to="/login" />}
							/>
							<Route
								path="/wallet"
								element={isLoggedIn ? <Wallet /> : <Navigate to="/login" />}
							/>
							<Route
								path="/orderHistory"
								element={
									isLoggedIn ? <OrderHistory /> : <Navigate to="/login" />
								}
							/>
							<Route
								path="/stock/:symbol"
								element={
									isLoggedIn ? <StockDetail /> : <Navigate to="/login" />
								}
							/>
						</Routes>
					</Box>
				</Box>
			</WalletProvider>
		</QueryClientProvider>
	);
};

export default App;
