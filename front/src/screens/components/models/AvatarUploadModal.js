import React, { useState } from 'react';
import { Box, Modal, Typography, Button } from '@mui/material';
import { AddPhotoAlternate } from '@mui/icons-material';
import { axiosMultipart } from '../../../axios';

const AvatarUploadModal = ({ handleClose }) => {
    const [preview, setPreview] = useState(null);
    const [newAvatar, setNewAvatar] = useState(null);
    const [error, setError] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewAvatar(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                console.log("Preview atualizado:", reader.result); // Debug
            };
            reader.readAsDataURL(file);
        } else {
            console.log("Nenhum arquivo selecionado");
        }
    };

    const handleSubmitAvatar = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append("avatarFile", newAvatar);

            const response = await axiosMultipart.put("/user/avatar", formData);
            console.log("Upload realizado:", response.data);
            handleClose(); 
        } catch (error) {
            setError("Erro ao alterar avatar. Tente novamente.");
            console.error("Erro no upload do avatar:", error);
        }
    };

    return (
        <Modal open={true} onClose={handleClose} aria-labelledby="upload-avatar-modal">
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Enviar Nova Imagem
                </Typography>
                <Box
                    sx={{
                        border: '2px dashed #e0e0e0',
                        borderRadius: 2,
                        p: 2,
                        mb: 3,
                        textAlign: 'center',
                        backgroundColor: 'rgba(0,0,0,0.02)',
                        cursor: 'pointer'
                    }}
                    onClick={() => document.getElementById("upload-image").click()} // Força a abertura do seletor
                >
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="upload-image"
                        type="file"
                        onChange={handleImageUpload}
                    />
                    
                    <label htmlFor="upload-image" style={{ width: '100%', display: 'block', cursor: 'pointer' }}>
                        {preview ? (
                            <img
                                src={preview}
                                alt="Preview"
                                style={{
                                    width: '100%',
                                    maxHeight: 300,
                                    objectFit: 'cover',
                                    borderRadius: 8
                                }}
                            />
                        ) : (
                            <Box sx={{ py: 4 }}>
                                <AddPhotoAlternate sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                                <Typography variant="body2" color="text.secondary">
                                    Arraste ou clique para enviar
                                </Typography>
                            </Box>
                        )}
                    </label>
                </Box>
                {error && <Typography color="error">{error}</Typography>}
                <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    onClick={handleSubmitAvatar} 
                    disabled={!newAvatar}
                >
                    Confirmar
                </Button>
            </Box>
        </Modal>
    );
};

export default AvatarUploadModal;