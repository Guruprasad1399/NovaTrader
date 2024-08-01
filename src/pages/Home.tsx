import React, { useEffect, useState } from "react";
import {
	Container,
	Typography,
	Box,
	TextField,
	Button,
	TableRow,
	TableCell,
	IconButton,
	Collapse,
	TableContainer,
	Table,
	TableHead,
	TableBody,
	Paper,
	Switch,
	FormControlLabel,
	useTheme,
} from "@mui/material";
import { useQueries } from "react-query";
import axios from "axios";
import {
	LineChart,
	Line,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import NewsTicker from "./NewsTicker";
import Logo from "../assets/NovaTrader.png";
import NomuraLogo from "../assets/Nomura-Logo.png"; // Ensure you import your logo

const API_KEY = "GRP01XABS0LVE";
const DEFAULT_STOCKS = ["msft", "tsla", "ibm", "race"];
const COLORS = ["#4CAF50", "#2196F3", "#FFC107", "#9C27B0", "#FF5722"];
const MAX_DATA_POINTS = 600;

interface StockData {
	symbol: string;
	price: number;
	time: number;
}

const stockIds = { ibm: 0, msft: 1, tsla: 2, race: 3 };

const fetchStockPrice = async (symbol: string): Promise<StockData> => {
	const corsProxy = "https://cors-anywhere.herokuapp.com/";
	const apiUrl = `https://echios.tech/price/${symbol}?apikey=${API_KEY}`;
	const response = await axios.get(corsProxy + apiUrl);
	return {
		symbol: response.data.symbol,
		price: response.data.price,
		time: response.data.time,
	};
};

const fetchUserPortfolio = async (userId: string | null) => {
	const token = localStorage.getItem("token");
	const response = await axios.get(
		`http://127.0.0.1:5000/user/${userId}/portfolio`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);
	return response.data;
};

const StockRow = ({
	stock,
	color,
	data,
	isExpanded,
	setExpandedRows,
	holding,
}: {
	stock: string;
	color: string;
	data: StockData[];
	isExpanded: boolean;
	setExpandedRows: (stock: string, isOpen: boolean) => void;
	holding?: any;
}) => {
	const [open, setOpen] = useState(isExpanded);
	const [isAreaChart, setIsAreaChart] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		setOpen(isExpanded);
	}, [isExpanded]);

	const latestData = data[data.length - 1];

	const handleBuySell = () => {
		console.log("Buy/Sell clicked for", holding);
		navigate(`/stock/${stock}`, {
			state: { initialPrice: latestData?.price, holding },
		});
	};

	const ChartComponent = isAreaChart ? AreaChart : LineChart;
	const DataComponent = isAreaChart ? Area : Line;

	return (
		<>
			<TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
				<TableCell>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => {
							setOpen(!open);
							setExpandedRows(stock, !open);
						}}
					>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell component="th" scope="row">
					<Typography variant="body1" sx={{ color: color, fontWeight: "bold" }}>
						{stock.toUpperCase()}
					</Typography>
				</TableCell>
				<TableCell align="right">{holding?.net_qty || "-"}</TableCell>
				<TableCell align="right">${latestData?.price.toFixed(2)}</TableCell>
				<TableCell align="right">
					${((latestData?.price || 0) * (holding?.net_qty || 0)).toFixed(2)}
				</TableCell>
				<TableCell align="right">
					<Button variant="contained" color="primary" onClick={handleBuySell}>
						Buy/Sell
					</Button>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									mb: 2,
								}}
							>
								<Typography variant="h6" component="div">
									Live Graph
								</Typography>
								<FormControlLabel
									control={
										<Switch
											checked={isAreaChart}
											onChange={() => setIsAreaChart(!isAreaChart)}
										/>
									}
									label={isAreaChart ? "Area Chart" : "Line Chart"}
								/>
							</Box>
							<ResponsiveContainer width="100%" height={200}>
								<ChartComponent data={data}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="time" tick={false} />
									<YAxis
										domain={["auto", "auto"]}
										tick={{ fontSize: 10 }}
										tickFormatter={(value) => `$${value.toFixed(0)}`}
									/>
									<Tooltip
										labelFormatter={(value) =>
											new Date(value * 1000).toLocaleString()
										}
										formatter={(value, name, props) => [
											`$${Number(value).toFixed(2)}`,
											stock.toUpperCase(),
											<span style={{ color: "#fff" }}>
												{new Date(props.payload.time * 1000).toLocaleString()}
											</span>,
										]}
										contentStyle={{
											backgroundColor: "#1A1A1A",
											borderRadius: "8px",
											border: "1px solid #333",
											color: "#fff",
										}}
									/>
									<DataComponent
										type="monotone"
										dataKey="price"
										stroke={color}
										fill={isAreaChart ? color : undefined}
										fillOpacity={0.3}
										dot={false}
										strokeWidth={2}
									/>
								</ChartComponent>
							</ResponsiveContainer>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
};

const Home = () => {
	const theme = useTheme();
	const [userId, setUserId] = useState(localStorage.getItem("userId")); // Get user ID from local storage
	const [stocksData, setStocksData] = useState<{ [key: string]: StockData[] }>(
		{}
	);
	const [searchStock, setSearchStock] = useState("");
	const [searchedStocks, setSearchedStocks] = useState<string[]>([]);
	const [expandedRows, setExpandedRowsState] = useState<{
		[key: string]: boolean;
	}>({});
	const [portfolio, setPortfolio] = useState({}); // State to hold user portfolio data

	const allStocks = [...DEFAULT_STOCKS, ...searchedStocks];

	const queries = useQueries(
		allStocks.map((stock) => ({
			queryKey: ["stockPrice", stock],
			queryFn: () => fetchStockPrice(stock),
			refetchInterval: 2000,
		}))
	);

	useEffect(() => {
		queries.forEach((query, index) => {
			if (query.data) {
				const stock = allStocks[index];
				setStocksData((prevData: any) => {
					const updatedStockData = [...(prevData[stock] || []), query.data];
					const trimmedData = updatedStockData.slice(-MAX_DATA_POINTS);
					return {
						...prevData,
						[stock]: trimmedData,
					};
				});
			}
		});
	}, [queries, allStocks]);

	// Fetch user portfolio
	useEffect(() => {
		const fetchPortfolio = async () => {
			try {
				const data = await fetchUserPortfolio(userId);
				setPortfolio(
					data.reduce((acc, item) => {
						acc[item.stock_id] = item;
						return acc;
					}, {})
				);
			} catch (error) {
				console.error("Error fetching portfolio:", error);
			}
		};

		if (userId) {
			fetchPortfolio();
		}
	}, [userId]);

	const filteredStocks = allStocks.filter((stock) =>
		stock.toLowerCase().includes(searchStock.toLowerCase())
	);

	const expandAllRows = () => {
		const newExpandedRows = filteredStocks.reduce((acc, stock) => {
			acc[stock] = true;
			return acc;
		}, {} as { [key: string]: boolean });
		setExpandedRowsState(newExpandedRows);
	};

	const collapseAllRows = () => {
		setExpandedRowsState({});
	};

	const toggleExpandAll = () => {
		const isAllExpanded = filteredStocks.every((stock) => expandedRows[stock]);
		isAllExpanded ? collapseAllRows() : expandAllRows();
	};

	return (
		<Box
			sx={{
				p: 3,
				bgcolor: "background.default",
				minHeight: "100vh",
				background: "linear-gradient(145deg, #121212 0%, #1A1A1A 100%)",
			}}
		>
			<NewsTicker
				style={{
					backgroundColor: "#1A1A1A",
					color: "#FFC107",
					padding: "10px",
					borderRadius: "8px",
					fontSize: "1.1rem",
					fontWeight: "bold",
				}}
			/>
			<Container maxWidth="xl" sx={{ pt: 3 }}>
				<Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
					<Typography
						variant="h4"
						gutterBottom
						sx={{ fontWeight: "bold", color: "text.primary" }}
					>
						Trade Activity
					</Typography>
				</Box>
				<Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
					<TextField
						label="Search"
						variant="outlined"
						value={searchStock}
						onChange={(e) => setSearchStock(e.target.value)}
						sx={{ mr: 2 }}
					/>
					<Button variant="contained" color="primary" onClick={toggleExpandAll}>
						{filteredStocks.every((stock) => expandedRows[stock])
							? "Collapse All"
							: "Expand All"}
					</Button>
				</Box>
				<TableContainer
					component={Paper}
					className="elevated"
					sx={{
						borderRadius: 2,
						transition: "box-shadow 0.3s ease-in-out",
						cursor: "pointer",
					}}
				>
					<Table sx={{ minWidth: 650 }} aria-label="stock table">
						<TableHead>
							<TableRow>
								<TableCell />
								<TableCell>Trade</TableCell>
								<TableCell align="right">Quantity</TableCell>
								<TableCell align="right">Price</TableCell>
								<TableCell align="right">Portfolio Worth</TableCell>
								<TableCell />
							</TableRow>
						</TableHead>
						<TableBody>
							{filteredStocks.map((stock, index) => (
								<StockRow
									key={stock}
									stock={stock}
									color={COLORS[index % COLORS.length]}
									data={stocksData[stock] || []}
									isExpanded={!!expandedRows[stock]}
									setExpandedRows={(stock, isOpen) => {
										setExpandedRowsState((prev) => ({
											...prev,
											[stock]: isOpen,
										}));
									}}
									holding={portfolio[stockIds[stock.toLowerCase()]]}
								/>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Container>
		</Box>
	);
};

export default Home;
