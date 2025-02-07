import React from "react";
import { Box } from "@mui/material";

const ImageZoomModal = ({ image, onClose }) => {
  if (!image) return null;

  return (
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
      onClick={onClose}
    >
      <img
        src={image}
        alt="Zoom"
        style={{
          maxWidth: "90%",
          maxHeight: "90%",
          objectFit: "contain",
        }}
      />
    </Box>
  );
};

export default ImageZoomModal;
