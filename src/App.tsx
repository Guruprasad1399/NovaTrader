import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import Home from './pages/Home';
import Login from './pages/Login';
import Account from './pages/Account';
import Navbar from './components/NavBar';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
          <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
          <Route path="/account" element={isLoggedIn ? <Account /> : <Navigate to="/login" />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;
