import { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Paper, TextField, Button, CircularProgress } from '@mui/material';
import { useQueries } from 'react-query';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SearchIcon from '@mui/icons-material/Search';

const API_KEY = 'xxxx';
const DEFAULT_STOCKS = ['ibm', 'msft', 'tsla', 'race'];
const COLORS = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6']; // Added an extra color for searched stock

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

const StockCard = ({ stock, color, data }: { stock: string; color: string; data: StockData[] }) => (
    <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom sx={{ color: color }}>
            {stock.toUpperCase()}
        </Typography>
        <Typography variant="h4" gutterBottom>
            ${data[data.length - 1]?.price.toFixed(2)}
        </Typography>
        <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="time"
                    tickFormatter={(unixTime) => new Date(unixTime * 1000).toLocaleTimeString()}
                    tick={{ fontSize: 12 }}
                />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} />
                <Tooltip
                    labelFormatter={(value) => new Date(value * 1000).toLocaleString()}
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, stock.toUpperCase()]}
                />
                <Line
                    type="monotone"
                    dataKey="price"
                    stroke={color}
                    dot={false}
                    strokeWidth={2}
                />
            </LineChart>
        </ResponsiveContainer>
    </Paper>
);

const Home = () => {
    const [stocksData, setStocksData] = useState<{ [key: string]: StockData[] }>({});
    const [searchStock, setSearchStock] = useState('');
    const [searchedStocks, setSearchedStocks] = useState<string[]>([]);

    const allStocks = [...DEFAULT_STOCKS, ...searchedStocks];

    const queries = useQueries(
        allStocks.map(stock => ({
            queryKey: ['stockPrice', stock],
            queryFn: () => fetchStockPrice(stock),
            refetchInterval: 5000, // Refetch every 5 seconds
        }))
    );

    useEffect(() => {
        queries.forEach((query, index) => {
            if (query.data) {
                const stock = allStocks[index];
                setStocksData(prevData => ({
                    ...prevData,
                    [stock]: [...(prevData[stock] || []), query.data].slice(-20)
                }));
            }
        });
    }, [queries, allStocks]);

    const handleSearch = () => {
        if (searchStock && !allStocks.includes(searchStock.toLowerCase())) {
            setSearchedStocks(prev => [...prev, searchStock.toLowerCase()]);
            setSearchStock('');
        }
    };

    return (
        <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <Container maxWidth="xl">
                <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: '#333' }}>
                    Live Stock Prices
                </Typography>
                <Box sx={{ display: 'flex', mb: 3 }}>
                    <TextField
                        label="Search Stock"
                        variant="outlined"
                        value={searchStock}
                        onChange={(e) => setSearchStock(e.target.value)}
                        sx={{ mr: 2 }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSearch}
                        startIcon={<SearchIcon />}
                    >
                        Search
                    </Button>
                </Box>
                <Grid container spacing={3}>
                    {allStocks.map((stock, index) => (
                        <Grid item xs={12} md={6} lg={4} key={stock}>
                            {queries[index].isLoading ? (
                                <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <CircularProgress />
                                </Paper>
                            ) : queries[index].isError ? (
                                <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Typography color="error">Error loading stock data</Typography>
                                </Paper>
                            ) : (
                                <StockCard
                                    stock={stock}
                                    color={COLORS[index % COLORS.length]}
                                    data={stocksData[stock] || []}
                                />
                            )}
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Home;