import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  TextField,
  Avatar,
  Chip,
  Divider,
  Collapse
} from "@mui/material";
import { FavoriteBorder, Favorite, Comment, MoreVert } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const PostCardContainer = styled(Card)(({ theme }) => ({
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

const PostCard = ({
  post,
  onLike,
  onToggleComments,
  onAddComment,
  onMenuOpen,
  onImageClick
}) => {
  const renderPostContent = () => {
    switch (post.type) {
      case "imagem":
        return (
          <Box sx={{ position: "relative", paddingTop: "100%", height: 0, mb: 2 }}>
            <CardMedia
              component="img"
              image={post.image}
              alt="Post"
              onClick={() => onImageClick(post.image)}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                cursor: "zoom-in",
              }}
            />
          </Box>
        );
      case "pdf":
        return (
          <Card
            variant="outlined"
            sx={{
              mb: 2,
              borderColor: "#e0e0e0",
              backgroundColor: "#f8f9fa"
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2
              }}
            >
              {/* Você pode adicionar aqui um ícone e os detalhes do PDF */}
              <Typography variant="subtitle1">{post.fileName}</Typography>
            </CardContent>
          </Card>
        );
      case "texto":
        return post.questions?.map((question, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="body1" color="text.secondary">
              Questão {index + 1}: {question}
            </Typography>
          </Box>
        ));
      default:
        return null;
    }
  };

  return (
    <PostCardContainer>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            padding: 2,
            background: "rgba(255,255,255,0.7)",
            borderRadius: 3,
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
          <IconButton onClick={(e) => onMenuOpen(e, post.id)}>
            <MoreVert />
          </IconButton>
        </Box>

        {renderPostContent()}

        <Typography variant="body1" sx={{ mb: 2, color: "#2d3436" }}>
          {post.caption}
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
          <IconButton onClick={() => onLike(post.id)}>
            {post.liked ? (
              <Favorite sx={{ color: "#ff1744" }} />
            ) : (
              <FavoriteBorder sx={{ color: "#636e72" }} />
            )}
          </IconButton>
          <IconButton onClick={() => onToggleComments(post.id)}>
            <Comment sx={{ color: post.openComments ? "#1976d2" : "#636e72" }} />
          </IconButton>
          <Typography variant="body2" sx={{ color: "#636e72", ml: 0.5, fontWeight: 500 }}>
            {post.likes} curtidas • {post.comments?.length || 0} comentários
          </Typography>
        </Box>

        <Collapse in={post.openComments}>
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
                  onAddComment(post.id, {
                    user: "Você",
                    text: e.target.value,
                    avatar: post.avatar,
                  });
                  e.target.value = "";
                }
              }}
              sx={{ mt: 1.5 }}
            />
          </Box>
        </Collapse>
      </CardContent>
    </PostCardContainer>
  );
};

export default PostCard;
