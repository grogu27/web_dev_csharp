import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 8, textAlign: "center" }}>
      <Typography variant="h1" color="primary" gutterBottom>
        404
      </Typography>
      <Typography variant="h4" gutterBottom>
        Страница не найдена
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Извините, запрашиваемая страница не существует или была перемещена.
      </Typography>
      <Box>
        <Button
          variant="contained"
          startIcon={<Home />}
          onClick={() => navigate("/")}
          size="large"
        >
          На главную
        </Button>
      </Box>
    </Container>
  );
}