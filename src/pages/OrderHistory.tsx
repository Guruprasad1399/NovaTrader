import React, { useState, useEffect } from "react";
import {
	Container,
	Typography,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	Chip,
	useTheme,
	Box,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import { format } from "date-fns";
import axios from "axios";

interface Order {
	id: number;
	exchange_id: number;
	price: number;
	qty: number;
	status: string;
	stock_id: number;
	type: string;
	created_at: string;
}

const stockNames: { [key: number]: string } = {
	0: "IBM",
	1: "MSFT",
	2: "TSLA",
	3: "RACE",
};

const OrderHistory: React.FC = () => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const theme = useTheme();

	useEffect(() => {
		const fetchOrderHistory = async () => {
			try {
				const userId = localStorage.getItem("userId");
				const token = localStorage.getItem("token");
				const response = await axios.get(
					`http://127.0.0.1:5000/user/${userId}/order_history`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setOrders(response.data);
			} catch (error) {
				console.error("Error fetching order history:", error);
			}
		};

		fetchOrderHistory();
	}, []);

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "EXEC":
				return "success";
			case "open":
				return "warning";
			case "cancelled":
				return "error";
			default:
				return "default";
		}
	};

	const getStatusLabel = (status: string) => {
		switch (status) {
			case "EXEC":
				return "completed";
			case "open":
				return "open";
			default:
				return status;
		}
	};

	return (
		<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
			<Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
				<HistoryIcon
					sx={{ fontSize: 40, mr: 2, color: theme.palette.primary.main }}
				/>
				<Typography variant="h4" gutterBottom sx={{ color: "text.primary" }}>
					Order History
				</Typography>
			</Box>
			<Paper
				elevation={3}
				className="elevated"
				sx={{
					borderRadius: 2,
					overflow: "hidden",
					transition: "all 0.3s ease-in-out",
					"&:hover": {
						transform: "translateY(-5px)",
					},
				}}
			>
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell sx={{ fontWeight: "bold", color: "text.primary" }}>
									Transaction ID
								</TableCell>
								<TableCell sx={{ fontWeight: "bold", color: "text.primary" }}>
									Date
								</TableCell>
								<TableCell sx={{ fontWeight: "bold", color: "text.primary" }}>
									Stock
								</TableCell>
								<TableCell sx={{ fontWeight: "bold", color: "text.primary" }}>
									Type
								</TableCell>
								<TableCell
									align="right"
									sx={{ fontWeight: "bold", color: "text.primary" }}
								>
									Quantity
								</TableCell>
								<TableCell
									align="right"
									sx={{ fontWeight: "bold", color: "text.primary" }}
								>
									Price
								</TableCell>
								<TableCell sx={{ fontWeight: "bold", color: "text.primary" }}>
									Status
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{orders
								.sort(
									(a, b) =>
										new Date(b.created_at).getTime() -
										new Date(a.created_at).getTime()
								)
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((order) => (
									<TableRow
										key={order.id}
										sx={{ "&:hover": { backgroundColor: "action.hover" } }}
									>
										<TableCell sx={{ color: "text.secondary" }}>
											{order.id}
										</TableCell>
										<TableCell sx={{ color: "text.secondary" }}>
											{format(new Date(order.created_at), "yyyy-MM-dd HH:mm")}
										</TableCell>
										<TableCell sx={{ color: "text.secondary" }}>
											{stockNames[order.stock_id] || order.stock_id}
										</TableCell>
										<TableCell
											sx={{
												color:
													order.type === "BUY" ? "success.main" : "error.main",
												fontWeight: "bold",
											}}
										>
											{order.type.toUpperCase()}
										</TableCell>
										<TableCell align="right" sx={{ color: "text.secondary" }}>
											{order.qty}
										</TableCell>
										<TableCell
											align="right"
											sx={{ color: "text.primary", fontWeight: "bold" }}
										>
											${order.price.toFixed(2)}
										</TableCell>
										<TableCell>
											<Chip
												label={getStatusLabel(order.status)}
												color={
													getStatusColor(order.status) as
														| "success"
														| "warning"
														| "error"
														| "default"
												}
												size="small"
												sx={{ fontWeight: "bold" }}
											/>
										</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={orders.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
					sx={{ color: "text.secondary" }}
				/>
			</Paper>
		</Container>
	);
};

export default OrderHistory;
