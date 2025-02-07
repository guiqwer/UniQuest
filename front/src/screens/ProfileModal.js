import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Box, MenuItem, Avatar, Card, IconButton } from "@mui/material";
import { Close } from '@mui/icons-material';
import Profile from './components/Profile';

const ProfileModal = ({ openModal, handleCloseModal }) => {
    return (
      openModal && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <Card
            sx={{
              width: '100%',
              maxWidth: 800,
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              backgroundColor: 'white',
              overflow: 'auto',
            }}
          >
            {/* Cabeçalho do modal */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
              <Typography variant="h6" fontWeight={500}>
                Perfil
              </Typography>
              <IconButton
                onClick={handleCloseModal}
                size="small"
                sx={{
                  fontSize: 20,
                  color: '#1976d2',
                  '&:hover': { color: '#2e7d32' },
                }}
              >
                <Close />
              </IconButton>
            </Box>
            <Profile handleCloseModal={handleCloseModal} />
          </Card>
        </Box>
      )
    );
  };
  
  export default ProfileModal;