// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Container,
//   Paper,
//   Typography,
//   Box,
//   Button,
//   TextField,
//   Grid,
//   Card,
//   CardContent,
//   CircularProgress,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import { Edit, Delete, Add, CalendarToday } from "@mui/icons-material";
// import BlogCard from "./BlogCard";
// import SearchBar from "./SearchBar";
// import { getMyProfile, updateProfile, getMyBlogs } from "../api/profileApi";
// import { deleteMyAccount } from "../api/authApi";
// import { deleteBlog } from "../api/blogApi";

// export default function Profile() {
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState(null);
//   const [blogs, setBlogs] = useState({ items: [], totalCount: 0 });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [editing, setEditing] = useState(false);
//   const [editForm, setEditForm] = useState({ username: "", bio: "" });
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const [deleteDialog, setDeleteDialog] = useState(false);
//   const pageSize = 6;

//   useEffect(() => {
//     loadData();
//   }, [page, search]);

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       const [profileData, blogsData] = await Promise.all([
//         getMyProfile(),
//         getMyBlogs(page, pageSize, search),
//       ]);
//       setProfile(profileData);
//       setBlogs(blogsData);
//       setEditForm({
//         username: profileData.username,
//         bio: profileData.bio || "",
//       });
//       setError("");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       await updateProfile(editForm.username, editForm.bio);
//       setEditing(false);
//       loadData();
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   const handleDeleteAccount = async () => {
//     try {
//       await deleteMyAccount();
//       localStorage.clear();
//       navigate("/login");
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   const handleDeleteBlog = async (blogId) => {
//     if (window.confirm("Вы уверены, что хотите удалить этот блог?")) {
//       try {
//         await deleteBlog(blogId);
//         loadData();
//       } catch (err) {
//         alert(err.message);
//       }
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("ru-RU", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });
//   };

//   if (loading) {
//     return (
//       <Container sx={{ mt: 4, textAlign: "center" }}>
//         <CircularProgress />
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//       <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
//         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
//           <Box>
//             <Typography variant="h4" gutterBottom>
//               {profile.username}
//             </Typography>
//             <Typography color="text.secondary" gutterBottom>
//               {profile.email}
//             </Typography>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
//               <CalendarToday fontSize="small" />
//               <Typography variant="body2" color="text.secondary">
//                 Зарегистрирован: {formatDate(profile.createdAt)}
//               </Typography>
//             </Box>
//             <Typography variant="body1" sx={{ mt: 2 }}>
//               {profile.bio || "Нет описания"}
//             </Typography>
//             <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
//               Блогов: {profile.blogCount}
//             </Typography>
//           </Box>
          
//           <Box>
//             <Button
//               startIcon={<Edit />}
//               onClick={() => setEditing(!editing)}
//               sx={{ mr: 1 }}
//             >
//               Редактировать
//             </Button>
//             <Button
//               startIcon={<Delete />}
//               color="error"
//               onClick={() => setDeleteDialog(true)}
//             >
//               Удалить аккаунт
//             </Button>
//           </Box>
//         </Box>

//         {editing && (
//           <Box sx={{ mt: 3, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
//             <Typography variant="h6" gutterBottom>
//               Редактирование профиля
//             </Typography>
//             <TextField
//               label="Имя пользователя"
//               fullWidth
//               value={editForm.username}
//               onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               label="О себе"
//               fullWidth
//               multiline
//               rows={3}
//               value={editForm.bio}
//               onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
//               sx={{ mb: 2 }}
//             />
//             <Box>
//               <Button
//                 variant="contained"
//                 onClick={handleUpdate}
//                 sx={{ mr: 1 }}
//               >
//                 Сохранить
//               </Button>
//               <Button onClick={() => setEditing(false)}>
//                 Отмена
//               </Button>
//             </Box>
//           </Box>
//         )}

//         {error && (
//           <Alert severity="error" sx={{ mt: 2 }}>
//             {error}
//           </Alert>
//         )}
//       </Paper>

//       <Box sx={{ mb: 3 }}>
//         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
//           <Typography variant="h5">
//             Мои блоги
//           </Typography>
//           <Button
//             variant="contained"
//             startIcon={<Add />}
//             onClick={() => navigate("/create-blog")}
//           >
//             Создать блог
//           </Button>
//         </Box>
        
//         <SearchBar onSearch={setSearch} />
//       </Box>

//       {blogs.items.length === 0 ? (
//         <Card>
//           <CardContent>
//             <Typography align="center" color="text.secondary">
//               {search ? "По вашему запросу ничего не найдено" : "У вас пока нет блогов"}
//             </Typography>
//           </CardContent>
//         </Card>
//       ) : (
//         <Grid container spacing={3}>
//           {blogs.items.map((blog) => (
//             <Grid item key={blog.id} xs={12} sm={6} md={4}>
//               <BlogCard
//                 blog={blog}
//                 onDelete={handleDeleteBlog}
//                 isOwner={true}
//               />
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
//         <DialogTitle>Удаление аккаунта</DialogTitle>
//         <DialogContent>
//           <Typography>
//             Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить.
//             Все ваши блоги также будут удалены.
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteDialog(false)}>Отмена</Button>
//           <Button onClick={handleDeleteAccount} color="error">
//             Удалить
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// }
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit, Delete, Add, CalendarToday } from "@mui/icons-material";
import BlogCard from "./BlogCard";
import SearchBar from "./SearchBar";
import { getMyProfile, updateProfile, getMyBlogs } from "../api/profileApi";
import { deleteMyAccount } from "../api/authApi";
import { deleteBlog } from "../api/blogApi";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState({ items: [], totalCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ username: "", bio: "" });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const pageSize = 6;

  useEffect(() => {
    loadData();
  }, [page, search]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileData, blogsData] = await Promise.all([
        getMyProfile(),
        getMyBlogs(page, pageSize, search),
      ]);
      setProfile(profileData);
      setBlogs(blogsData);
      setEditForm({
        username: profileData.username,
        bio: profileData.bio || "",
      });
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateProfile(editForm.username, editForm.bio);
      setEditing(false);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteMyAccount();
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm("Вы уверены, что хотите удалить этот блог?")) {
      try {
        await deleteBlog(blogId);
        loadData();
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
    });
  };

  // Показываем загрузку
  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  // Если нет профиля (ошибка или не авторизован)
  if (!profile) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" color="error" gutterBottom>
            Не удалось загрузить профиль
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {error || "Пожалуйста, войдите в систему"}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/login")}
          >
            Войти
          </Button>
        </Paper>
      </Container>
    );
  }

  // Основной рендер когда есть профиль
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {profile.username || "Без имени"}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {profile.email || "Нет email"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
              <CalendarToday fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                Зарегистрирован: {formatDate(profile.createdAt)}
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {profile.bio || "Нет описания"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Блогов: {profile.blogCount || 0}
            </Typography>
          </Box>
          
          <Box>
            <Button
              startIcon={<Edit />}
              onClick={() => setEditing(!editing)}
              sx={{ mr: 1 }}
            >
              Редактировать
            </Button>
            <Button
              startIcon={<Delete />}
              color="error"
              onClick={() => setDeleteDialog(true)}
            >
              Удалить аккаунт
            </Button>
          </Box>
        </Box>

        {editing && (
          <Box sx={{ mt: 3, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Редактирование профиля
            </Typography>
            <TextField
              label="Имя пользователя"
              fullWidth
              value={editForm.username}
              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="О себе"
              fullWidth
              multiline
              rows={3}
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Box>
              <Button
                variant="contained"
                onClick={handleUpdate}
                sx={{ mr: 1 }}
              >
                Сохранить
              </Button>
              <Button onClick={() => setEditing(false)}>
                Отмена
              </Button>
            </Box>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5">
            Мои блоги
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/create-blog")}
          >
            Создать блог
          </Button>
        </Box>
        
        <SearchBar onSearch={setSearch} />
      </Box>

      {blogs.items.length === 0 ? (
        <Card>
          <CardContent>
            <Typography align="center" color="text.secondary">
              {search ? "По вашему запросу ничего не найдено" : "У вас пока нет блогов"}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {blogs.items.map((blog) => (
            <Grid item key={blog.id} xs={12} sm={6} md={4}>
              <BlogCard
                blog={blog}
                onDelete={handleDeleteBlog}
                isOwner={true}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Удаление аккаунта</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить.
            Все ваши блоги также будут удалены.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Отмена</Button>
          <Button onClick={handleDeleteAccount} color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}