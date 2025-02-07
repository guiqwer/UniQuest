import * as React from 'react';
import { styled } from '@mui/material/styles';
import { AppBar, Box, Toolbar, IconButton, Typography, InputBase, Menu, MenuItem, Button } from "@mui/material";
import { AccountCircle, Search } from "@mui/icons-material";
import ProfileModal from './ProfileModal';
import { useState } from 'react';

const SearchContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '28px',
  backgroundColor: '#f5f5f5',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
  width: '100%',
  maxWidth: '680px',
  transition: 'all 0.3s ease',
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(2),
  border: '1px solid #e0e0e0'
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(2, 2, 2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    fontSize: '0.9rem',
  },
}));

export default function NavBar({ navigate }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openProfile, setOpenProfile] = useState(false);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  
  const handleOpenProfile = () => {
    setOpenProfile(true);
    handleMenuClose();
  };

  const handleCloseProfile = () => {
    setOpenProfile(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: '#fff',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
        }}
      >
        <Toolbar sx={{ minHeight: '72px!important', padding: '0 24px!important' }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ 
              mr: 2,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              letterSpacing: '-0.5px',
              background: 'linear-gradient(135deg, #2e7d32, #1976d2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            onClick={() => navigate("feed")}
          >
            UniQuest
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SearchContainer>
              <SearchIconWrapper>
                <Search sx={{ color: '#888' }} />
              </SearchIconWrapper>

              <StyledInputBase
                placeholder="Buscar provas, matérias ou usuários..."
                inputProps={{ 'aria-label': 'search' }}
                sx={{ color: '#333', flexGrow: 1 }}
              />
            </SearchContainer>
          </Box>

          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            sx={{ 
              color: '#333',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <AccountCircle sx={{ fontSize: 32 }} />
          </IconButton>
        </Toolbar>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ 
            '& .MuiPaper-root': {
              backgroundColor: '#fff',
              color: '#333',
              minWidth: '200px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }
          }}
        >
          <MenuItem onClick={handleOpenProfile} sx={{ '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' } }}>
            Perfil
          </MenuItem>
          <MenuItem 
            onClick={() => {
              handleMenuClose();
              sessionStorage.removeItem("token"); 
              navigate("login"); 
            }} 
            sx={{ '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' } }}
          >
            Sair
          </MenuItem>
        </Menu>
        
        <ProfileModal openModal={openProfile} handleCloseModal={handleCloseProfile} />
      </AppBar>
    </Box>
  );
}