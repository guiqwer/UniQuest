import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Box, MenuItem, Avatar, Grid, Divider } from "@mui/material";

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
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #2e7d32, #1976d2)',
            p: 2
        }}>
            <Paper sx={{
                width: '100%',
                maxWidth: '1200px',
                borderRadius: 4,
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.97)'
            }}>
                {/* Barra de Navegação Superior */}
                <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    mb: 4,
                    borderBottom: '1px solid #eee',
                    pb: 2,
                    p: 4
                }}>
                    <Button
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(135deg, #2e7d32, #1976d2)',
                            '&:hover': { background: 'linear-gradient(135deg, #1976d2, #2e7d32)' }
                        }}
                    >
                        Perfil
                    </Button>
                    <Button 
                        variant="outlined"
                        onClick={() => navigate('interactions')}
                        sx={{
                            color: '#2e7d32',
                            borderColor: '#2e7d32',
                            '&:hover': { borderColor: '#1976d2' }
                        }}
                    >
                        Histórico de Interações
                    </Button>
                </Box>

                <Grid container>
                    {/* Sidebar Esquerda */}
                    <Grid item xs={12} md={3} sx={{
                        bgcolor: '#f8f9fa',
                        p: 4,
                        borderRight: '1px solid #eee',
                        textAlign: 'center'
                    }}>
                        <Avatar 
                            src="https://via.placeholder.com/150"
                            sx={{ width: 150, height: 150, mb: 3, mx: 'auto' }}
                        />
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                            {name}
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 3, color: '#666' }}>
                            {displayName}
                        </Typography>
                        
                        <Button 
                            variant="contained"
                            fullWidth
                            sx={{
                                mb: 2,
                                background: 'linear-gradient(135deg, #2e7d32, #1976d2)',
                                '&:hover': { background: 'linear-gradient(135deg, #1976d2, #2e7d32)' }
                            }}
                        >
                            Alterar Avatar
                        </Button>

                        <Typography variant="body2" sx={{ color: '#888', mt: 2 }}>
                            Membro desde: {memberSince}
                        </Typography>
                    </Grid>

                    {/* Conteúdo Principal */}
                    <Grid item xs={12} md={9} sx={{ p: 4 }}>
                        <Typography variant="h4" sx={{ mb: 4, color: '#2e7d32' }}>
                            Configurações do Perfil
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField 
                                    fullWidth 
                                    label="Nome" 
                                    variant="outlined" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)}
                                    sx={{ mb: 3 }}
                                />
                                <TextField 
                                    fullWidth 
                                    label="Nome de exibição" 
                                    variant="outlined" 
                                    value={displayName} 
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    sx={{ mb: 3 }}
                                />
                                <TextField 
                                    fullWidth 
                                    label="Email" 
                                    type="email" 
                                    variant="outlined" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                    sx={{ mb: 3 }}
                                />
                                <TextField 
                                    fullWidth 
                                    label="Confirmar Email" 
                                    type="email" 
                                    variant="outlined" 
                                    value={confirmEmail} 
                                    onChange={(e) => setConfirmEmail(e.target.value)}
                                    sx={{ mb: 3 }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField 
                                    fullWidth 
                                    label="Senha" 
                                    type="password" 
                                    variant="outlined" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)}
                                    sx={{ mb: 3 }}
                                />
                                <TextField 
                                    fullWidth 
                                    label="Confirmar Senha" 
                                    type="password" 
                                    variant="outlined" 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    sx={{ mb: 3 }}
                                />
                                
                                <TextField 
                                    select 
                                    fullWidth 
                                    label="Escolaridade" 
                                    variant="outlined" 
                                    value={education} 
                                    onChange={(e) => setEducation(e.target.value)}
                                    sx={{ mb: 3 }}
                                >
                                    <MenuItem value="Ensino Fundamental">Ensino Fundamental</MenuItem>
                                    <MenuItem value="Ensino Médio">Ensino Médio</MenuItem>
                                    <MenuItem value="Ensino Superior">Ensino Superior</MenuItem>
                                </TextField>

                                <TextField 
                                    select 
                                    fullWidth 
                                    label="Área de Interesse" 
                                    variant="outlined" 
                                    value={address} 
                                    onChange={(e) => setAddress(e.target.value)}
                                    sx={{ mb: 3 }}
                                >
                                    <MenuItem value="Ciências da Computação">Ciências da Computação</MenuItem>
                                    <MenuItem value="Eng. da Computação">Eng. da Computação</MenuItem>
                                    <MenuItem value="Eng. Ambiental">Eng. Ambiental</MenuItem>
                                    <MenuItem value="Ciências Sociais">Ciências Sociais</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 4 }} />

                        <TextField 
                            select 
                            fullWidth 
                            label="Disciplina Preferida" 
                            variant="outlined" 
                            value={subject} 
                            onChange={(e) => setSubject(e.target.value)}
                            sx={{ mb: 4 }}
                        >
                            <MenuItem value="Arq. Computadores">Arq. Computadores</MenuItem>
                            <MenuItem value="Probabilidade e Estatística">Probabilidade e Estatística</MenuItem>
                            <MenuItem value="Programação Orientada a Objetos">Programação Orientada a Objetos</MenuItem>
                            <MenuItem value="Programação Linear">Programação Linear</MenuItem>
                            <MenuItem value="Fisica II">Física II</MenuItem>
                        </TextField>

                        <Box sx={{ 
                            display: 'flex', 
                            gap: 3,
                            justifyContent: 'flex-end',
                            mt: 4
                        }}>
                            <Button 
                                variant="contained" 
                                sx={{
                                    width: 200,
                                    background: 'linear-gradient(135deg, #2e7d32, #1976d2)',
                                    '&:hover': { background: 'linear-gradient(135deg, #1976d2, #2e7d32)' }
                                }}
                            >
                                Salvar Alterações
                            </Button>
                            <Button 
                                variant="outlined" 
                                color="error"
                                sx={{ width: 200 }}
                            >
                                Excluir Conta
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default Profile;