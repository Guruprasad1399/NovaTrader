import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Grid, Paper } from '@mui/material';
import { useWallet } from '../contexts/WalletContext';

const predefinedAmounts = [20, 50, 100, 1000];

const Wallet = () => {
    const { balance, addBalance } = useWallet();
    const [amount, setAmount] = useState('');

    const handleAddBalance = () => {
        const numAmount = parseFloat(amount);
        if (!isNaN(numAmount) && numAmount > 0) {
            addBalance(numAmount);
            setAmount('');
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <Typography variant="h4" gutterBottom>Wallet</Typography>
                <Typography variant="h6" gutterBottom>Current Balance: ${balance.toFixed(2)}</Typography>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Amount"
                        variant="outlined"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button fullWidth variant="contained" color="primary" onClick={handleAddBalance}>
                        Add Amount
                    </Button>
                </Box>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    {predefinedAmounts.map((predefAmount) => (
                        <Grid item xs={6} key={predefAmount}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => addBalance(predefAmount)}
                            >
                                ${predefAmount}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Container>
    );
};

export default Wallet;