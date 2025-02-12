import React, { useState } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import { axiosInstance } from "../../../axios";

const PasswordUpdateModal = ({ open, handleClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      const response = await axiosInstance.put("/user/edit-profile", {
        oldPassword,
        newPassword,
      });

      if (response.status === 200) {
        handleClose(); // Fecha o modal após a atualização
      }
    } catch (error) {
      setError("Erro ao atualizar senha. Verifique sua senha antiga.");
      console.error("Erro ao atualizar senha:", error.response);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        borderRadius: 3
      }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Alterar Senha
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <TextField
          fullWidth
          label="Senha Atual"
          type="password"
          variant="outlined"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Nova Senha"
          type="password"
          variant="outlined"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Confirmar Nova Senha"
          type="password"
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          sx={{ mb: 3 }}
        />

        <Button fullWidth variant="contained" color="primary" onClick={handlePasswordUpdate}>
          Atualizar Senha
        </Button>
      </Box>
    </Modal>
  );
};

export default PasswordUpdateModal;
