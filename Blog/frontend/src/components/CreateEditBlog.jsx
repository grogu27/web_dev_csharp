import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { createBlog, updateBlog, getBlogById } from "../api/blogApi";

export default function CreateEditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingBlog, setLoadingBlog] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      loadBlog();
    }
  }, [id]);

  const loadBlog = async () => {
    try {
      const blog = await getBlogById(id);
      setTitle(blog.title);
      setContent(blog.content);
      setIsPublished(blog.isPublished);
      setLoadingBlog(false);
    } catch (err) {
      setError(err.message);
      setLoadingBlog(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError("Заполните все поля");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isEditMode) {
        await updateBlog(id, { title, content, isPublished });
        alert("Блог успешно обновлен!");
      } else {
        await createBlog(title, content);
        alert("Блог успешно создан!");
      }
      navigate(isEditMode ? `/blog/${id}` : "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingBlog) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <Typography>Загрузка...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Назад
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          {isEditMode ? "Редактирование блога" : "Создание нового блога"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Заголовок"
            fullWidth
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <TextField
            label="Содержание"
            fullWidth
            required
            multiline
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
            }
            label="Опубликовать"
            sx={{ mb: 3 }}
          />
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
          >
            {loading ? (isEditMode ? "Сохранение..." : "Создание...") : 
              (isEditMode ? "Сохранить изменения" : "Создать блог")}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}