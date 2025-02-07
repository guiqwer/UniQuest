import React, { useState } from 'react';
import { Typography, Box, IconButton, Button, Card } from "@mui/material";
import { Close, Settings, Assignment } from '@mui/icons-material';
import Profile from './components/Profile';
import Interactions from './components/Interactions';

const ProfileModal = ({ openModal, handleCloseModal }) => {
    const [currentModal, setCurrentModal] = useState('profile'); // Estado para controlar qual modal está ativo

    return (
      <>
        {openModal && (
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
                  {currentModal === 'profile' ? 'Perfil' : 'Interações'}
                </Typography>
                <Box>
                  <Button
                    onClick={() => setCurrentModal('profile')}
                    sx={{
                      backgroundColor: currentModal === 'profile' ? '#1976d2' : '#ccc',
                      color: 'white',
                      fontWeight: 600,
                      '&:hover': { backgroundColor: '#1976d2' },
                      mr: 1,
                    }}
                  >
                    Perfil
                  </Button>
                  <Button
                    onClick={() => setCurrentModal('interactions')}
                    sx={{
                      backgroundColor: currentModal === 'interactions' ? '#1976d2' : '#ccc',
                      color: 'white',
                      fontWeight: 600,
                      '&:hover': { backgroundColor: '#1976d2' },
                    }}
                  >
                    Interações
                  </Button>
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
              </Box>
              {/* Mostrar o modal correto com base no estado `currentModal` */}
              {currentModal === 'profile' ? (
                <Profile handleCloseModal={handleCloseModal} />
              ) : (
                <Interactions handleCloseModal={handleCloseModal} />
              )}
            </Card>
          </Box>
        )}
      </>
    );
};

export default ProfileModal;