import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, Link, Box } from "@mui/material";
import axiosInstance from "../axios";

const Login = ({ navigate }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
      const token = sessionStorage.getItem("token");
      if (token) {
        navigate("feed");
      }
    }, [navigate]);

    const handleLogin = async (event) => {
      event.preventDefault();
    
      try {
        const response = await axiosInstance.post("/auth/login", {
          email,
          password,
        });
    
        const token = response.data.token;
        if (token) {
          sessionStorage.setItem("token", token);
          axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
          navigate("feed"); 
        }
      } catch (error) {
        setError("Email ou senha inválidos");
        console.error("Erro no login:", error);
      }
    };

    return (
        <Box sx={{
            display: 'flex',
            height: '100vh',
            background: 'linear-gradient(135deg, #2e7d32, #1976d2)',
        }}>
            <Box sx={{
                flex: 1,
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>
                <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                    Bem-vindo ao UniQuest
                </Typography>
            </Box>

            <Box sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 4
            }}>
                <Paper elevation={6} sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    maxWidth: 400,
                    width: '100%'
                }}>
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                        <img
                            src="https://ifce.edu.br/prpi/documentos-1/semic/2018/logo-ifce-vertical.png"
                            alt="Logo IFCE"
                            style={{ width: '100%', maxWidth: '150px' }}
                        />
                    </Box>
                    <Typography variant="h4" sx={{
                        fontWeight: 700,
                        color: '#2e7d32',
                        textAlign: 'center',
                        mb: 1
                    }}>
                        UniQuest
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{ color: '#555', mb: 3 }}>
                        Acesse sua conta
                    </Typography>

                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <form onSubmit={handleLogin}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Email"
                            variant="outlined"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Senha"
                            type="password"
                            variant="outlined"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 3 }}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{
                                mt: 2,
                                mb: 2,
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                background: 'linear-gradient(135deg, #2e7d32, #1976d2)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1976d2, #2e7d32)'
                                }
                            }}
                        >
                            Entrar
                        </Button>
                    </form>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Link
                            component="button"
                            onClick={() => navigate("forgotPassword")}
                            sx={{
                                color: '#1976d2',
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            Esqueci minha senha
                        </Link>
                    </Box>

                    <Typography variant="body2" sx={{ mt: 2, color: '#555' }}>
                        Ainda não tem conta?{' '}
                        <Link
                            component="button"
                            onClick={() => navigate("signup")}
                            sx={{
                                color: '#1976d2',
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            Faça o cadastro
                        </Link>
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
};

export default Login;