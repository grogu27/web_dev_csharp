import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Container, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Header from "./components/Header";
import BlogList from "./components/BlogList";
import BlogDetail from "./components/BlogDetail";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import AuthorProfile from "./components/AuthorProfile";
import CreateEditBlog from "./components/CreateEditBlog";
import AdminUsers from "./components/AdminUsers"; // Добавьте этот импорт
import NotFound from "./components/NotFound";
import { isAuthenticated, getCurrentUserInfo } from "./api/authApi";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

// Защищенный маршрут
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

// Маршрут только для администраторов
const AdminRoute = ({ children }) => {
  const user = getCurrentUserInfo();
  const isAdmin = user?.role === "Admin";
  
  return isAuthenticated() && isAdmin ? children : <Navigate to="/" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Header />
        <Container>
          <Routes>
            {/* Публичные маршруты */}
            <Route path="/" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/author/:id" element={<AuthorProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Защищенные маршруты */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/create-blog" element={
              <ProtectedRoute>
                <CreateEditBlog />
              </ProtectedRoute>
            } />
            <Route path="/edit-blog/:id" element={
              <ProtectedRoute>
                <CreateEditBlog />
              </ProtectedRoute>
            } />
            
            {/* Административные маршруты */}
            <Route path="/admin/users" element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            } />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;