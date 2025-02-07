import React from 'react';
import { Typography, Box, IconButton, Button, Card, Avatar } from "@mui/material";

const Interactions = ({ handleCloseModal }) => {
  
    return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
      <Card
        sx={{
          display: 'flex',
          width: '100%',
          maxWidth: '800px',
          p: 4,
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Lado Esquerdo - Interações */}
        <Box sx={{ width: '30%', textAlign: 'center', pr: 3, borderRight: '1px solid #ddd' }}>
          <Avatar 
            src="https://via.placeholder.com/150"
            sx={{ width: 120, height: 120, margin: '0 auto', mb: 2 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32' }}>
            Interações Recentes
          </Typography>
          <Button
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #2e7d32, #1976d2)',
              '&:hover': { background: 'linear-gradient(135deg, #1976d2, #2e7d32)' },
            }}
          >
            Ver Detalhes
          </Button>
        </Box>

        {/* Lado Direito - Interações */}
        <Box sx={{ width: '70%', pl: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
            Interação 1
          </Typography>
          <Typography variant="body2" sx={{ color: '#333', mb: 2 }}>
            Detalhes da interação ou mensagem.
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
            Interação 2
          </Typography>
          <Typography variant="body2" sx={{ color: '#333', mb: 2 }}>
            Detalhes da interação ou mensagem.
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default Interactions;
