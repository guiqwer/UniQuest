import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Avatar, 
  IconButton,
  Divider,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  ListItemIcon
} from "@mui/material";
import {
  Assignment,
  Comment,
  Favorite,
  Close,
  Visibility,
  Forum,
  Share,
  ThumbUp,
  Task,
  RateReview
} from "@mui/icons-material";

const InteractionCard = ({ title, icon, children }) => (
  <Box sx={{ mb: 4 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      {icon}
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32' }}>
        {title}
      </Typography>
    </Box>
    {children}
  </Box>
);

const Interactions = ({ handleCloseModal }) => {
  const [activeTab, setActiveTab] = useState('sharedExams');
  
  const gradientStyle = {
    background: 'linear-gradient(45deg, #2e7d32 30%, #1976d2 90%)',
    color: 'white',
    borderRadius: '20px',
    px: 3,
    py: 1
  };

  const outlineStyle = {
    border: '2px solid #2e7d32',
    color: '#2e7d32',
    borderRadius: '20px',
    px: 3,
    py: 1,
    '&:hover': {
      border: '2px solid #1b5e20',
      bgcolor: 'rgba(46,125,50,0.04)'
    }
  };

  const activities = {
    sharedExams: {
      items: [
        {
          primary: "POO - 2024/1",
          date: "15/03/2024",
          views: "212"
        },
        {
          primary: "Discreta - 2023/2",
          date: "12/03/2024",
          views: "184"
        }
      ]
    },
    likedExams: {
      items: [
        {
          primary: "Prova de PEST",
          date: "12/03/2024",
          views: "132"
        },
        {
          primary: "P1 Fisica 2",
          date: "11/03/2024",
          views: "310"
        }
      ]
    },
    comments: {
      items: [
        {
          primary: "Tem a resposta da 3?",
          date: "14/03/2024",
          comments: "12"
        },
        {
          primary: "Essa ai é item B",
          date: "13/03/2024",
          comments: "5"
        }
      ]
    },
    solvedQuestions: {
      items: [
        {
          primary: "Questão 1 - Matemática",
          date: "10/03/2024",
          correct: 5,
          total: 5
        },
        {
          primary: "Questão 2 - Física",
          date: "09/03/2024",
          correct: 4,
          total: 5
        }
      ]
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
      <Paper elevation={6} sx={{
        display: 'flex',
        width: '100%',
        maxWidth: '1200px',
        p: 4,
        borderRadius: 4,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Lado Esquerdo - Perfil */}
        <Box sx={{ 
          width: '30%', 
          pr: 3, 
          borderRight: '1px solid #ddd',
          textAlign: 'center'
        }}>
          <Avatar 
            sx={{ 
              width: 120, 
              height: 120, 
              margin: '0 auto', 
              mb: 2,
              bgcolor: '#e0e0e0',
              color: '#757575'
            }}
          >
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32' }}>
            User
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#2e7d32', mb: 2 }}>
            @
          </Typography>
        </Box>

        <Box sx={{ 
          width: '70%', 
          pl: 3,
          maxHeight: '80vh',
          overflowY: 'auto',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-thumb': { 
            backgroundColor: '#bdbdbd',
            borderRadius: 3
          }
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 4
          }}>
            <Typography variant="h5" sx={{ fontWeight: 700, background: 'linear-gradient(45deg, #2e7d32 30%, #1976d2 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Histórico de interações
            </Typography>
          </Box>

          {/* Abas de Navegação */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mb: 4,
            flexWrap: 'wrap'
          }}>
            {['sharedExams', 'likedExams', 'comments'].map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                variant={activeTab === tab ? 'contained' : 'outlined'}
                sx={activeTab === tab ? gradientStyle : outlineStyle}
              >
                {{
                  sharedExams: 'Provas Compartilhadas',
                  likedExams: 'Provas Curtidas',
                  comments: 'Comentários'
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
              <Box sx={{ 
                maxHeight: 400, 
                overflowY: 'auto',
                '&::-webkit-scrollbar': { width: 6 },
                '&::-webkit-scrollbar-thumb': { 
                  backgroundColor: '#bdbdbd',
                  borderRadius: 3
                }
              }}>
                <List>
                  {activities.sharedExams.items.map((exam, index) => (
                    <ListItem 
                      key={index}
                      button
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
                        primary={exam.primary}
                        secondary={`${exam.date} • ${exam.views} downloads • Autor: User`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </InteractionCard>
          )}

          {activeTab === 'likedExams' && (
            <InteractionCard 
              title="Provas Curtidas" 
              icon={<ThumbUp sx={{ mr: 1, fontSize: 28 }} />}
            >
              <Box sx={{ 
                maxHeight: 400, 
                overflowY: 'auto',
                '&::-webkit-scrollbar': { width: 6 },
                '&::-webkit-scrollbar-thumb': { 
                  backgroundColor: '#bdbdbd',
                  borderRadius: 3
                }
              }}>
                <Grid container spacing={2}>
                  {activities.likedExams.items.map((exam, index) => (
                    <Grid item xs={6} key={index}>
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          borderRadius: 2,
                          cursor: 'pointer',
                          '&:hover': { boxShadow: 2 },
                          transition: 'all 0.3s'
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6">{exam.primary}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                            <Favorite color="error" sx={{ mr: 1 }} />
                            <Typography variant="body2" sx={{ color: '#666' }}>
                              Autor: User
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </InteractionCard>
          )}

          {activeTab === 'comments' && (
            <InteractionCard 
              title="Comentários Publicados" 
              icon={<Comment sx={{ mr: 1, fontSize: 28 }} />}
            >
              <Box sx={{ 
                maxHeight: 400, 
                overflowY: 'auto',
                '&::-webkit-scrollbar': { width: 6 },
                '&::-webkit-scrollbar-thumb': { 
                  backgroundColor: '#bdbdbd',
                  borderRadius: 3
                }
              }}>
                {activities.comments.items.map((comment, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      mb: 2, 
                      p: 2, 
                      bgcolor: '#f8f9fa', 
                      borderRadius: 2,
                      cursor: 'pointer',
                      '&:hover': { transform: 'translateX(5px)' },
                      transition: 'all 0.3s'
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#444' }}>
                      "{comment.primary}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <RateReview color="action" sx={{ fontSize: 16, mr: 1 }} />
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        {comment.date} • Autor: User
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </InteractionCard>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Interactions;