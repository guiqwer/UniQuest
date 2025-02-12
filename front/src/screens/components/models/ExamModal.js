import React from "react";
import { Modal, Box, Typography, Button, Card, CardContent } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DownloadIcon from "@mui/icons-material/Download";
import CardMedia from "@mui/material/CardMedia";

const ExamModal = ({ open, onClose, exam }) => {
  if (!exam) return null;

  const renderContent = () => {
    switch (exam.type) {
      case "image":
        return (
          <Box
            sx={{
              position: "relative",
              mb: 2,
              width: "100%",
              maxWidth: "700px",
              height: "600px",
              overflow: "hidden",
              borderRadius: "8px",
              backgroundColor: "#f8f9fa",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "auto",
            }}
          >
            <CardMedia
              component="img"
              image={`data:image/png;base64,${exam.data}`}
              alt="Imagem do exame"
              sx={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
        );

      case "pdf":
        return (
          <Card variant="outlined" sx={{ mb: 2, borderColor: "#e0e0e0", backgroundColor: "#f8f9fa" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <PictureAsPdfIcon sx={{ fontSize: 40, color: "#e53935" }} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1">{exam.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {((exam.data.length * 3) / 4 / 1024).toFixed(1)} KB
                </Typography>
              </Box>
            </CardContent>
            <embed src={`data:application/pdf;base64,${exam.data}`} type="application/pdf" width="100%" height="500px" />
            <Button
              variant="contained"
              component="a"
              href={`data:application/pdf;base64,${exam.data}`}
              download={exam.fileName || "arquivo.pdf"}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<DownloadIcon />}
              sx={{ mt: 2 }}
            >
              Baixar PDF
            </Button>
          </Card>
        );

      case "text":
      default:
        return exam.questions?.map((question, index) => (
          <Box key={index} sx={{ mb: 2, p: 2, border: "1px solid #e0e0e0", borderRadius: 2, backgroundColor: "rgba(255,255,255,0.7)" }}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500, color: "#2d3436" }}>
              Questão {index + 1}: {question.statement}
            </Typography>
            {question.options ? (
              <Box sx={{ ml: 1 }}>
                {question.options.map((option, optionIndex) => (
                  <Typography key={optionIndex} variant="body2">- {option}</Typography>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Resposta esperada: {question.expectedAnswer}
              </Typography>
            )}
          </Box>
        ));
    }
  };

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
        {renderContent()}
        <Button variant="contained" color="primary" onClick={onClose} sx={{ mt: 3 }}>
          Fechar
        </Button>
      </Box>
    </Modal>
  );
};

export default ExamModal;
