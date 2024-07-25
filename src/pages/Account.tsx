import { Container, Typography, Box, Paper, Avatar, Grid, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaymentIcon from '@mui/icons-material/Payment';

const Account = () => {
    const user = {
        username: 'user',
        email: 'example.user@nomura.com',
        fullName: 'Example User',
        joinDate: 'January 15, 2023',
        accountType: 'Premium',
        profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg'
    };

    const InfoItem = ({ label, value }: { label: string; value: string }) => (
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
            <Typography variant="body1">{value}</Typography>
        </Box>
    );

    const AccountSection = ({ title, icon, action }: { title: string; icon: any; action: string }) => (
        <Paper elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ mr: 2 }}>{icon}</Box>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>{title}</Typography>
            <Button variant="outlined" size="small" startIcon={<EditIcon />}>
                {action}
            </Button>
        </Paper>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                Account Management
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                        <Avatar
                            src={user.profilePicture}
                            sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                        />
                        <Typography variant="h5" gutterBottom>{user.fullName}</Typography>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            @{user.username}
                        </Typography>
                        <Button variant="contained" startIcon={<EditIcon />} sx={{ mt: 2 }}>
                            Edit Profile
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>Account Information</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <InfoItem label="Email" value={user.email} />
                                <InfoItem label="Account Type" value={user.accountType} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <InfoItem label="Member Since" value={user.joinDate} />
                                <InfoItem label="Last Login" value="2 hours ago" />
                            </Grid>
                        </Grid>
                    </Paper>
                    <AccountSection
                        title="Security Settings"
                        icon={<SecurityIcon color="primary" />}
                        action="Manage"
                    />
                    <AccountSection
                        title="Notification Preferences"
                        icon={<NotificationsIcon color="primary" />}
                        action="Update"
                    />
                    <AccountSection
                        title="Payment Methods"
                        icon={<PaymentIcon color="primary" />}
                        action="Manage"
                    />
                </Grid>
            </Grid>
        </Container>
    );
};

export default Account;