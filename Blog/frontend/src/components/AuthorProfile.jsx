import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Avatar,
} from "@mui/material";
import { CalendarToday, ArrowBack } from "@mui/icons-material";
import BlogCard from "./BlogCard";
import SearchBar from "./SearchBar";
import { getAuthorProfile } from "../api/usersApi";
import { getBlogsByAuthor } from "../api/blogApi";

export default function AuthorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [blogs, setBlogs] = useState({ items: [], totalCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 6;

  useEffect(() => {
    loadData();
  }, [id, page, search]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [authorData, blogsData] = await Promise.all([
        getAuthorProfile(id),
        getBlogsByAuthor(id, page, pageSize, search),
      ]);
      setAuthor(authorData);
      setBlogs(blogsData);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/")}
        sx={{ mb: 3 }}
      >
        Назад
      </Button>

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
          <Avatar
            sx={{ width: 80, height: 80, bgcolor: "primary.main", fontSize: "2rem" }}
          >
            {author.username[0].toUpperCase()}
          </Avatar>
          
          <Box>
            <Typography variant="h4" gutterBottom>
              {author.username}
            </Typography>
            {author.bio && (
              <Typography variant="body1" color="text.secondary">
                {author.bio}
              </Typography>
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
              <CalendarToday fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                На платформе с {formatDate(author.createdAt)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Блоги автора
        </Typography>
        <SearchBar onSearch={setSearch} />
      </Box>

      {blogs.items.length === 0 ? (
        <Card>
          <CardContent>
            <Typography align="center" color="text.secondary">
              {search ? "По вашему запросу ничего не найдено" : "У автора пока нет блогов"}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {blogs.items.map((blog) => (
            <Grid item key={blog.id} xs={12} sm={6} md={4}>
              <BlogCard blog={blog} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}