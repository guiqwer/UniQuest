import React, { useState } from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  Avatar, 
  Button,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip
} from "@mui/material";
import {
  Share,
  ThumbUp,
  Comment,
  Task,
  Download,
  Favorite,
  RateReview
} from "@mui/icons-material";

const ProfileInteractions = ({ navigate }) => {
  const [user] = useState({
    name: "Usuário Teste",
    displayName: "@teste_user",
    avatar: "https://via.placeholder.com/150",
    memberSince: "01/01/2024"
  });

  const [activeTab, setActiveTab] = useState('sharedExams');
  const [selectedItem, setSelectedItem] = useState(null);

  const interactions = {
    sharedExams: [
      { id: 1, title: "Prova de Cálculo II", date: "15/03/2024", downloads: 42, author: "@teste_user" },
      { id: 2, title: "Prova de Álgebra Linear", date: "20/03/2024", downloads: 28, author: "@teste_user" }
    ],
    likedExams: [
      { id: 1, title: "Prova de Física III", author: "@maria_silva" },
      { id: 2, title: "Prova de Química Orgânica", author: "@joao_pereira" }
    ],
    comments: [
      { id: 1, content: "Ótima organização das questões!", exam: "Prova de Arquitetura de Computadores", author: "@juninho_play" },
      { id: 2, content: "Material muito completo, ajudou bastante!", exam: "Prova de Probabilidade", author: "@pimenta" }
    ],
    solvedQuestions: [
      { id: 1, title: "Programação Linear", author: "@fhweuh", correct: 18, total: 20 },
      { id: 2, title: "Estrutura de Dados", author: "@fnejfnena", correct: 15, total: 15 }
    ]
  };

  const handleInteractionClick = (type, item) => {
    setSelectedItem(item);
    console.log(`Interação selecionada: ${type}`, item);
  };

  const InteractionCard = ({ title, icon, children }) => (
    <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', color: '#2e7d32' }}>
          {icon}
          {title}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {children}
      </CardContent>
    </Card>
  );

  const gradientStyle = {
    background: 'linear-gradient(135deg, #2e7d32, #1976d2)',
    color: 'white',
    '&:hover': {
      background: 'linear-gradient(135deg, #1976d2, #2e7d32)'
    }
  };

  const outlineStyle = {
    border: '2px solid',
    borderColor: '#2e7d32',
    color: '#2e7d32',
    '&:hover': {
      borderColor: '#1976d2',
      color: '#1976d2'
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2e7d32, #1976d2)',
      p: 2
    }}>
      <Paper sx={{
        width: '100%',
        maxWidth: '1200px',
        borderRadius: 4,
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.97)'
      }}>
        {/* Barra de Navegação Superior */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 4,
          borderBottom: '1px solid #eee',
          pb: 2,
          p: 4
        }}>
          <Button
            variant="outlined"
            onClick={() => navigate("profile")}
            sx={outlineStyle}
          >
            Perfil
          </Button>
          <Button
            variant="contained"
            sx={gradientStyle}
          >
            Histórico de Interações
          </Button>
        </Box>

        <Grid container>
          {/* Sidebar */}
          <Grid item xs={12} md={3} sx={{
            bgcolor: '#f8f9fa',
            p: 4,
            borderRight: '1px solid #eee',
            textAlign: 'center'
          }}>
            <Avatar
              src={user.avatar}
              sx={{ width: 120, height: 120, mb: 3, mx: 'auto' }}
            />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              {user.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 3, color: '#666' }}>
              {user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ color: '#888' }}>
              Membro desde: {user.memberSince}
            </Typography>
          </Grid>

          {/* Conteúdo Principal */}
          <Grid item xs={12} md={9} sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, color: '#2e7d32' }}>
              Histórico de Interações
            </Typography>

            {/* Abas de Navegação */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              mb: 4,
              flexWrap: 'wrap'
            }}>
              {['sharedExams', 'likedExams', 'comments', 'solvedQuestions'].map((tab) => (
                <Button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  variant={activeTab === tab ? 'contained' : 'outlined'}
                  sx={activeTab === tab ? gradientStyle : outlineStyle}
                >
                  {{
                    sharedExams: 'Provas Compartilhadas',
                    likedExams: 'Provas Curtidas',
                    comments: 'Comentários',
                    solvedQuestions: 'Questões Resolvidas'
                  }[tab]}
                </Button>
              ))}
            </Box>

            {/* Conteúdo das Abas */}
            {activeTab === 'sharedExams' && (
              <InteractionCard 
                title="Provas Compartilhadas" 
                icon={<Share sx={{ mr: 1, fontSize: 28 }} />}
              >
                <List>
                  {interactions.sharedExams.map((exam) => (
                    <ListItem 
                      key={exam.id}
                      button
                      onClick={() => handleInteractionClick('sharedExam', exam)}
                      sx={{
                        '&:hover': { bgcolor: '#f5f5f5' },
                        transition: 'background-color 0.3s',
                        borderRadius: 2,
                        mb: 1
                      }}
                    >
                      <ListItemIcon>
                        <Share color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={exam.title}
                        secondary={`${exam.date} • ${exam.downloads} downloads • Autor: ${exam.author}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </InteractionCard>
            )}

            {activeTab === 'likedExams' && (
              <InteractionCard 
                title="Provas Curtidas" 
                icon={<ThumbUp sx={{ mr: 1, fontSize: 28 }} />}
              >
                <Grid container spacing={2}>
                  {interactions.likedExams.map((exam) => (
                    <Grid item xs={6} key={exam.id}>
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          borderRadius: 2,
                          cursor: 'pointer',
                          '&:hover': { boxShadow: 2 },
                          transition: 'all 0.3s'
                        }}
                        onClick={() => handleInteractionClick('likedExam', exam)}
                      >
                        <CardContent>
                          <Typography variant="h6">{exam.title}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                            <Favorite color="error" sx={{ mr: 1 }} />
                            <Typography variant="body2" sx={{ color: '#666' }}>
                              Autor: {exam.author}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </InteractionCard>
            )}

            {activeTab === 'comments' && (
              <InteractionCard 
                title="Comentários Publicados" 
                icon={<Comment sx={{ mr: 1, fontSize: 28 }} />}
              >
                {interactions.comments.map((comment) => (
                  <Box 
                    key={comment.id} 
                    sx={{ 
                      mb: 2, 
                      p: 2, 
                      bgcolor: '#f8f9fa', 
                      borderRadius: 2,
                      cursor: 'pointer',
                      '&:hover': { transform: 'translateX(5px)' },
                      transition: 'all 0.3s'
                    }}
                    onClick={() => handleInteractionClick('comment', comment)}
                  >
                    <Typography variant="body2" sx={{ color: '#444' }}>
                      "{comment.content}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <RateReview color="action" sx={{ fontSize: 16, mr: 1 }} />
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        {comment.exam} • Autor: {comment.author}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </InteractionCard>
            )}

            {activeTab === 'solvedQuestions' && (
              <InteractionCard 
                title="Questões Resolvidas" 
                icon={<Task sx={{ mr: 1, fontSize: 28 }} />}
              >
                <Grid container spacing={2}>
                  {interactions.solvedQuestions.map((question) => (
                    <Grid item xs={6} key={question.id}>
                      <Box 
                        sx={{ 
                          p: 2,
                          border: '1px solid #e0e0e0',
                          borderRadius: 2,
                          textAlign: 'center',
                          cursor: 'pointer',
                          '&:hover': { bgcolor: '#f5f5f5' },
                          transition: 'background-color 0.3s'
                        }}
                        onClick={() => handleInteractionClick('solvedQuestion', question)}
                      >
                        <Typography variant="h6">{question.title}</Typography>
                        <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                          Autor: {question.author}
                        </Typography>
                        <Typography variant="h4" sx={{ my: 1, color: '#2e7d32' }}>
                          {question.correct}/{question.total}
                        </Typography>
                        <Typography variant="caption">acertos</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </InteractionCard>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProfileInteractions;