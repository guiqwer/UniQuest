import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  TextField,
  Button,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Avatar,
  Chip,
  Divider,
  Collapse
} from "@mui/material";
import {
  FavoriteBorder,
  Favorite,
  ChatBubbleOutline,
  Send,
  AddPhotoAlternate,
  MoreHoriz,
  Comment
} from "@mui/icons-material";
import { styled } from '@mui/material/styles';

// Estilos customizados
const PostCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
  marginBottom: theme.spacing(3),
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.1)'
  }
}));

// Dados de exemplo com imagens aleatórias
const initialPosts = [
  {
    id: 1,
    user: "João Silva",
    avatar: "https://i.pravatar.cc/150?img=1",
    image: "https://picsum.photos/800/600?random=1",
    caption: "Prova de Cálculo II - 2023 📚 #Engenharia",
    likes: 12,
    comments: [
      { user: "Maria", text: "Ótima qualidade da imagem! 👏", avatar: "https://i.pravatar.cc/150?img=5" },
      { user: "Pedro", text: "Tem a questão 5 completa?", avatar: "https://i.pravatar.cc/150?img=6" }
    ],
    liked: false,
    tags: ['Engenharia', 'Cálculo'],
    date: '2h atrás'
  },
  {
    id: 2,
    user: "Maria Oliveira",
    avatar: "https://i.pravatar.cc/150?img=2",
    image: "https://picsum.photos/800/600?random=2",
    caption: "Prova de Física I - 2022 🚀 #Física",
    likes: 8,
    comments: [
      { user: "Carlos", text: "Alguém tem o gabarito?", avatar: "https://i.pravatar.cc/150?img=7" }
    ],
    liked: false,
    tags: ['Física'],
    date: '5h atrás'
  }
];

const Feed = () => {
  const [posts, setPosts] = useState(initialPosts || []);
  const [newPost, setNewPost] = useState({ image: "", caption: "" });
  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const [openComments, setOpenComments] = useState({});

  const toggleComments = (postId) => {
    setOpenComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { 
        ...post, 
        liked: !post.liked, 
        likes: post.likes + (post.liked ? -1 : 1) 
      } : post
    ));
  };

  const handleAddComment = (postId, comment) => {
    setPosts(posts.map(post => 
      post.id === postId ? { 
        ...post, 
        comments: [...(post.comments || []), comment] 
      } : post
    ));
  };

  const handleAddPost = () => {
    if (newPost.image && newPost.caption) {
      const post = {
        id: posts.length + 1,
        user: "Usuário Atual",
        avatar: "https://i.pravatar.cc/150?img=3",
        image: newPost.image,
        caption: newPost.caption,
        likes: 0,
        comments: [],
        liked: false,
        tags: ['Novo'],
        date: 'Agora mesmo'
      };
      setPosts([post, ...posts]);
      setNewPost({ image: "", caption: "" });
      setOpenSpeedDial(false);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      maxWidth: 1200, 
      margin: '0 auto', 
      p: 3,
      gap: 3
    }}>
      {/* Área Principal de Posts */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {posts?.map(post => (
          <PostCard key={post.id}>
            <CardContent>
              {/* Cabeçalho do Post */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar src={post.avatar} sx={{ width: 48, height: 48, mr: 2 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="600">{post.user}</Typography>
                  <Typography variant="caption" color="text.secondary">{post.date}</Typography>
                </Box>
                <IconButton sx={{ ml: 'auto' }}>
                  <MoreHoriz />
                </IconButton>
              </Box>

              {/* Imagem do Post */}
              <CardMedia
                component="img"
                image={post.image}
                alt="Post"
                sx={{ 
                  borderRadius: 3, 
                  mb: 2,
                  cursor: 'pointer',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
              />

              {/* Legenda e Tags */}
              <Typography variant="body1" sx={{ mb: 2 }}>
                {post.caption}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                {post.tags?.map((tag, index) => (
                  <Chip 
                    key={index} 
                    label={`#${tag}`} 
                    size="small" 
                    sx={{ 
                      background: 'rgba(46, 125, 50, 0.1)',
                      color: '#2e7d32'
                    }} 
                  />
                ))}
              </Box>

              {/* Interações */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <IconButton onClick={() => handleLike(post.id)}>
                  {post.liked ? (
                    <Favorite sx={{ color: '#ff1744' }} />
                  ) : (
                    <FavoriteBorder />
                  )}
                </IconButton>
                
                <IconButton onClick={() => toggleComments(post.id)}>
                  <Comment sx={{ 
                    color: openComments[post.id] ? '#1976d2' : 'inherit',
                    transform: openComments[post.id] ? 'rotateY(360deg)' : 'none',
                    transition: 'all 0.3s'
                  }} />
                </IconButton>
                
                <Typography variant="body2" color="text.secondary">
                  {post.likes} curtidas • {post.comments?.length || 0} comentários
                </Typography>
              </Box>

              {/* Comentários (Aba recolhível) */}
              <Collapse in={openComments[post.id]}>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                  {post.comments?.map((comment, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Avatar src={comment.avatar} sx={{ width: 32, height: 32 }} />
                      <Box>
                        <Typography variant="subtitle2">{comment.user}</Typography>
                        <Typography variant="body2">{comment.text}</Typography>
                      </Box>
                    </Box>
                  ))}
                  
                  {/* Novo Comentário */}
                  <TextField
                    fullWidth
                    placeholder="Adicione um comentário..."
                    variant="outlined"
                    size="small"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value) {
                        handleAddComment(post.id, {
                          user: "Você",
                          text: e.target.value,
                          avatar: "https://i.pravatar.cc/150?img=4"
                        });
                        e.target.value = '';
                      }
                    }}
                    sx={{
                      mt: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 20
                      }
                    }}
                  />
                </Box>
              </Collapse>
            </CardContent>
          </PostCard>
        ))}
      </Box>

      {/* Speed Dial para Novo Post */}
      <SpeedDial
        ariaLabel="Novo post"
        sx={{ 
          position: 'fixed', 
          bottom: 32, 
          right: 32,
          '& .MuiSpeedDial-fab': {
            background: 'linear-gradient(135deg, #2e7d32, #1976d2)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1976d2, #2e7d32)'
            }
          }
        }}
        icon={<SpeedDialIcon />}
        open={openSpeedDial}
        onOpen={() => setOpenSpeedDial(true)}
        onClose={() => setOpenSpeedDial(false)}
      >
        <SpeedDialAction
          icon={<AddPhotoAlternate />}
          tooltipTitle="Adicionar imagem"
          onClick={() => {
            const imageUrl = prompt("Cole a URL da imagem:");
            imageUrl && setNewPost({ ...newPost, image: imageUrl });
          }}
          sx={{ color: '#2e7d32' }}
        />
      </SpeedDial>

      {/* Modal de Novo Post */}
      {newPost.image && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <Card sx={{ 
            width: '100%', 
            maxWidth: 500, 
            p: 3,
            background: 'linear-gradient(145deg, #ffffff, #f8f9fa)'
          }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Novo Post
            </Typography>
            
            <CardMedia
              component="img"
              image={newPost.image}
              alt="Novo post"
              sx={{ borderRadius: 3, mb: 2 }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Escreva uma legenda..."
              value={newPost.caption}
              onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
              sx={{ mb: 2 }}
            />
            
            <Button
              fullWidth
              variant="contained"
              onClick={handleAddPost}
              disabled={!newPost.caption}
              sx={{
                background: 'linear-gradient(135deg, #2e7d32, #1976d2)',
                color: '#fff',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1976d2, #2e7d32)'
                }
              }}
            >
              Publicar
            </Button>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default Feed;