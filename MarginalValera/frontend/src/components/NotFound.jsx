import React from "react";
import { Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Страница не найдена
      </Typography>
      <Typography sx={{ mb: 5 }}>
        Похоже, такой страницы не существует.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")}>
        На главную
      </Button>
    </Box>
  );
}
