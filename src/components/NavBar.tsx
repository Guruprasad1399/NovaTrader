import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn, onLogout }: any) => {
    return (
        <AppBar position="sticky">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    NovaTrader
                </Typography>
                <Button color="inherit" component={Link} to="/">Home</Button>
                {isLoggedIn ? (
                    <>
                        <Button color="inherit" component={Link} to="/account">Account</Button>
                        <Button color="inherit" onClick={onLogout}>Logout</Button>
                    </>
                ) : (
                    <Button color="inherit" component={Link} to="/login">Login</Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;