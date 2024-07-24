import React from 'react';
import { Container, Typography } from '@mui/material';

const Home = () => {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Home
            </Typography>
            <Typography variant="body1">
                Welcome to NovaTrade (Place where stock trading was born)!
            </Typography>
        </Container>
    );
};

export default Home;
