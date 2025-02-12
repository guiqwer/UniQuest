import { useState, useEffect } from "react";
import { Box, Paper, Avatar, Typography, Button, List, ListItem, ListItemIcon, ListItemText, Grid, Card, CardContent } from "@mui/material";
import { Share, ThumbUp, Comment } from "@mui/icons-material";
import { axiosInstance } from "../../axios";
import ExamModal from "./models/ExamModal";

const Interactions = () => {
  const [activeTab, setActiveTab] = useState("sharedExams");
  const [activities, setActivities] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatedExam, setGeneratedExam] = useState(null);
  const [openExamModal, setOpenExamModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const [sharedExamsRes, likedExamsRes, commentsRes, userRes] = await Promise.all([
          axiosInstance.get("/user/my-exams"),
          axiosInstance.get("/user/my-liked-exams"),
          axiosInstance.get("/user/my-comments-exams"),
          axiosInstance.get("/user/profile"),
        ]);

        const formatData = (data) =>
          data.map((item) => ({
            ...item,
            tags: item.tags || [],
            user: item.authorName || "Desconhecido",
            avatar: item.avatar
              ? `data:image/${item.avatar.startsWith("/9j/") ? "jpeg" : "png"};base64,${item.avatar}`
              : "https://via.placeholder.com/150",
            likes: item.likesCount || 0,
            itsLiked: item.itsLiked || false,
            date: "Agora mesmo",
            title: item.title || "Título não disponível",
            views: item.views || 0,
            id: item.id
          }));

        setActivities({
          sharedExams: { items: formatData(sharedExamsRes.data) },
          likedExams: { items: formatData(likedExamsRes.data) },
          comments: { items: formatData(commentsRes.data) },
        });

        setUserData({
          name: userRes.data.name,
          username: userRes.data.userName,
          avatar: userRes.data.avatar
            ? `data:image/${userRes.data.avatar.startsWith("/9j/") ? "jpeg" : "png"};base64,${userRes.data.avatar}`
            : "https://via.placeholder.com/150",
        });

        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar as interações:", error);
        setLoading(false);
      }
    };

    fetchInteractions();
  }, []);

  const generateExam = async (exam) => {
    setIsGenerating(true);
    try {
      console.log(exam)
      const examData = await axiosInstance.get(`/exam/view/${exam.id}`);
      if (exam.type === "text"){
        setGeneratedExam({
          id: examData.id,
          title: examData.data.title,
          description: examData.data.description,
          questions: examData.data.questions,
          type:examData.type,
          data:examData.data
        });
      } else {
        setGeneratedExam(exam)
      }
      console.log(generatedExam)
      setOpenExamModal(true);
    } catch (error) {
      console.error("Erro ao gerar a prova:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return <Typography>Carregando...</Typography>;
  if (!activities || !userData) return <Typography>Erro ao carregar os dados.</Typography>;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
      <Paper elevation={6} sx={{ display: "flex", width: "100%", maxWidth: "1200px", p: 4, borderRadius: 4 }}>
        <Box sx={{ width: "30%", pr: 3, borderRight: "1px solid #ddd", textAlign: "center" }}>
          <Avatar src={userData.avatar} sx={{ width: 120, height: 120, margin: "0 auto", mb: 2 }} />
          <Typography variant="h6">{userData.name}</Typography>
          <Typography variant="body1">@{userData.username}</Typography>
        </Box>

        <Box sx={{ width: "70%", pl: 3 }}>
          <Typography variant="h5">Histórico de interações</Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
            {["sharedExams", "likedExams", "comments"].map((tab) => (
              <Button key={tab} onClick={() => setActiveTab(tab)} variant={activeTab === tab ? "contained" : "outlined"}>
                {{ sharedExams: "Provas Compartilhadas", likedExams: "Provas Curtidas", comments: "Comentários" }[tab]}
              </Button>
            ))}
          </Box>

          <List>
            {activities[activeTab].items.map((exam, index) => (
              <ListItem key={index} onClick={() => generateExam(exam)} sx={{ cursor: "pointer", "&:hover": { bgcolor: "#f5f5f5" } }}>
                <ListItemIcon>
                  {activeTab === "sharedExams" ? <Share color="primary" /> : activeTab === "likedExams" ? <ThumbUp color="secondary" /> : <Comment color="action" />}
                </ListItemIcon>
                <ListItemText primary={exam.title} secondary={`${exam.date} • ${exam.views} downloads`} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>

      <ExamModal open={openExamModal} onClose={() => setOpenExamModal(false)} exam={generatedExam} />
    </Box>
  );
};

export default Interactions;