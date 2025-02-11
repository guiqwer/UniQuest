import React, { useState } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import { axiosInstance } from "../../../axios";

const EmailUpdateModal = ({ open, handleClose, currentEmail }) => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState(1); // 1: Inserir e-mail, 2: Inserir código
  const [error, setError] = useState("");
  const [oldEmail, setOldEmail] = useState(currentEmail);
  
  const handleEmailSubmit = async () => {
    try {
      const response = await axiosInstance.post(`/user/request-change?currentEmail=${currentEmail}&newEmail=${email}`);

      if (response.status === 200) {
        setStep(2); // Avança para o passo de verificação do código
      }
    } catch (error) {
      setError("Erro ao atualizar e-mail. Tente novamente.");
      console.error("Erro ao enviar solicitação de atualização de e-mail:", error.response);
    }
  };

  const handleCodeSubmit = async () => {
    try {
      const response = await axiosInstance.post(`/user/confirm-change?currentEmail=${currentEmail}&newEmail=${email}&code=${verificationCode}`, { email, verificationCode });

      if (response.status === 200) {
        handleClose(); // Fecha o modal após confirmação
      }
    } catch (error) {
      setError("Código inválido. Tente novamente.");
      console.error("Erro ao verificar código:", error.response);
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
          {step === 1 ? "Alterar E-mail" : "Digite o Código de Verificação"}
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {step === 1 ? (
          <>
            <TextField
              fullWidth
              label="Novo E-mail"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 3 }}
            />
            <Button fullWidth variant="contained" color="primary" onClick={handleEmailSubmit}>
              Enviar Solicitação
            </Button>
          </>
        ) : (
          <>
            <TextField
              fullWidth
              label="Código de Verificação"
              variant="outlined"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              sx={{ mb: 3 }}
            />
            <Button fullWidth variant="contained" color="primary" onClick={handleCodeSubmit}>
              Confirmar Código
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default EmailUpdateModal;