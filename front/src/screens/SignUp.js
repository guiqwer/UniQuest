import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Link, Box } from "@mui/material";
import { axiosInstance } from '../axios';

const SignUp = ({ navigate }) => {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [step, setStep] = useState(1);

    const handleSendCode = async (event) => {
        event.preventDefault();
        try {
            await axiosInstance.post("/user/confirm-email", { email });
            setStep(2);
        } catch (error) {
            setError("Erro ao enviar o código. Tente novamente.");
        }
    };

    const handleVerifyCode = async (event) => {
        event.preventDefault();
        try {
            setStep(3);
        } catch (error) {
            setError("Código inválido. Tente novamente.");
        }
    };

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
                code
            });
            const token = response.data.token;
            if (token) {
                sessionStorage.setItem("token", token);
                axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
                navigate("feed");
            }
        } catch (error) {
            setError("Erro ao criar uma conta. Tente novamente.");
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #2e7d32, #1976d2)', p: 2 }}>
            <Paper elevation={6} sx={{ width: '100%', maxWidth: '450px', p: 4, borderRadius: 4, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <img
                        src="https://ifce.edu.br/prpi/documentos-1/semic/2018/logo-ifce-vertical.png"
                        alt="Logo IFCE"
                        style={{ height: '100px', objectFit: 'contain' }}
                    />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32', textAlign: 'center', mb: 1 }}>Cadastro</Typography>
                <Typography variant="body1" sx={{ color: '#616161', textAlign: 'center', mb: 4, fontSize: '1.1rem' }}>
                    Crie uma conta na UniQuest
                </Typography>
                {error && <Typography color="error" sx={{ textAlign: 'center', mb: 2 }}>{error}</Typography>}
                {step === 1 && (
                    <form onSubmit={handleSendCode}>
                        <TextField fullWidth label="Email" type="email" variant="outlined" required value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 3 }} />
                        <Button fullWidth variant="contained" size="large" type="submit">Enviar Código</Button>
                    </form>
                )}
                {step === 2 && (
                    <>
                        <form onSubmit={handleVerifyCode}>
                            <TextField fullWidth label="Código" variant="outlined" required value={code} onChange={(e) => setCode(e.target.value)} sx={{ mb: 3 }} />
                            <Button fullWidth variant="contained" size="large" type="submit">Verificar Código</Button>
                        </form>
                        <Button fullWidth variant="outlined" sx={{ mt: 2 }} onClick={() => setStep(1)}>Voltar</Button>
                    </>
                )}
                {step === 3 && (
                    <>
                        <form onSubmit={handleSignUp}>
                            <TextField fullWidth label="Nome Completo" variant="outlined" required value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 3 }} />
                            <TextField fullWidth label="Senha" type="password" variant="outlined" required value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 3 }} />
                            <TextField fullWidth label="Confirmar Senha" type="password" variant="outlined" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} sx={{ mb: 3 }} />
                            <Button fullWidth variant="contained" size="large" type="submit">Cadastrar</Button>
                        </form>
                        <Button fullWidth variant="outlined" sx={{ mt: 2 }} onClick={() => setStep(1)}>Voltar</Button>
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default SignUp;
