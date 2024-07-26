import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useWallet } from "../contexts/WalletContext";
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import NomuraLogo from '../assets/Nomura-Logo.png';

const NavButton = ({ to, icon, label, onClick }: { to?: string; icon: any; label: string; onClick?: () => void }) => (
    <Button
        color="inherit"
        component={to ? Link : 'button'}
        to={to}
        onClick={onClick}
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mx: 1,
        }}
    >
        {icon}
        <Typography variant="caption" sx={{ mt: 0.5 }}>
            {label}
        </Typography>
    </Button>
);

const Navbar = ({ isLoggedIn, onLogout }: any) => {
    const { balance } = useWallet();

    return (
        <AppBar position="sticky">
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <NavButton to="/" icon={<HomeIcon />} label="Home" />
                    {isLoggedIn && (
                        <NavButton to="/account" icon={<AccountCircleIcon />} label="Account" />
                    )}
                </Box>

                <Box sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                    <img src={NomuraLogo} alt="Nomura Logo" style={{ height: '50px', backgroundColor: "white" }} />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isLoggedIn ? (
                        <>
                            <NavButton to="/wallet" icon={<AccountBalanceWalletIcon />} label="Wallet" />
                            <NavButton icon={<LogoutIcon />} label="Logout" onClick={onLogout} />
                        </>
                    ) : (
                        <NavButton to="/login" icon={<LoginIcon />} label="Login" />
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;