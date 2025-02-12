import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Link, Box } from "@mui/material";
import { axiosInstance } from '../axios';

const ForgotPassword = ({ navigate }) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleResetPassword = async (event) => {
        event.preventDefault();

        try {
            const response = await axiosInstance.post("/user/forgot-password", {
                email
            });
            if (response.status === 200) {
                navigate("resetCode")
            }
        } catch (error) {
            setError("Erro ao recuperar senha. Tente novamente.");
            console.error("Erro no forgot-password:", error.response);
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
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 4
                }}>
                    <img
                        src="https://i.imgur.com/zLPjYXW.png"
                        alt="Logo UniQuest"
                        style={{ height: '100px', objectFit: 'contain' }}
                    />
                </Box>
                <Typography variant="h4" sx={{
                    fontWeight: 700,
                    color: '#2e7d32',
                    textAlign: 'center',
                    mb: 1
                }}>
                    Redefinir Senha
                </Typography>
                <Typography variant="body1" sx={{
                    color: '#616161',
                    textAlign: 'center',
                    mb: 4,
                    fontSize: '1.1rem'
                }}>
                    Digite seu e-mail cadastrado para redefinir senha
                </Typography>
                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
                <form onSubmit={handleResetPassword}>
                    <TextField
                        fullWidth
                        label="E-mail"
                        type="email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            }
                        }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        type="submit"
                        sx={{
                            mt: 1,
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
                    >
                        Enviar email
                    </Button>
                </form>
                <Box sx={{
                    textAlign: 'center',
                    mt: 4,
                    '& a': {
                        color: '#1976d2',
                        fontWeight: 500,
                        textDecoration: 'none',
                        '&:hover': {
                            textDecoration: 'underline'
                        }
                    }
                }}>
                    <Link
                        component="button"
                        onClick={() => navigate("login")}
                    >
                        Voltar para o login
                    </Link>
                </Box>
            </Paper>
        </Box>
    );
};

export default ForgotPassword;