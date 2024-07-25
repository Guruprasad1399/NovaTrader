import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import Home from './pages/Home';
import Login from './pages/Login';
import Account from './pages/Account';
import Navbar from './components/NavBar';
import SignUp from './pages/SignUp';
import ForgotUsername from './pages/ForgotUsername';

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
          <Routes>
            <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-username" element={<ForgotUsername />} />
            <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
            <Route path="/account" element={isLoggedIn ? <Account /> : <Navigate to="/login" />} />
          </Routes>
        </Box>
      </Box>
    </QueryClientProvider>
  );
};

export default App;