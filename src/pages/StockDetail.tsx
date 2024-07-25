// src/pages/StockDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, Button, CircularProgress } from '@mui/material';
import { useQuery } from 'react-query';
import { fetchStockPrice } from '../api/stockApi';

interface StockHolding {
    quantity: number;
    averagePrice: number;
}

const StockDetail = () => {
    const { symbol } = useParams<{ symbol: string }>();
    const navigate = useNavigate();
    const [holding, setHolding] = useState<StockHolding | null>(null);

    const { data: stockData, isLoading, isError } = useQuery(
        ['stockPrice', symbol],
        () => fetchStockPrice(symbol || ''),
        { refetchInterval: 5000 }
    );

    useEffect(() => {
        // Simulating fetching user's holding data
        // In a real app, you'd fetch this from your backend
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

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Button onClick={() => navigate('/')} sx={{ mb: 2 }}>Back to Home</Button>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>{symbol?.toUpperCase()} Stock Details</Typography>
                <Typography variant="h6">Current Price: ${currentPrice.toFixed(2)}</Typography>

                {holding && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6">Your Holdings</Typography>
                        <Typography>Quantity: {holding.quantity}</Typography>
                        <Typography>Average Buy Price: ${holding.averagePrice.toFixed(2)}</Typography>
                        <Typography color={profitLoss >= 0 ? 'success.main' : 'error.main'}>
                            Profit/Loss: ${profitLoss.toFixed(2)} ({profitLossPercentage.toFixed(2)}%)
                        </Typography>
                    </Box>
                )}

                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button variant="contained" color="primary">Buy</Button>
                    <Button variant="contained" color="secondary">Sell</Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default StockDetail;