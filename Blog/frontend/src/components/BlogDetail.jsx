import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
} from "@mui/material";
import { CalendarToday, Person, Edit, Delete, ArrowBack } from "@mui/icons-material";
import { getBlogById, deleteBlog } from "../api/blogApi";
import { getCurrentUserInfo } from "../api/authApi";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = getCurrentUserInfo();
  const isOwner = user?.id === blog?.author?.id;
  const isAdmin = user?.role === "Admin";

  useEffect(() => {
    loadBlog();
  }, [id]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      const data = await getBlogById(id);
      setBlog(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Вы уверены, что хотите удалить этот блог?")) {
      try {
        await deleteBlog(id);
        navigate("/");
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          На главную
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/")}
        sx={{ mb: 3 }}
      >
        Назад
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            {blog.title}
          </Typography>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Person fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {blog.author?.username || "Неизвестный автор"}
              </Typography>
            </Box>
            
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarToday fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {formatDate(blog.createdAt)}
              </Typography>
            </Box>
            
            {/* {!blog.isPublished && (
              <Chip label="Черновик" color="warning" size="small" />
            )} */}
          </Box>

          {blog.author && (
            <Button
              size="small"
              onClick={() => navigate(`/author/${blog.author.id}`)}
            >
              Перейти в профиль автора
            </Button>
          )}

          {(isOwner || isAdmin) && (
            <Box sx={{ mt: 2 }}>
              <Button
                startIcon={<Edit />}
                onClick={() => navigate(`/edit-blog/${blog.id}`)}
                sx={{ mr: 1 }}
              >
                Редактировать
              </Button>
              <Button
                startIcon={<Delete />}
                color="error"
                onClick={handleDelete}
              >
                Удалить
              </Button>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
          {blog.content}
        </Typography>

        <Box sx={{ mt: 4, pt: 2, borderTop: "1px solid #eee" }}>
          <Typography variant="body2" color="text.secondary">
            Обновлено: {formatDate(blog.updatedAt)}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}