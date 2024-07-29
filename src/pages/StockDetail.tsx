import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, Button, CircularProgress, TextField, Select, MenuItem, FormControl, InputLabel, Grid, Divider } from '@mui/material';
import { useQuery } from 'react-query';
import { fetchStockPrice } from '../api/stockApi';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface StockHolding {
    quantity: number;
    averagePrice: number;
}

const StockDetail = () => {
    const { symbol } = useParams<{ symbol: string }>();
    const navigate = useNavigate();
    const [holding, setHolding] = useState<StockHolding | null>(null);
    const [quantity, setQuantity] = useState<number>(0);
    const [orderType, setOrderType] = useState<string>('market');
    const [limitPrice, setLimitPrice] = useState<number | ''>('');

    const { data: stockData, isLoading, isError } = useQuery(
        ['stockPrice', symbol],
        () => fetchStockPrice(symbol || ''),
        { refetchInterval: 5000 }
    );

    useEffect(() => {
        setHolding({
            quantity: 10,
            averagePrice: 150.00,
        });
    }, [symbol]);

    if (isLoading) return <CircularProgress />;
    if (isError) return <Typography color="error">Error loading stock data</Typography>;

    const currentPrice = stockData?.price || 0;
    const profitLoss = holding ? (currentPrice - holding.averagePrice) * holding.quantity : 0;
    const profitLossPercentage = holding ? ((currentPrice - holding.averagePrice) / holding.averagePrice) * 100 : 0;

    const handlePlaceOrder = (action: 'buy' | 'sell') => {
        console.log(`Placing ${action} order for ${quantity} shares of ${symbol} at ${orderType} price${orderType === 'limit' ? ` of $${limitPrice}` : ''}`);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Button onClick={() => navigate('/')} sx={{ mb: 2 }}>Back to Home</Button>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h4" gutterBottom>{symbol?.toUpperCase()} Stock Details</Typography>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>${currentPrice.toFixed(2)}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            {profitLoss >= 0 ? <TrendingUpIcon color="success" /> : <TrendingDownIcon color="error" />}
                            <Typography color={profitLoss >= 0 ? 'success.main' : 'error.main'} sx={{ ml: 1 }}>
                                {profitLossPercentage.toFixed(2)}% ({profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)})
                            </Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        {holding && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" gutterBottom>Your Holdings</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Quantity</Typography>
                                        <Typography variant="h6">{holding.quantity}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Average Buy Price</Typography>
                                        <Typography variant="h6">${holding.averagePrice.toFixed(2)}</Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>Place Order</Typography>
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
                        {orderType === 'limit' && (
                            <TextField
                                fullWidth
                                label="Limit Price"
                                type="number"
                                value={limitPrice}
                                onChange={(e) => setLimitPrice(Number(e.target.value))}
                                sx={{ mb: 2 }}
                            />
                        )}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="success"
                                onClick={() => handlePlaceOrder('buy')}
                                disabled={quantity <= 0 || (orderType === 'limit' && !limitPrice)}
                            >
                                Buy
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                color="error"
                                onClick={() => handlePlaceOrder('sell')}
                                disabled={quantity <= 0 || (orderType === 'limit' && !limitPrice)}
                            >
                                Sell
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default StockDetail;