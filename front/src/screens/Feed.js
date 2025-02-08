import React, { useState, useEffect } from "react";
import {
  Box, Card, CardContent, CardMedia, Typography, IconButton,
  TextField, Button, SpeedDial, SpeedDialIcon, SpeedDialAction,
  Avatar, Chip, Divider, Collapse, Autocomplete, Menu, MenuItem
} from "@mui/material";
import {
  FavoriteBorder, Favorite, AddPhotoAlternate,
  Comment, Close, MoreVert
} from "@mui/icons-material";

import { styled } from "@mui/material/styles";
import { pdfjs } from 'react-pdf';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { axiosMultipart, axiosInstance } from "../axios";
import { Newspaper } from "lucide-react";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PostCard = styled(Card)(({ theme }) => ({
  borderRadius: "16px",
  border: "1px solid rgba(0,0,0,0.08)",
  boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
  marginBottom: theme.spacing(3),
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  },
}));

const Feed = () => {
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    image: "",
    description: "",
    tags: [],
    questions: [],
    file: null,
    fileURL: ""
  });
  const [postType, setPostType] = useState(null);
  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const [openComments, setOpenComments] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [openNewPostModal, setOpenNewPostModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  
  const normalizeTags = (tags) => {
    return tags.map(tag => tag.replace(/^\[?"|"?\]$/g, "")); 
  };
  
  axiosInstance.get("/exam/list")
        .then((response) => {
            const formattedData = response.data.map(post => ({
                ...post,
                tags: normalizeTags(post.tags),
                user: post.authorName,
                avatar: "https://via.placeholder.com/150",
                likes: post.likesCount,
                liked: false,
                date: "Agora mesmo",
            }));
            setPosts(formattedData);
        })
        .catch((error) => {
            console.error("Erro ao buscar os dados:", error);
        });
  
  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
    setAnchorEl(null);
    setSelectedPostId(null);
  };

  const handleMenuOpen = (event, postId) => {
    setAnchorEl(event.currentTarget);
    setSelectedPostId(postId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPostId(null);
  };

  const toggleComments = (postId) => {
    setOpenComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
            ...post,
            liked: !post.liked,
            likes: post.likes + (post.liked ? -1 : 1),
          }
          : post
      )
    );
  };

  const handleAddComment = (postId, comment) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
            ...post,
            comments: [...(post.comments || []), comment],
          }
          : post
      )
    );
  };

  const handleAddPost = () => {
    const hasContent =
      newPost.title ||
      newPost.description ||
      newPost.image ||
      newPost.file ||
      (newPost.questions && newPost.questions.length > 0);

    if (hasContent) {
      const post = {
        id: posts.length + 1,
        user: "Usuário Atual",
        avatar: "https://via.placeholder.com/150",
        ...newPost,
        type: postType,
        fileName: newPost.file?.name || 'documento.pdf',
        likes: 0,
        comments: [],
        liked: false,
        date: "Agora mesmo",
      };
      setPosts([post, ...posts]);
      setNewPost({
        title: "",
        image: "",
        description: "",
        tags: [],
        questions: [],
        file: null,
        fileURL: ""
      });
      setOpenNewPostModal(false);
      setPostType(null);
    }
  };

  const renderPostContent = (post) => {
    switch (post.type) {
      case 'imagem':
        return (
          <Box sx={{ position: 'relative', paddingTop: '100%', height: 0, mb: 2 }}>
            <CardMedia
              component="img"
              image={post.image}
              alt="Post"
              onClick={() => setSelectedImage(post.image)}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                cursor: 'zoom-in',
              }}
            />
          </Box>
        );

      case 'pdf':
        return (
          <Card
            variant="outlined"
            sx={{
              mb: 2,
              borderColor: '#e0e0e0',
              backgroundColor: '#f8f9fa'
            }}
          >
            <CardContent
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <PictureAsPdfIcon sx={{
                fontSize: 40,
                color: '#e53935'
              }} />

              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1">
                  {post.fileName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(post.file.size / 1024).toFixed(1)} KB
                </Typography>
              </Box>

              <Button
                variant="contained"
                component="a"
                href={post.fileURL}
                download={post.fileName}
                startIcon={<DownloadIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #2e7d32 0%, #1976d2 100%)',
                  color: '#fff',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1b5e20 0%, #1565c0 100%)',
                  },
                }}
              >
                Baixar
              </Button>
            </CardContent>
          </Card>
        );

      case 'texto':
        return post.questions?.map((question, index) => (
          <Box key={index} sx={{
            mb: 2,
            p: 2,
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            backgroundColor: 'rgba(255,255,255,0.7)'
          }}>
            <Typography variant="body1" sx={{
              mb: 1,
              fontWeight: 500,
              color: '#2d3436'
            }}>
              Questão {index + 1}: {question.text}
            </Typography>

            {question.type === 'objetiva' && (
              <Box sx={{ ml: 1 }}>
                {question.options.map((option, optionIndex) => (
                  <Box key={optionIndex} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1,
                    p: 1,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.03)'
                    }
                  }}>
                    <Box sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: '#1976d2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 500,
                      flexShrink: 0,
                      mr: 1.5
                    }}>
                      {String.fromCharCode(65 + optionIndex)}
                    </Box>
                    <Typography variant="body2" sx={{ color: '#2d3436' }}>
                      {option}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ));

      default:
        return null;
    }
  };

  const ImageZoomModal = () => (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: "rgba(0,0,0,0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={() => setSelectedImage(null)}
    >
      <img
        src={selectedImage}
        alt="Zoom"
        style={{
          maxWidth: "90%",
          maxHeight: "90%",
          objectFit: "contain",
        }}
      />
    </Box>
  );

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPost({ ...newPost, image: file }); // Armazena o arquivo original no estado
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost((prev) => ({ ...prev, preview: reader.result })); // Apenas para pré-visualização
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPost = async (event) => {
          event.preventDefault();  
          try {
            if (postType === "pdf") {
              const response = await axiosMultipart.post("/exam/upload/pdf", {
                title: newPost.title,
                description: newPost.description,
                tags: newPost.tags,
                file: newPost.file
            });}
            if (postType === "imagem") {
              const response = await axiosMultipart.post("/exam/upload/image", {
                title: newPost.title,
                description: newPost.description,
                tags: newPost.tags,
                file: newPost.image
            });}
            if (postType === "texto") {
              const formattedQuestions = newPost.questions.map((question, index) => ({
                question: index + 1,
                statement: question.text,
                options: question.options?.reduce((acc, option, i) => {
                  acc[String.fromCharCode(65 + i)] = option; // A, B, C, D...
                  return acc;
                }, {})
              }));
              
              const finalPayload = {
                text: formattedQuestions
              };
              
              const response = await axiosInstance.post("/exam/upload/text", {
                title: newPost.title,
                description: newPost.description,
                tags: newPost.tags,
                text: finalPayload.text
            });}
          } catch (error) {
              setError("Erro ao enviar a prova. Tente novamente.");
              console.error("Erro no cadastro:", error);
          }
          setNewPost({
            title: "",
            image: "",
            description: "",
            tags: [],
            questions: [],
            file: null,
            fileURL: ""
          });
          setOpenNewPostModal(false);
          setPostType(null);
      };
  return (
    <Box
      sx={{
        display: "flex",
        maxWidth: 1200,
        margin: "0 auto",
        p: 3,
        gap: 3,
        background: "linear-gradient(45deg, #f8f9fa 0%, #f1f3f5 100%)",
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {posts.length === 0 ? (
          <Typography variant="h6" align="center" sx={{ color: "#636e72" }}>
            Nenhum post disponível. Adicione um novo post!
          </Typography>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    padding: 2,
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: 3,
                    position: 'relative'
                  }}
                >
                  <Avatar
                    src={post.avatar}
                    sx={{
                      width: 56,
                      height: 56,
                      mr: 2,
                      border: "2px solid #fff",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="700" color="#2d3436">
                      {post.user}
                    </Typography>
                    <Typography variant="caption" color="#636e72">
                      {post.date}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, post.id)}
                    sx={{ position: 'absolute', right: 16, top: 16, color: '#636e72' }}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>

                {post.title && (
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: "#2d3436" }}>
                    {post.title}
                  </Typography>
                )}

                {renderPostContent(post)}

                <Typography variant="body1" sx={{ mb: 2, color: "#2d3436" }}>
                  {post.description}
                </Typography>

                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                  {post.tags?.map((tag, index) => (
                    <Chip
                      key={index}
                      label={`#${tag}`}
                      size="small"
                      sx={{
                        background: "rgba(45, 52, 54, 0.08)",
                        color: "#2d3436",
                        fontWeight: 500,
                        "&:hover": {
                          background: "rgba(45, 52, 54, 0.12)",
                        },
                      }}
                    />
                  ))}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                    padding: 1,
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: 4,
                  }}
                >
                  <IconButton onClick={() => handleLike(post.id)}>
                    {post.liked ? (
                      <Favorite sx={{ color: "#ff1744" }} />
                    ) : (
                      <FavoriteBorder sx={{ color: "#636e72" }} />
                    )}
                  </IconButton>
                  <IconButton onClick={() => toggleComments(post.id)}>
                    <Comment sx={{ color: openComments[post.id] ? "#1976d2" : "#636e72" }} />
                  </IconButton>
                  <Typography variant="body2" sx={{ color: "#636e72", ml: 0.5, fontWeight: 500 }}>
                    {post.likes} curtidas • {post.comments?.length || 0} comentários
                  </Typography>
                </Box>

                <Collapse in={openComments[post.id]}>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ maxHeight: 200, overflow: "auto" }}>
                    {post.comments?.map((comment, index) => (
                      <Box key={index} sx={{ display: "flex", gap: 1.5, mb: 2, padding: 1.5 }}>
                        <Avatar src={comment.avatar} sx={{ width: 40, height: 40 }} />
                        <Box>
                          <Typography variant="subtitle2" color="#2d3436">
                            {comment.user}
                          </Typography>
                          <Typography variant="body2" color="#636e72">
                            {comment.text}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                    <TextField
                      fullWidth
                      placeholder="Adicione um comentário..."
                      variant="outlined"
                      size="small"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && e.target.value) {
                          handleAddComment(post.id, {
                            user: "Você",
                            text: e.target.value,
                            avatar: "https://via.placeholder.com/150",
                          });
                          e.target.value = "";
                        }
                      }}
                      sx={{ mt: 1.5 }}
                    />
                  </Box>
                </Collapse>
              </CardContent>
            </PostCard>
          ))
        )}
      </Box>

      {/* Menu de três pontos */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: 140
          }
        }}
      >
        <MenuItem 
          onClick={() => handleDeletePost(selectedPostId)}
          sx={{ 
            color: '#ff4444',
            '&:hover': { backgroundColor: 'rgba(255, 68, 68, 0.08)' }
          }}
        >
          Excluir Post
        </MenuItem>
      </Menu>

      <SpeedDial
        ariaLabel="Novo post"
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          "& .MuiSpeedDial-fab": {
            background: "linear-gradient(135deg, #1976d2, #2e7d32)",
            "&:hover": {
              background: "linear-gradient(135deg, #1565c0, #1b5e20)",
            },
          },
        }}
        icon={<SpeedDialIcon />}
        open={openSpeedDial}
        onOpen={() => setOpenSpeedDial(true)}
        onClose={() => setOpenSpeedDial(false)}
      >
        <SpeedDialAction
          icon={<AddPhotoAlternate sx={{ color: "#1976d2" }} />}
          tooltipTitle="Adicionar prova"
          onClick={() => {
            setOpenNewPostModal(true);
          }}
        />
      </SpeedDial>

      {openNewPostModal && (
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
          <Card sx={{
            width: "100%",
            maxWidth: 500,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(0,0,0,0.08)',
            backgroundColor: 'white'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
              }}>
                <Typography variant="h6" fontWeight={500} sx={{
                  background: 'linear-gradient(135deg, #2e7d32 0%, #1976d2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Criar novo post
                </Typography>
                <IconButton
                  onClick={() => {
                    setOpenNewPostModal(false);
                    setPostType(null);
                  }}
                  size="small"
                >
                  <Close sx={{
                    fontSize: 20,
                    color: '#1976d2',
                    '&:hover': {
                      color: '#2e7d32'
                    }
                  }} />
                </IconButton>
              </Box>

              {!postType ? (
                <Box sx={{
                  display: "grid",
                  gap: 2,
                  mb: 2
                }}>
                  <Button
                    variant="outlined"
                    onClick={() => setPostType("pdf")}
                    startIcon={<DescriptionIcon sx={{
                      background: 'linear-gradient(135deg, #2e7d32 0%, #1976d2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }} />}
                    sx={{
                      py: 1.5,
                      justifyContent: 'flex-start',
                      borderColor: '#1976d2',
                      color: '#1976d2',
                      '&:hover': {
                        borderColor: '#2e7d32',
                        backgroundColor: 'rgba(46, 125, 50, 0.04)'
                      }
                    }}
                  >
                    Arquivo PDF
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => setPostType("imagem")}
                    startIcon={<AddPhotoAlternate sx={{
                      background: 'linear-gradient(135deg, #2e7d32 0%, #1976d2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }} />}
                    sx={{
                      py: 1.5,
                      justifyContent: 'flex-start',
                      borderColor: '#1976d2',
                      color: '#1976d2',
                      '&:hover': {
                        borderColor: '#2e7d32',
                        backgroundColor: 'rgba(46, 125, 50, 0.04)'
                      }
                    }}
                  >
                    Imagem
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => setPostType("texto")}
                    startIcon={<TextFieldsIcon sx={{
                      background: 'linear-gradient(135deg, #2e7d32 0%, #1976d2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }} />}
                    sx={{
                      py: 1.5,
                      justifyContent: 'flex-start',
                      borderColor: '#1976d2',
                      color: '#1976d2',
                      '&:hover': {
                        borderColor: '#2e7d32',
                        backgroundColor: 'rgba(46, 125, 50, 0.04)'
                      }
                    }}
                  >
                    Texto
                  </Button>
                </Box>
              ) : (
                <>
                  <TextField
                    fullWidth
                    label="Título da Prova"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    sx={{ mb: 3 }}
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 1 }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Descrição"
                    multiline
                    rows={2}
                    value={newPost.description}
                    onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                    sx={{ mb: 3 }}
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 1 }
                    }}
                  />

                  {postType === "imagem" && (
                    <Box
                      sx={{
                        border: '2px dashed #e0e0e0',
                        borderRadius: 2,
                        p: 2,
                        mb: 3,
                        textAlign: 'center',
                        backgroundColor: 'rgba(0,0,0,0.02)'
                      }}
                    >
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="upload-image"
                        type="file"
                        onChange={handleImageUpload}
                      />
                      <label htmlFor="upload-image">
                        {newPost.preview ? (
                          <img
                            src={newPost.preview}
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
                            <AddPhotoAlternate sx={{
                              fontSize: 40,
                              color: 'text.secondary',
                              mb: 1
                            }} />
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
                        border: '2px dashed #e0e0e0',
                        borderRadius: 2,
                        p: 2,
                        mb: 3,
                        textAlign: 'center',
                        backgroundColor: 'rgba(0,0,0,0.02)'
                      }}
                    >
                      <input
                        accept=".pdf"
                        style={{ display: 'none' }}
                        id="upload-pdf"
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setNewPost({
                              ...newPost,
                              file: file,
                              fileURL: URL.createObjectURL(file),
                              fileName: file.name
                            });
                          }
                        }}
                      />
                      <label htmlFor="upload-pdf" style={{ cursor: 'pointer' }}>
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<DescriptionIcon sx={{ color: '#1976d2' }} />}
                          sx={{
                            py: 1,
                            px: 3,
                            borderRadius: 1,
                            textTransform: 'none',
                            borderColor: '#1976d2',
                            color: '#1976d2',
                            '&:hover': {
                              backgroundColor: 'rgba(25, 118, 210, 0.04)',
                              borderColor: '#1565c0'
                            }
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
                      <Box sx={{
                        maxHeight: '40vh',
                        overflowY: 'auto',
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        p: 1,
                        mb: 2,
                        backgroundColor: 'white'
                      }}>
                        {newPost.questions.map((question, index) => (
                          <Box key={index} sx={{
                            mb: 2,
                            p: 2,
                            border: '1px solid #e0e0e0',
                            borderRadius: 2,
                            backgroundColor: '#f8f9fa',
                            '&:last-child': { mb: 0 }
                          }}>
                            <Box sx={{
                              display: 'flex',
                              gap: 1,
                              mb: 1,
                              flexWrap: 'wrap',
                              alignItems: 'center'
                            }}>
                              <TextField
                                fullWidth
                                label={`Questão ${index + 1}`}
                                value={question.text}
                                onChange={(e) => {
                                  const newQuestions = [...newPost.questions];
                                  newQuestions[index].text = e.target.value;
                                  setNewPost({ ...newPost, questions: newQuestions });
                                }}
                                variant="outlined"
                                InputProps={{
                                  sx: {
                                    borderRadius: 1,
                                    backgroundColor: 'white'
                                  }
                                }}
                                sx={{ flex: 1, minWidth: 250 }}
                              />

                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                  variant={question.type === 'aberta' ? 'contained' : 'outlined'}
                                  onClick={() => {
                                    const newQuestions = [...newPost.questions];
                                    newQuestions[index].type = 'aberta';
                                    setNewPost({ ...newPost, questions: newQuestions });
                                  }}
                                  sx={{
                                    minWidth: 100,
                                    background: question.type === 'aberta' ? '#1976d2' : 'transparent',
                                    color: question.type === 'aberta' ? 'white' : '#1976d2',
                                    borderColor: '#1976d2'
                                  }}
                                >
                                  Aberta
                                </Button>
                                <Button
                                  variant={question.type === 'objetiva' ? 'contained' : 'outlined'}
                                  onClick={() => {
                                    const newQuestions = [...newPost.questions];
                                    newQuestions[index] = {
                                      ...question,
                                      type: 'objetiva',
                                      options: ['', '']
                                    };
                                    setNewPost({ ...newPost, questions: newQuestions });
                                  }}
                                  sx={{
                                    minWidth: 100,
                                    background: question.type === 'objetiva' ? '#2e7d32' : 'transparent',
                                    color: question.type === 'objetiva' ? 'white' : '#2e7d32',
                                    borderColor: '#2e7d32'
                                  }}
                                >
                                  Objetiva
                                </Button>
                              </Box>
                            </Box>

                            {question.type === 'objetiva' && (
                              <Box sx={{ ml: 2, mt: 2 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, color: '#636e72' }}>
                                  Opções:
                                </Typography>

                                {question.options.map((option, optionIndex) => (
                                  <Box key={optionIndex} sx={{
                                    display: 'flex',
                                    gap: 1,
                                    mb: 1,
                                    alignItems: 'center'
                                  }}>
                                    <Box sx={{
                                      width: 32,
                                      height: 32,
                                      borderRadius: '50%',
                                      backgroundColor: '#1976d2',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: 'white',
                                      fontWeight: 500,
                                      flexShrink: 0
                                    }}>
                                      {String.fromCharCode(65 + optionIndex)}
                                    </Box>

                                    <TextField
                                      fullWidth
                                      value={option}
                                      onChange={(e) => {
                                        const newQuestions = [...newPost.questions];
                                        newQuestions[index].options[optionIndex] = e.target.value;
                                        setNewPost({ ...newPost, questions: newQuestions });
                                      }}
                                      variant="outlined"
                                      size="small"
                                      placeholder={`Opção ${optionIndex + 1}`}
                                      InputProps={{
                                        sx: {
                                          borderRadius: 1,
                                          backgroundColor: 'white'
                                        }
                                      }}
                                    />

                                    {question.options.length > 1 && (
                                      <IconButton
                                        onClick={() => {
                                          const newQuestions = [...newPost.questions];
                                          newQuestions[index].options.splice(optionIndex, 1);
                                          setNewPost({ ...newPost, questions: newQuestions });
                                        }}
                                        sx={{ color: '#ff4444' }}
                                      >
                                        <Close fontSize="small" />
                                      </IconButton>
                                    )}
                                  </Box>
                                ))}

                                <Button
                                  variant="outlined"
                                  onClick={() => {
                                    const newQuestions = [...newPost.questions];
                                    newQuestions[index].options.push('');
                                    setNewPost({ ...newPost, questions: newQuestions });
                                  }}
                                  sx={{
                                    mt: 1,
                                    color: '#1976d2',
                                    borderColor: '#1976d2',
                                    '&:hover': {
                                      backgroundColor: 'rgba(25, 118, 210, 0.04)'
                                    }
                                  }}
                                >
                                  Adicionar Opção
                                </Button>
                              </Box>
                            )}

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
                                startIcon={<Close fontSize="small" />}
                                sx={{
                                  mt: 1,
                                  borderColor: '#ff4444',
                                  color: '#ff4444',
                                  '&:hover': {
                                    backgroundColor: 'rgba(255, 68, 68, 0.04)'
                                  }
                                }}
                              >
                                Remover Questão
                              </Button>
                            )}
                          </Box>
                        ))}
                      </Box>

                      <Button
                        variant="contained"
                        onClick={() => setNewPost({
                          ...newPost,
                          questions: [...newPost.questions, {
                            type: 'aberta',
                            text: '',
                            options: []
                          }]
                        })}
                        sx={{
                          width: '100%',
                          background: 'linear-gradient(135deg, #1976d2, #2e7d32)',
                          color: 'white',
                          '&:hover': {
                            opacity: 0.9
                          }
                        }}
                      >
                        Adicionar Nova Questão
                      </Button>
                    </Box>
                  )}
                  <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    value={newPost.tags}
                    onChange={(_, value) => setNewPost({ ...newPost, tags: value })}
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
                      value.map((option, index) => {
                        const { key, ...tagProps } = getTagProps({ index }); // Extrai a key antes de espalhar as props
                    
                        return (
                          <Chip
                            key={key} // ✅ Passa a key diretamente
                            {...tagProps} // ✅ Espalha o restante das props corretamente
                            label={option}
                            size="small"
                            sx={{
                              m: 0.5,
                              backgroundColor: 'rgba(46, 125, 50, 0.1)',
                              color: '#2e7d32',
                              '& .MuiChip-deleteIcon': {
                                fontSize: 16,
                                color: '#2e7d32'
                              }
                            }}
                          />
                        );
                      })
                    }                    
                    componentsProps={{
                      popper: {
                        sx: {
                          zIndex: 99999,
                          '& .MuiAutocomplete-listbox': {
                            py: 0,
                            borderRadius: 1,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            '& li': {
                              px: 2,
                              py: 1
                            }
                          }
                        }
                      }
                    }}
                  />

                  <Box sx={{
                    display: 'flex',
                    gap: 2,
                    pt: 2,
                    borderTop: '1px solid rgba(0,0,0,0.08)'
                  }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => setPostType(null)}
                      sx={{
                        borderRadius: 1,
                        py: 1,
                        fontWeight: 500,
                        borderColor: '#1976d2',
                        color: '#1976d2',
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.04)',
                          borderColor: '#2e7d32'
                        }
                      }}
                    >
                      Voltar
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleAddPost}
                      disabled={
                        !newPost.title &&
                        !newPost.description &&
                        !newPost.image &&
                        !newPost.file &&
                        newPost.questions.length === 0
                      }
                      sx={{
                        borderRadius: 1,
                        py: 1,
                        fontWeight: 500,
                        background: 'linear-gradient(135deg, #2e7d32 0%, #1976d2 100%)',
                        '&:hover': {
                          opacity: 0.9,
                          background: 'linear-gradient(135deg, #1b5e20 0%, #1565c0 100%)'
                        }
                      }}
                    >
                      Publicar
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      )}

      {selectedImage && <ImageZoomModal />}
    </Box>
  );
};

export default Feed;