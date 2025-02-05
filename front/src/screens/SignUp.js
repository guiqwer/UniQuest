import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Link, Box } from "@mui/material";
import axiosInstance from "../axios";

const SignUp = ({ navigate }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignUp = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError("As senhas não coincidem");
            return;
        }

        try {
            const response = await axiosInstance.post("/user/register", {
                name,
                email,
                password,
            });

            const token = response.data.token;
            if (token) {
                sessionStorage.setItem("token", token);
                axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
                navigate("home");
            }
        } catch (error) {
            setError("Erro ao criar uma conta. Tente novamente.");
            console.error("Erro no cadastro:", error);
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
                    Cadastro
                </Typography>
                <Typography variant="body1" sx={{ 
                    color: '#616161', 
                    textAlign: 'center', 
                    mb: 4,
                    fontSize: '1.1rem'
                }}>
                    Crie uma conta na UniQuest
                </Typography>

                {error && (
                    <Typography color="error" sx={{ textAlign: 'center', mb: 2 }}>
                        {error}
                    </Typography>
                )}

                <form onSubmit={handleSignUp}>
                    <TextField 
                        fullWidth
                        label="Nome Completo"
                        variant="outlined"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ 
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            }
                        }}
                    />
                    <TextField 
                        fullWidth
                        label="Email"
                        type="email"
                        variant="outlined"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ 
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            }
                        }}
                    />
                    <TextField 
                        fullWidth
                        label="Senha"
                        type="password"
                        variant="outlined"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ 
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            }
                        }}
                    />
                    <TextField 
                        fullWidth
                        label="Confirmar Senha"
                        type="password"
                        variant="outlined"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                        Continuar
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
                    <Typography variant="body2">
                        Já tem usuário?{' '}
                        <Link 
                            component="button" 
                            onClick={() => navigate("login")}
                        >
                            Faça o login
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default SignUp;