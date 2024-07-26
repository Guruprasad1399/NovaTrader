import { useEffect, useState } from 'react';
import { Container, Typography, Box, TextField, Button, TableRow, TableCell, IconButton, Collapse, TableContainer, Table, TableHead, TableBody, Paper, Switch, FormControlLabel } from '@mui/material';
import { useQueries } from 'react-query';
import axios from 'axios';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const API_KEY = 'xxx';
const DEFAULT_STOCKS = ['msft', 'tsla', 'ibm', 'race'];
const COLORS = ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#FF5722'];
const MAX_DATA_POINTS = 600;

interface StockData {
    symbol: string;
    price: number;
    time: number;
}

const fetchStockPrice = async (symbol: string): Promise<StockData> => {
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';
    const apiUrl = `https://echios.tech/price/${symbol}?apikey=${API_KEY}`;
    const response = await axios.get(corsProxy + apiUrl);
    return {
        symbol: response.data.symbol,
        price: response.data.price,
        time: response.data.time,
    };
};

const StockRow = ({ stock, color, data }: { stock: string; color: string; data: StockData[] }) => {
    const [open, setOpen] = useState(false);
    const [isAreaChart, setIsAreaChart] = useState(true);
    const navigate = useNavigate();

    const latestData = data[data.length - 1];

    const handleBuySell = () => {
        navigate(`/stock/${stock}`);
    };

    const ChartComponent = isAreaChart ? AreaChart : LineChart;
    const DataComponent = isAreaChart ? Area : Line;

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    <Typography variant="body1" sx={{ color: color, fontWeight: 'bold' }}>
                        {stock.toUpperCase()}
                    </Typography>
                </TableCell>
                <TableCell align="right">{latestData?.quantity || '-'}</TableCell>
                <TableCell align="right">${latestData?.price.toFixed(2)}</TableCell>
                <TableCell align="right">${((latestData?.price || 0) * (latestData?.quantity || 0)).toFixed(2)}</TableCell>
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
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" component="div">
                                    Live Graph
                                </Typography>
                                <FormControlLabel
                                    control={<Switch checked={isAreaChart} onChange={() => setIsAreaChart(!isAreaChart)} />}
                                    label={isAreaChart ? "Area Chart" : "Line Chart"}
                                />
                            </Box>
                            <ResponsiveContainer width="100%" height={200}>
                                <ChartComponent data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" tick={false} />
                                    <YAxis
                                        domain={['auto', 'auto']}
                                        tick={{ fontSize: 10 }}
                                        tickFormatter={(value) => `$${value.toFixed(0)}`}
                                    />
                                    <Tooltip
                                        labelFormatter={(value) => new Date(value * 1000).toLocaleString()}
                                        formatter={(value) => [`$${Number(value).toFixed(2)}`, stock.toUpperCase()]}
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
    const [stocksData, setStocksData] = useState<{ [key: string]: StockData[] }>({});
    const [searchStock, setSearchStock] = useState('');
    const [searchedStocks, setSearchedStocks] = useState<string[]>([]);

    const allStocks = [...DEFAULT_STOCKS, ...searchedStocks];

    const queries = useQueries(
        allStocks.map(stock => ({
            queryKey: ['stockPrice', stock],
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
                        [stock]: trimmedData
                    };
                });
            }
        });
    }, [queries, allStocks]);

    const handleSearch = () => {
        if (searchStock && !allStocks.includes(searchStock.toLowerCase())) {
            setSearchedStocks(prev => [...prev, searchStock.toLowerCase()]);
            setSearchStock('');
        }
    };

    const filteredStocks = allStocks.filter(stock =>
        stock.toLowerCase().includes(searchStock.toLowerCase())
    );

    return (
        <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <Container maxWidth="xl">
                <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: '#333' }}>
                    Trade Activity
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex' }}>
                        <TextField
                            label="Search"
                            variant="outlined"
                            value={searchStock}
                            onChange={(e) => setSearchStock(e.target.value)}
                            sx={{ mr: 2 }}
                        />
                    </Box>
                </Box>
                <TableContainer component={Paper} sx={{ backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)' }}>
                    <Table sx={{ minWidth: 650 }} aria-label="stock table">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                                <TableCell />
                                <TableCell>Trade</TableCell>
                                <TableCell align="right">Quantity</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Your Profits</TableCell>
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