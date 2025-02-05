import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Box } from '@mui/material';
import { Lock } from '@mui/icons-material';
import axiosInstance from '../axios';

const PinInput = ({ navigate }) => {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');

  const handleChange = (index, event) => {
    const value = event.target.value;
    const newPin = [...pin];

    if (/^\d{0,1}$/.test(value)) {
      newPin[index] = value;
      setPin(newPin);

      if (index < pin.length - 1 && value !== '') {
        document.getElementById(`pin-${index + 1}`).focus();
      }
    }
  };

  const handleBackspace = (index, event) => {
    if (event.key === 'Backspace' && pin[index] === '') {
      if (index > 0) {
        document.getElementById(`pin-${index - 1}`).focus();
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const resetCode = pin.join('');
      const response = await axiosInstance.post('/user/reset-password', {
        resetCode,
        newPassword
      });
      console.log('Resposta do servidor:', response.data);
      navigate("login")
    } catch (error) {
      console.error('Erro ao enviar PIN:', error.response);
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2e7d32, #1976d2)',
      p: 2
    }}>
      <Paper elevation={6} sx={{
        width: '100%',
        maxWidth: '450px',
        p: 4,
        borderRadius: 4,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <img
            src="https://ifce.edu.br/prpi/documentos-1/semic/2018/logo-ifce-vertical.png"
            alt="Logo IFCE"
            style={{ height: '100px', objectFit: 'contain' }}
          />
        </Box>

        <Typography variant="h4" sx={{
          fontWeight: 700,
          color: '#2e7d32',
          textAlign: 'center',
          mb: 1
        }}>
          Digite seu código de recuperação
        </Typography>
        <Typography variant="body1" sx={{
          color: '#616161',
          textAlign: 'center',
          mb: 4,
          fontSize: '1.1rem'
        }}>
          Insira o código de recuperação
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 4, // Aumentando o espaçamento entre os inputs
            mb: 3
          }}>
            {pin.map((digit, index) => (
              <TextField
                key={index}
                id={`pin-${index}`} // Atribuindo id único para facilitar o foco
                value={digit}
                onChange={(event) => handleChange(index, event)}
                onKeyDown={(event) => handleBackspace(index, event)} // Detectando backspace
                variant="outlined"
                type="text" // Permitir que o usuário veja os números digitados
                inputProps={{
                  maxLength: 1,
                  style: { textAlign: 'center', fontSize: '1.5rem' },
                }}
                sx={{
                  width: '50px',
                  height: '50px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            ))}
          </Box>

          <TextField
            fullWidth
            label="Nova Senha"
            type="password"
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            sx={{
              mb: 4,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
            InputProps={{
              startAdornment: (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Lock sx={{ color: '#2e7d32', mr: 1 }} />
                </Box>
              ),
            }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: 2,
              fontSize: '1.1rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #2e7d32, #1976d2)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1976d2, #2e7d32)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease'
              }
            }}
            type="submit"
          >
            Confirmar Código
          </Button>
          <Button
          fullWidth
          variant="text"
          sx={{
            mt: 2,
            fontSize: '1rem',
            fontWeight: 600,
            color: '#1976d2',
            textTransform: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
          onClick={() => navigate("forgotPassword")}
          >
            Não recebeu o código? Reenviar
            </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default PinInput;