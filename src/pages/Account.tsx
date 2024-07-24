import { Container, Typography } from '@mui/material';

const Account = () => {
    const user = { username: 'user' };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Account Management
            </Typography>
            {user ? (
                <Typography variant="body1">
                    Username: {user.username}
                </Typography>
            ) : (
                <Typography color="error">
                    You need to log in to manage your account.
                </Typography>
            )}
        </Container>
    );
};

export default Account;
