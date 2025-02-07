import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  TextField,
  Autocomplete,
  Chip
} from "@mui/material";
import {
  AddPhotoAlternate,
  Description as DescriptionIcon,
  TextFields as TextFieldsIcon,
  Close
} from "@mui/icons-material";

const NewPostModal = ({
  open,
  onClose,
  postType,
  setPostType,
  newPost,
  setNewPost,
  availableTags,
  onPublish,
}) => {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: "rgba(0,0,0,0.05)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 500,
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          border: "1px solid rgba(0,0,0,0.08)",
          backgroundColor: "white",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              fontWeight={500}
              sx={{
                background: "linear-gradient(135deg, #2e7d32 0%, #1976d2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Criar novo post
            </Typography>
            <IconButton onClick={onClose} size="small">
              <Close
                sx={{
                  fontSize: 20,
                  color: "#1976d2",
                  "&:hover": {
                    color: "#2e7d32",
                  },
                }}
              />
            </IconButton>
          </Box>

          {!postType ? (
            <Box sx={{ display: "grid", gap: 2, mb: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setPostType("pdf")}
                startIcon={
                  <DescriptionIcon
                    sx={{
                      background: "linear-gradient(135deg, #2e7d32 0%, #1976d2 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  />
                }
                sx={{
                  py: 1.5,
                  justifyContent: "flex-start",
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  "&:hover": {
                    borderColor: "#2e7d32",
                    backgroundColor: "rgba(46, 125, 50, 0.04)",
                  },
                }}
              >
                Arquivo PDF
              </Button>

              <Button
                variant="outlined"
                onClick={() => setPostType("imagem")}
                startIcon={
                  <AddPhotoAlternate
                    sx={{
                      background: "linear-gradient(135deg, #2e7d32 0%, #1976d2 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  />
                }
                sx={{
                  py: 1.5,
                  justifyContent: "flex-start",
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  "&:hover": {
                    borderColor: "#2e7d32",
                    backgroundColor: "rgba(46, 125, 50, 0.04)",
                  },
                }}
              >
                Imagem
              </Button>

              <Button
                variant="outlined"
                onClick={() => setPostType("texto")}
                startIcon={
                  <TextFieldsIcon
                    sx={{
                      background: "linear-gradient(135deg, #2e7d32 0%, #1976d2 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  />
                }
                sx={{
                  py: 1.5,
                  justifyContent: "flex-start",
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  "&:hover": {
                    borderColor: "#2e7d32",
                    backgroundColor: "rgba(46, 125, 50, 0.04)",
                  },
                }}
              >
                Texto
              </Button>
            </Box>
          ) : (
            <>
              <TextField
                fullWidth
                label="Legenda"
                multiline
                rows={2}
                value={newPost.caption}
                onChange={(e) =>
                  setNewPost({ ...newPost, caption: e.target.value })
                }
                sx={{ mb: 3 }}
                variant="outlined"
              />

              {postType === "imagem" && (
                <Box
                  sx={{
                    border: "2px dashed #e0e0e0",
                    borderRadius: 2,
                    p: 2,
                    mb: 3,
                    textAlign: "center",
                    backgroundColor: "rgba(0,0,0,0.02)",
                  }}
                >
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="upload-image"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewPost({ ...newPost, image: reader.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <label htmlFor="upload-image">
                    {newPost.image ? (
                      <img
                        src={newPost.image}
                        alt="Preview"
                        style={{
                          width: "100%",
                          maxHeight: 300,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    ) : (
                      <Box sx={{ py: 4 }}>
                        <AddPhotoAlternate
                          sx={{
                            fontSize: 40,
                            color: "text.secondary",
                            mb: 1,
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Arraste ou clique para enviar
                        </Typography>
                      </Box>
                    )}
                  </label>
                </Box>
              )}

              {postType === "pdf" && (
                <Box
                  sx={{
                    border: "2px dashed #e0e0e0",
                    borderRadius: 2,
                    p: 2,
                    mb: 3,
                    textAlign: "center",
                    backgroundColor: "rgba(0,0,0,0.02)",
                  }}
                >
                  <input
                    accept=".pdf"
                    style={{ display: "none" }}
                    id="upload-pdf"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setNewPost({
                          ...newPost,
                          file: file,
                          fileURL: URL.createObjectURL(file),
                          fileName: file.name,
                        });
                      }
                    }}
                  />
                  <label htmlFor="upload-pdf" style={{ cursor: "pointer" }}>
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={
                        <DescriptionIcon sx={{ color: "#1976d2" }} />
                      }
                      sx={{
                        py: 1,
                        px: 3,
                        borderRadius: 1,
                        textTransform: "none",
                        borderColor: "#1976d2",
                        color: "#1976d2",
                        "&:hover": {
                          backgroundColor: "rgba(25, 118, 210, 0.04)",
                          borderColor: "#1565c0",
                        },
                      }}
                    >
                      Selecionar PDF
                    </Button>
                  </label>

                  {newPost.file && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="#2e7d32">
                        {newPost.file.name}
                      </Typography>
                      <Typography variant="caption" color="#1976d2">
                        {(newPost.file.size / 1024).toFixed(1)} KB
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {postType === "texto" && (
                <Box sx={{ mb: 3 }}>
                  {newPost.questions.map((question, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        label={`Questão ${index + 1}`}
                        value={question}
                        onChange={(e) => {
                          const newQuestions = [...newPost.questions];
                          newQuestions[index] = e.target.value;
                          setNewPost({ ...newPost, questions: newQuestions });
                        }}
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />
                      {index > 0 && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => {
                            const newQuestions = [...newPost.questions];
                            newQuestions.splice(index, 1);
                            setNewPost({ ...newPost, questions: newQuestions });
                          }}
                          sx={{
                            mt: 1,
                            textTransform: "none",
                          }}
                        >
                          Remover Questão
                        </Button>
                      )}
                    </Box>
                  ))}

                  <Button
                    variant="outlined"
                    onClick={() =>
                      setNewPost({
                        ...newPost,
                        questions: [...newPost.questions, ""],
                      })
                    }
                    sx={{ width: "100%" }}
                  >
                    Adicionar Questão
                  </Button>
                </Box>
              )}

              <Autocomplete
                multiple
                freeSolo
                options={availableTags}
                value={newPost.tags}
                onChange={(_, value) =>
                  setNewPost({ ...newPost, tags: value })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    placeholder="Adicionar tags..."
                    variant="outlined"
                  />
                )}
                sx={{ mb: 3 }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip key={index} {...getTagProps({ index })} label={option} size="small" />
                  ))
                }
              />

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  pt: 2,
                  borderTop: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setPostType(null)}
                >
                  Voltar
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={onPublish}
                  disabled={
                    !newPost.caption &&
                    !newPost.image &&
                    !newPost.file &&
                    newPost.questions.length === 0
                  }
                >
                  Publicar
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default NewPostModal;
