import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
} from "@mui/material";
import { CalendarToday, Person, Edit, Delete } from "@mui/icons-material";
import { getCurrentUserInfo } from "../api/authApi";

export default function BlogCard({ blog, onDelete, isOwner = false }) {
  const navigate = useNavigate();
  const user = getCurrentUserInfo();
  const isAdmin = user?.role === "Admin";

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const excerpt = blog.excerpt || 
    (blog.content.length > 150 
      ? blog.content.substring(0, 150) + "..." 
      : blog.content);

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {blog.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {excerpt}
        </Typography>
        
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
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
        </Box>
        
        {/* {!blog.isPublished && (
          <Chip label="Черновик" color="warning" size="small" />
        )} */}
      </CardContent>
      
      <CardActions>
        <Button
          size="small"
          onClick={() => navigate(`/blog/${blog.id}`)}
        >
          Читать
        </Button>
        
        {blog.author && (
          <Button
            size="small"
            onClick={() => navigate(`/author/${blog.author.id}`)}
          >
            Профиль автора
          </Button>
        )}
        
        {(isOwner || isAdmin) && (
          <>
            <Button
              size="small"
              startIcon={<Edit />}
              onClick={() => navigate(`/edit-blog/${blog.id}`)}
            >
              Редактировать
            </Button>
            <Button
              size="small"
              color="error"
              startIcon={<Delete />}
              onClick={() => onDelete(blog.id)}
            >
              Удалить
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
}