import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const ExamModal = ({ open, onClose, exam }) => {
  if (!exam) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          backgroundColor: "white",
          borderRadius: 2,
          maxWidth: 600,
          mx: "auto",
          mt: 10,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          overflowY: "auto",
          maxHeight: "80vh",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {exam.title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {exam.description}
        </Typography>

        {exam.questions?.map((question, index) => (
          <Box
            key={index}
            sx={{
              mb: 2,
              p: 2,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              backgroundColor: "rgba(255,255,255,0.7)",
            }}
          >
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500, color: "#2d3436" }}>
              Questão {index + 1}: {question.statement}
            </Typography>

            {question.options ? (
              <Box sx={{ ml: 1 }}>
                {question.options.map((option, optionIndex) => (
                  <Typography key={optionIndex} variant="body2">
                    - {option}
                  </Typography>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Resposta esperada: {question.expectedAnswer}
              </Typography>
            )}
          </Box>
        ))}

        <Button variant="contained" color="primary" onClick={onClose} sx={{ mt: 3 }}>
          Fechar
        </Button>
      </Box>
    </Modal>
  );
};

export default ExamModal;