import React, { useState } from "react";
import { Box, Typography, Button, TextField, Paper, IconButton } from "@mui/material";
import { Delete, UploadFile, Close } from "@mui/icons-material";
import NavBar from "./NavBar";

export default function Proof() {
  const [fileType, setFileType] = useState(null);
  const [questions, setQuestions] = useState([{ id: 1, statement: "", options: [""] }]);

  const handleOpenUpload = (type) => setFileType(type);
  const handleCloseUpload = () => setFileType(null);

  const handleAddOption = (qIndex) => {
    setQuestions((prev) =>
      prev.map((q, index) =>
        index === qIndex ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  const handleRemoveOption = (qIndex, optIndex) => {
    setQuestions((prev) =>
      prev.map((q, index) =>
        index === qIndex
          ? { ...q, options: q.options.filter((_, i) => i !== optIndex) }
          : q
      )
    );
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { id: questions.length + 1, statement: "", options: [""] }]);
  };

  const handleRemoveQuestion = (qIndex) => {
    setQuestions((prev) => prev.filter((_, index) => index !== qIndex));
  };

  const handleSubmitQuestions = () => {
    console.log("Questões enviadas:", questions);
    alert("Questões enviadas com sucesso!");
  };

  return (
    <Box sx={{ p: 3 }}>
      <NavBar />
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
        <Button variant="contained" onClick={() => handleOpenUpload("pdf")}>
          PDF
        </Button>
        <Button variant="contained" onClick={() => handleOpenUpload("image")}>
          IMAGEM
        </Button>
        <Button variant="contained" onClick={() => handleOpenUpload("text")}>
          TEXTO
        </Button>
      </Box>

      {/* Espaço entre os botões e os formulários */}
      <Box sx={{ mt: 5 }} />

      {/* Upload de Arquivos */}
      {fileType && fileType !== "text" && (
        <Paper
          sx={{
            p: 4,
            mt: 4,
            maxWidth: 600,
            margin: "auto",
            textAlign: "center",
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Upload de {fileType.toUpperCase()}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <UploadFile sx={{ fontSize: 60, color: "#777" }} />
          </Box>
          <input type="file" accept={fileType === "pdf" ? ".pdf" : "image/*"} />
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
            <Button variant="contained" color="success">
              Enviar
            </Button>
            <Button variant="contained" color="error" onClick={handleCloseUpload}>
              Fechar
            </Button>
          </Box>
        </Paper>
      )}

      {/* Espaço entre os formulários de upload e as questões */}
      {fileType && <Box sx={{ mt: 5 }} />}

      {/* Formulário de Criação de Questões */}
      {fileType === "text" && (
        <Paper sx={{ p: 4, mt: 4, maxWidth: 700, margin: "auto", boxShadow: 3, borderRadius: 2 }}>
          {/* Botão de Fechar a seção de questões */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">Criar Questões</Typography>
            <IconButton color="error" onClick={() => setFileType(null)}>
              <Close />
            </IconButton>
          </Box>

          {questions.map((q, qIndex) => (
            <Paper
              key={q.id}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                boxShadow: 2,
                backgroundColor: "#f5f5f5",
                position: "relative",
              }}
            >
              {/* Botão de remover uma única questão */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle1">Questão {qIndex + 1}</Typography>
                <IconButton color="error" onClick={() => handleRemoveQuestion(qIndex)}>
                  <Delete />
                </IconButton>
              </Box>
              
              <TextField fullWidth label="Enunciado" variant="outlined" sx={{ mb: 2 }} />
              
              {q.options.map((_, optIndex) => (
                <Box
                  key={optIndex}
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <TextField fullWidth label={`Opção ${optIndex + 1}`} variant="outlined" />
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleRemoveOption(qIndex, optIndex)}
                  >
                    -
                  </Button>
                </Box>
              ))}
              <Button variant="contained" sx={{ mt: 1 }} onClick={() => handleAddOption(qIndex)}>
                Adicionar Opção
              </Button>
            </Paper>
          ))}

          {/* Botões para adicionar questão e enviar */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button variant="contained" onClick={handleAddQuestion}>
              Adicionar Outra Questão
            </Button>
            <Button variant="contained" color="success" onClick={handleSubmitQuestions}>
              Enviar Questões
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
