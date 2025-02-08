import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, Box, MenuItem, Avatar } from "@mui/material";
import { axiosInstance } from '../../axios';

const Profile = ({ navigate, handleCloseModal }) => {
    const [error, setError] = useState("");
    const [userData, setUserData] = useState({
        name: "",
        displayName: "@",
        email: "",
        confirmEmail: "",
        password:"",
        confirmPassword:"",
        education: "",
        areaOfInterest: "",
        favoriteSubject: "",
        avatar: "https://via.placeholder.com/150",
        memberSince: "01/01/2024"
    });
    
    const [editData, setEditData] = useState({ ...userData });
    useEffect(() => {
        axiosInstance.get("/user/profile")
            .then((response) => {
                const data = response.data;
    
                const updatedData = {
                    name: data.name,
                    email: data.email,
                    education: data.education,
                    areaOfInterest: data.areaOfInterest,
                    favoriteSubject: data.favoriteSubject,
                    avatar: data.avatar !== null ? data.avatar : "https://via.placeholder.com/150",
                };
    
                setUserData(updatedData);
                setEditData(updatedData);
            })
            .catch((error) => {
                console.error("Erro ao buscar os dados:", error);
            });
    }, []);

    const handleEditProfile = async (event) => {
        event.preventDefault();

        if (editData.password !== editData.confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }
        if (editData.email !== editData.confirmEmail) {
            setError("Os emails não coincidem.");
            return;
        }

        try {
            const response = await axiosInstance.post("/user/edit-profile", {
                education: editData.education,
                areaOfInterest: editData.areaOfInterest,
                favoriteSubject: editData.favoriteSubject,
                avatar: editData.avatar
            });

            const token = response.data.token;
            if (token) {
                sessionStorage.setItem("token", token);
                axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
                navigate("feed");
            }
        } catch (error) {
            setError("Erro ao criar uma conta. Tente novamente.");
            console.error("Erro no cadastro:", error);
        }
    };

    return (
        
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
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
                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                        </Typography>
                    )}
                {/* Lado Esquerdo - Exibição */}
                <Box sx={{ width: '30%', textAlign: 'center', pr: 3, borderRight: '1px solid #ddd' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                        {userData.name}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#2e7d32', mb: 2 }}>
                        {userData.displayName}
                    </Typography>
                    <Avatar 
                        src={userData.avatar}
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

                    {/* Informações abaixo do avatar */}
                    <Box sx={{ mt: 3, textAlign: 'left', pl: 4 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                            📧 Email:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#333', mb: 2 }}>
                            {userData.email || "Não informado."}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
                            🎓 Escolaridade: 
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#333', mb: 2 }}>
                            {userData.education || "Não informado."}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
                            💼 Área de Interesse:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#333', mb: 2 }}>
                            {userData.areaOfInterest || "Não informado."}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
                            📘 Disciplina favorita:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#333', mb: 2 }}>
                            {userData.favoriteSubject || "Não informado."}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 2, color: '#616161' }}>
                            Membro desde:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#333', mb: 2 }}>
                            {userData.memberSince}
                        </Typography>
                    </Box>
                </Box>
                
                {/* Lado Direito - Edição */}
                <Box sx={{ width: '70%', pl: 3 }}>
                    <TextField fullWidth label="Nome" variant="outlined" sx={{ mb: 2 }} placeholder='' value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })}  />
                    <TextField fullWidth label="Nome de exibição" variant="outlined" sx={{ mb: 2 }} value={editData.displayName} onChange={(e) => setEditData({ ...editData, displayName: e.target.value })} />
                    <TextField fullWidth label="Email" type="email" variant="outlined" sx={{ mb: 2 }} value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
                    <TextField fullWidth label="Confirmar Email" type="email" variant="outlined" sx={{ mb: 2 }} value={editData.confirmEmail} onChange={(e) => setEditData({ ...editData, confirmEmail: e.target.value })} />
                    <TextField fullWidth label="Senha" type="password" variant="outlined" sx={{ mb: 2 }} value={editData.password} onChange={(e) => setEditData({ ...editData, password: e.target.value })} />
                    <TextField fullWidth label="Confirmar Senha" type="password" variant="outlined" sx={{ mb: 2 }} value={editData.confirmPassword} onChange={(e) => setEditData({ ...editData, confirmPassword: e.target.value })} />
                    
                    <TextField select fullWidth label="Escolaridade" variant="outlined" sx={{ mb: 2 }} value={editData.education} onChange={(e) => setEditData({ ...editData, education: e.target.value })}>
                        <MenuItem value="Ensino Fundamental">Ensino Fundamental</MenuItem>
                        <MenuItem value="Ensino Médio">Ensino Médio</MenuItem>
                        <MenuItem value="Ensino Superior">Ensino Superior</MenuItem>
                    </TextField>
                    <TextField select fullWidth label="Área de Interesse" variant="outlined" sx={{ mb: 2 }} value={editData.areaOfInterest} onChange={(e) => setEditData({ ...editData, areaOfInterest: e.target.value })}>
                        <MenuItem value="Ciências da Computação">Ciências da Computação</MenuItem>
                        <MenuItem value="Eng. da Computação">Eng. da Computação</MenuItem>
                        <MenuItem value="Eng. Ambiental">Eng. Ambiental</MenuItem>
                        <MenuItem value="Ciências Sociais">Ciências Sociais</MenuItem>
                    </TextField>
                    <TextField select fullWidth label="Disciplina favorita" variant="outlined" sx={{ mb: 2 }} value={editData.favoriteSubject} onChange={(e) => setEditData({ ...editData, favoriteSubject: e.target.value })}>
                        <MenuItem value="Arq. Computadores">Arq. Computadores</MenuItem>
                        <MenuItem value="Probabilidade e Estatística">Probabilidade e Estatística</MenuItem>
                        <MenuItem value="Programação Orientada a Objetos">Programação Orientada a Objetos</MenuItem>
                        <MenuItem value="Programação Linear">Programação Linear</MenuItem>
                        <MenuItem value="Física II">Física II</MenuItem>
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