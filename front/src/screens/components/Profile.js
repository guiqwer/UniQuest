import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, Box, MenuItem, Avatar } from "@mui/material";
import { axiosInstance } from '../../axios';
import AvatarUploadModal from './models/AvatarUploadModal';
import EmailUpdateModal from './models/EmailUpdateModal';
import PasswordUpdateModal from './models/PasswordUpdateModal';

const Profile = ({ navigate, handleCloseModal }) => {
    const [error, setError] = useState("");
    const [avatarModalOpen, setAvatarModalOpen] = useState(false);
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [profileUpdated, setProfileUpdated] = useState(false);
    const [userData, setUserData] = useState({
        name: "",
        username: "",
        email: "",
        education: "",
        areaOfInterest: "",
        favoriteSubject: "",
        avatar: "",
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
                    username: data.userName,
                    education: data.education || "",
                    areaOfInterest: data.areaOfInterest || "",
                    favoriteSubject: data.favoriteSubject || "",
                    avatar: data.avatar ? `data:image/${data.avatar.startsWith('/9j/') ? 'jpeg' : 'png'};base64,${data.avatar}` : "https://via.placeholder.com/150",
                };

                setUserData(updatedData);
                setEditData(updatedData);
            })
            .catch((error) => {
                console.error("Erro ao buscar os dados:", error);
            });
    }, [avatarModalOpen, emailModalOpen, profileUpdated]);

    const handleEditProfile = async (event) => {
        event.preventDefault();

        try {
            const response = await axiosInstance.put("/user/edit-profile", {
                username: editData.username,
                education: editData.education || userData.education,
                areaOfInterest: editData.areaOfInterest || userData.areaOfInterest,
                favoriteSubject: editData.favoriteSubject || userData.favoriteSubject
            });

            setProfileUpdated(prev => !prev);
        } catch (error) {
            setError("Erro ao editar perfil. Tente novamente.");
            console.error("Erro no perfil:", error);
        }
    };
    
    const handleCloseAvatarModal = () => {
        setAvatarModalOpen(false);
        axiosInstance.get("/user/profile")
            .then((response) => {
                const data = response.data;
                setUserData({
                    ...userData,
                    avatar: data.avatar !== null ? data.avatar : "https://via.placeholder.com/150",
                });
            })
            .catch((error) => {
                console.error("Erro ao buscar os dados:", error);
            });
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Paper elevation={6} sx={{
                display: 'flex',
                width: '100%',
                maxWidth: '900px', // Aumentado de 800px para 900px
                p: 4, // Aumentado o padding geral
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
            }}>
                {/* Lado Esquerdo - Exibição */}
                <Box sx={{ width: '30%', textAlign: 'center', pr: 3, borderRight: '1px solid #ddd' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32', mb: 1 }}>
                        {userData.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#2e7d32', mb: 1 }}>
                        @{userData.username}
                    </Typography>
                    <Avatar
                        src={userData.avatar}
                        sx={{ width: 120, height: 120, margin: '0 auto', mb: 1 }}
                    />
                    <Button
                        variant="contained"
                        onClick={() => setAvatarModalOpen(true)}
                        sx={{
                            background: 'linear-gradient(135deg, #2e7d32, #1976d2)',
                            '&:hover': { background: 'linear-gradient(135deg, #1976d2, #2e7d32)' },
                            fontSize: '0.8rem',
                            p: 1.5,
                        }}
                    >
                        Alterar Avatar
                    </Button>
                    {avatarModalOpen && <AvatarUploadModal handleClose={handleCloseAvatarModal} />}

                    {/* Informações abaixo do avatar */}
                    <Box sx={{ mt: 2, textAlign: 'left' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>📧 Email:</Typography>
                        <Typography variant="body2" sx={{ color: '#333', mb: 1, wordBreak: 'break-word'}}>{userData.email || "Não informado."}</Typography>

                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>🎓 Escolaridade:</Typography>
                        <Typography variant="body2" sx={{ color: '#333', mb: 1 }}>{userData.education || "Não informado."}</Typography>

                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>💼 Área de Interesse:</Typography>
                        <Typography variant="body2" sx={{ color: '#333', mb: 1 }}>{userData.areaOfInterest || "Não informado."}</Typography>

                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>📘 Disciplina favorita:</Typography>
                        <Typography variant="body2" sx={{ color: '#333', mb: 1 }}>{userData.favoriteSubject || "Não informado."}</Typography>
                    </Box>
                </Box>

                {/* Lado Direito - Edição */}
                <Box sx={{ width: '70%', pl: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1976d2', mb: 3 }}>
                        Alterar Informações
                    </Typography>
                    <TextField fullWidth label="Nome de exibição" variant="outlined" sx={{ mb: 3 }} value={editData.username} onChange={(e) => setEditData({ ...editData, username: e.target.value })} />
                    <TextField select fullWidth label="Escolaridade" variant="outlined" sx={{ mb: 3 }} value={editData.education || ""} onChange={(e) => setEditData({ ...editData, education: e.target.value })}>
                        <MenuItem value="">Selecione</MenuItem>
                        <MenuItem value="Ensino Fundamental">Ensino Fundamental</MenuItem>
                        <MenuItem value="Ensino Médio">Ensino Médio</MenuItem>
                        <MenuItem value="Ensino Superior">Ensino Superior</MenuItem>
                    </TextField>
                    <TextField select fullWidth label="Área de Interesse" variant="outlined" sx={{ mb: 3 }} value={editData.areaOfInterest || ""} onChange={(e) => setEditData({ ...editData, areaOfInterest: e.target.value })}>
                        <MenuItem value="">Selecione</MenuItem>
                        <MenuItem value="Ciências da Computação">Ciências da Computação</MenuItem>
                        <MenuItem value="Eng. da Computação">Eng. da Computação</MenuItem>
                        <MenuItem value="Eng. Ambiental">Eng. Ambiental</MenuItem>
                        <MenuItem value="Ciências Sociais">Ciências Sociais</MenuItem>
                    </TextField>
                    <TextField select fullWidth label="Disciplina favorita" variant="outlined" sx={{ mb: 3 }} value={editData.favoriteSubject || ""} onChange={(e) => setEditData({ ...editData, favoriteSubject: e.target.value })}>
                        <MenuItem value="">Selecione</MenuItem>
                        <MenuItem value="Arq. Computadores">Arq. Computadores</MenuItem>
                        <MenuItem value="Probabilidade e Estatística">Probabilidade e Estatística</MenuItem>
                        <MenuItem value="Programação Orientada a Objetos">Programação Orientada a Objetos</MenuItem>
                        <MenuItem value="Programação Linear">Programação Linear</MenuItem>
                        <MenuItem value="Física II">Física II</MenuItem>
                    </TextField>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mt: 2 }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleEditProfile}
                            sx={{
                                background: 'linear-gradient(135deg, #2e7d32, #1976d2)',
                                '&:hover': { background: 'linear-gradient(135deg, #1976d2, #2e7d32)' },
                                minWidth: 130
                            }}
                        >
                            Atualizar Perfil
                        </Button>

                        <Button variant="outlined" size="large" onClick={() => setEmailModalOpen(true)} sx={{ minWidth: 130 }}>
                            Alterar E-mail
                        </Button>

                        <Button variant="outlined" size="large" onClick={() => setPasswordModalOpen(true)} sx={{ minWidth: 130 }}>
                            Alterar Senha
                        </Button>
                        {passwordModalOpen && <PasswordUpdateModal open={passwordModalOpen} handleClose={() => setPasswordModalOpen(false)} />}
                        {emailModalOpen && <EmailUpdateModal open={emailModalOpen} handleClose={() => setEmailModalOpen(false)} currentEmail={userData.email}/>}


                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default Profile;