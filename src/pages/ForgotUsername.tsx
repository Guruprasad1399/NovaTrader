import { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Link, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ForgotUsername = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = () => {
        setMessage('If an account exists for this email, we will send the username to it.');
        setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
    };

    return (
        <Container component="main" maxWidth="xs" sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pt: 8,
        }}>
            <Paper elevation={6} sx={{ p: 4, width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5">
                        Forgot Username
                    </Typography>
                    <Box component="form" sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {message && <Typography color="primary" sx={{ mt: 2 }}>{message}</Typography>}
                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                        <Link href="/login" variant="body2">
                            Back to login
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default ForgotUsername;