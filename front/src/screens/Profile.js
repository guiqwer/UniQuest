import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Box, MenuItem, Avatar } from "@mui/material";
import axiosInstance from "../axios";

const Profile = ({ navigate }) => {
    const [name, setName] = useState("Usuário Teste");
    const [displayName, setDisplayName] = useState("@teste_user");
    const [email, setEmail] = useState("usuario@email.com");
    const [confirmEmail, setConfirmEmail] = useState("usuario@email.com");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [education, setEducation] = useState("");
    const [address, setAddress] = useState("");
    const [subject, setSubject] = useState("");
    const [memberSince] = useState("01/01/2024");

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
                display: 'flex',
                width: '100%',
                maxWidth: '800px',
                p: 4,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
                {/* Lado Esquerdo */}
                <Box sx={{ width: '30%', textAlign: 'center', pr: 3, borderRight: '1px solid #ddd' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32', mb: 0 }}>
                        {name}
                    </Typography>
                    <Typography variant="h7" sx={{ fontWeight: 500, color: '#2e7d32', mb: 2 }}>
                        {displayName}
                    </Typography>
                    <Avatar 
                        src="https://via.placeholder.com/150"
                        sx={{ width: 120, height: 120, margin: '0 auto', mb: 2 }}
                    />
                    <Button 
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(135deg, #2e7d32, #1976d2)',
                            '&:hover': { background: 'linear-gradient(135deg, #1976d2, #2e7d32)' }
                        }}
                    >
                        Alterar Avatar
                    </Button>
                    <Typography variant="body2" sx={{ mt: 2, color: '#616161' }}>
                        Membro desde: {memberSince}
                    </Typography>
                </Box>
                
                {/* Lado Direito */}
                <Box sx={{ width: '70%', pl: 3 }}>
                    <TextField fullWidth label="Nome" variant="outlined" sx={{ mb: 2 }} value={name} onChange={(e) => setName(e.target.value)} />
                    <TextField fullWidth label="Nome de exibição" variant="outlined" sx={{ mb: 2 }} value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                    <TextField fullWidth label="Email" type="email" variant="outlined" sx={{ mb: 2 }} value={email} onChange={(e) => setEmail(e.target.value)} />
                    <TextField fullWidth label="Confirmar Email" type="email" variant="outlined" sx={{ mb: 2 }} value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} />
                    <TextField fullWidth label="Senha" type="password" variant="outlined" sx={{ mb: 2 }} value={password} onChange={(e) => setPassword(e.target.value)} />
                    <TextField fullWidth label="Confirmar Senha" type="password" variant="outlined" sx={{ mb: 2 }} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    
                    <TextField select fullWidth label="Escolaridade" variant="outlined" sx={{ mb: 2 }} value={education} onChange={(e) => setEducation(e.target.value)}>
                        <MenuItem value="Ensino Fundamental">Ensino Fundamental</MenuItem>
                        <MenuItem value="Ensino Médio">Ensino Médio</MenuItem>
                        <MenuItem value="Ensino Superior">Ensino Superior</MenuItem>
                    </TextField>
                    <TextField select fullWidth label="Área de Interesse" variant="outlined" sx={{ mb: 2 }} value={address} onChange={(e) => setAddress(e.target.value)}>
                        <MenuItem value="Ciências da Computação">Ciências da Computação</MenuItem>
                        <MenuItem value="Eng. da Computação">Eng. da Computação</MenuItem>
                        <MenuItem value="Eng. Ambietal">Eng. Ambietal</MenuItem>
                        <MenuItem value="Ciências Sociais">Ciências Sociais</MenuItem>
                    </TextField>
                    <TextField select fullWidth label="Disciplina Preferida" variant="outlined" sx={{ mb: 2 }} value={subject} onChange={(e) => setSubject(e.target.value)}>
                        <MenuItem value="Arq. Computadores">Arq. Computadores</MenuItem>
                        <MenuItem value="Probabilidade e Estatística">Probabilidade e Estatística</MenuItem>
                        <MenuItem value="Programação Orientada a Objetos">Programação Orientada a Objetos</MenuItem>
                        <MenuItem value="Programação Linear">Programação Linear</MenuItem>
                        <MenuItem value="Fisica II">Fisica II</MenuItem>
                    </TextField>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button variant="contained" size="large" sx={{
                            background: 'linear-gradient(135deg, #2e7d32, #1976d2)',
                            '&:hover': { background: 'linear-gradient(135deg, #1976d2, #2e7d32)' }
                        }}>
                            Atualizar Perfil
                        </Button>
                        <Button variant="outlined" size="large" color="error">
                            Excluir Conta
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default Profile;
