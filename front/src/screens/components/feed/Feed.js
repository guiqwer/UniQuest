// src/components/Feed/Feed.js
import React, { useState, useEffect } from "react";
import { Box, Typography, SpeedDial, SpeedDialIcon, SpeedDialAction, Menu, MenuItem } from "@mui/material";
import { AddPhotoAlternate } from "@mui/icons-material";
import axiosInstance from '../../../axios';
import PostCard from "./PostCard";
import NewPostModal from "./NewPostModal";
import ImageZoomModal from "./ImageZoomModal";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [userAvatar, setUserAvatar] = useState("https://via.placeholder.com/150");
  const [newPost, setNewPost] = useState({
    image: "",
    caption: "",
    tags: [],
    questions: [],
    file: null,
    fileURL: ""
  });
  const [postType, setPostType] = useState(null);
  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [availableTags] = useState([
    "Prof. Igor Valente",
    "Prof. Adriano Blue",
    "Prof. Marcos Cirineu",
    "POO",
    "PLIN",
    "PEST",
  ]);
  const [openNewPostModal, setOpenNewPostModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    axiosInstance.get("/user/profile")
      .then((response) => {
        const data = response.data;
        setUserAvatar(data.avatar || "https://via.placeholder.com/150");
      })
      .catch((error) => {
        console.error("Erro ao buscar o perfil:", error);
      });
  }, []);

  const handleMenuOpen = (event, postId) => {
    setAnchorEl(event.currentTarget);
    setSelectedPostId(postId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPostId(null);
  };

  const handleDeletePost = () => {
    setPosts(posts.filter(post => post.id !== selectedPostId));
    handleMenuClose();
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

  const handleToggleComments = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, openComments: !post.openComments } : post
    ));
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

  const handlePublishPost = () => {
    const hasContent =
      newPost.caption ||
      newPost.image ||
      newPost.file ||
      (newPost.questions && newPost.questions.length > 0);

    if (hasContent) {
      const post = {
        id: posts.length + 1,
        user: "Usuário Atual",
        avatar: userAvatar,
        ...newPost,
        type: postType,
        fileName: newPost.file?.name || 'documento.pdf',
        likes: 0,
        comments: [],
        liked: false,
        date: "Agora mesmo",
        openComments: false,
      };
      setPosts([post, ...posts]);
      setNewPost({
        image: "",
        caption: "",
        tags: [],
        questions: [],
        file: null,
        fileURL: ""
      });
      setOpenNewPostModal(false);
      setPostType(null);
    }
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
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onToggleComments={handleToggleComments}
              onAddComment={handleAddComment}
              onMenuOpen={handleMenuOpen}
              onImageClick={(image) => setSelectedImage(image)}
            />
          ))
        )}
      </Box>

      {/* Menu de opções (três pontinhos) */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleDeletePost}>Excluir Post</MenuItem>
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

      <NewPostModal
        open={openNewPostModal}
        onClose={() => {
          setOpenNewPostModal(false);
          setPostType(null);
        }}
        postType={postType}
        setPostType={setPostType}
        newPost={newPost}
        setNewPost={setNewPost}
        availableTags={availableTags}
        onPublish={handlePublishPost}
      />

      {selectedImage && (
        <ImageZoomModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </Box>
  );
};

export default Feed;
