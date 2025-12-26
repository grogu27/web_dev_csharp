// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Container,
//   Grid,
//   Typography,
//   Box,
//   Button,
//   CircularProgress,
//   Alert,
// } from "@mui/material";
// import { Add } from "@mui/icons-material";
// import BlogCard from "./BlogCard";
// import SearchBar from "./SearchBar";
// import Pagination from "./Pagination";
// import { getAllBlogs, deleteBlog } from "../api/blogApi";
// import { getCurrentUserInfo, isAuthenticated } from "../api/authApi";

// export default function BlogList() {
//   const navigate = useNavigate();
//   const [blogs, setBlogs] = useState({ items: [], totalCount: 0, totalPages: 0 });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(9);
//   const [search, setSearch] = useState("");

//   const user = getCurrentUserInfo();
//   const isLoggedIn = isAuthenticated();

//   const loadBlogs = async () => {
//     try {
//       setLoading(true);
//       const data = await getAllBlogs(page, pageSize, search);
//       setBlogs(data);
//       setError("");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadBlogs();
//   }, [page, pageSize, search]);

//   const handleSearch = (searchTerm) => {
//     setSearch(searchTerm);
//     setPage(1);
//   };

//   const handleDelete = async (blogId) => {
//     if (window.confirm("Вы уверены, что хотите удалить этот блог?")) {
//       try {
//         await deleteBlog(blogId);
//         loadBlogs();
//       } catch (err) {
//         alert(err.message);
//       }
//     }
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
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
//       <Box sx={{ mb: 4 }}>
//         <Typography variant="h4" gutterBottom>
//           Все блоги
//         </Typography>
        
//         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
//           <SearchBar onSearch={handleSearch} />
          
//           {isLoggedIn && (
//             <Button
//               variant="contained"
//               startIcon={<Add />}
//               onClick={() => navigate("/create-blog")}
//             >
//               Создать блог
//             </Button>
//           )}
//         </Box>

//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}
//       </Box>

//       {blogs.items.length === 0 ? (
//         <Typography variant="h6" align="center" color="text.secondary">
//           {search ? "По вашему запросу ничего не найдено" : "Пока нет блогов"}
//         </Typography>
//       ) : (
//         <>
//           <Grid container spacing={3}>
//             {blogs.items.map((blog) => (
//               <Grid item key={blog.id} xs={12} sm={6} md={4}>
//                 <BlogCard
//                   blog={blog}
//                   onDelete={handleDelete}
//                   isOwner={user?.id === blog.author?.id}
//                 />
//               </Grid>
//             ))}
//           </Grid>

//           <Pagination
//             page={page}
//             totalPages={blogs.totalPages}
//             totalCount={blogs.totalCount}
//             pageSize={pageSize}
//             onPageChange={handlePageChange}
//             onPageSizeChange={(newSize) => {
//               setPageSize(newSize);
//               setPage(1);
//             }}
//           />
//         </>
//       )}
//     </Container>
//   );
// }
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import { Add, Clear } from "@mui/icons-material";
import BlogCard from "./BlogCard";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import { getAllBlogs, deleteBlog } from "../api/blogApi";
import { getCurrentUserInfo, isAuthenticated } from "../api/authApi";

export default function BlogList() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState({ items: [], totalCount: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [search, setSearch] = useState("");

  const user = getCurrentUserInfo();
  const isLoggedIn = isAuthenticated();

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await getAllBlogs(page, pageSize, search);
      setBlogs(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, [page, pageSize, search]);

  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearch("");
    setPage(1);
  };

  const handleDelete = async (blogId) => {
    if (window.confirm("Вы уверены, что хотите удалить этот блог?")) {
      try {
        await deleteBlog(blogId);
        loadBlogs();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        {/* <Typography variant="h4" gutterBottom>
          Все блоги
          {search && (
            <Chip
              label={`Поиск: "${search}"`}
              color="primary"
              size="small"
              onDelete={handleClearSearch}
              deleteIcon={<Clear />}
              sx={{ ml: 2 }}
            />
          )}
        </Typography> */}
        
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <SearchBar onSearch={handleSearch} />
          
          {isLoggedIn && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("/create-blog")}
            >
              Создать блог
            </Button>
          )}
        </Box>

        {/* Показать поисковый запрос */}
        {search && (
          <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body1" color="text.secondary">
              Результаты поиска по запросу: <strong>"{search}"</strong>
            </Typography>
            <Button
              size="small"
              startIcon={<Clear />}
              onClick={handleClearSearch}
            >
              Показать все
            </Button>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
      </Box>

      {blogs.items.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h5" gutterBottom color="text.secondary">
            {search ? "По вашему запросу ничего не найдено" : "Пока нет блогов"}
          </Typography>
          {search && (
            <Button
              variant="outlined"
              onClick={handleClearSearch}
              sx={{ mt: 2 }}
            >
              Показать все блоги
            </Button>
          )}
        </Box>
      ) : (
        <>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Найдено {blogs.totalCount} {blogs.totalCount === 1 ? "блог" : 
              blogs.totalCount > 1 && blogs.totalCount < 5 ? "блога" : "блогов"}
          </Typography>
          
          <Grid container spacing={3}>
            {blogs.items.map((blog) => (
              <Grid item key={blog.id} xs={12} sm={6} md={4}>
                <BlogCard
                  blog={blog}
                  onDelete={handleDelete}
                  isOwner={user?.id === blog.author?.id}
                />
              </Grid>
            ))}
          </Grid>

          <Pagination
            page={page}
            totalPages={blogs.totalPages}
            totalCount={blogs.totalCount}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPage(1);
            }}
          />
        </>
      )}
    </Container>
  );
}