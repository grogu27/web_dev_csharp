import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import { AccountCircle, Home, Person, Add } from "@mui/icons-material";
import { isAuthenticated, getCurrentUserInfo, logout } from "../api/authApi";

export default function Header() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isLoggedIn = isAuthenticated();
  const user = getCurrentUserInfo();
  const isAdmin = user?.role === "Admin";

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleClose();
  };

  const handleProfile = () => {
    navigate("/profile");
    handleClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Мой Хабр
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button color="inherit" onClick={() => navigate("/")}>
            <Home sx={{ mr: 1 }} />
            Главная
          </Button>

          {isLoggedIn ? (
            <>
              <Button
                color="inherit"
                onClick={() => navigate("/create-blog")}
                startIcon={<Add />}
              >
                Создать блог
              </Button>

              <IconButton onClick={handleMenu} color="inherit">
                {user?.username ? (
                  <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}>
                    {user.username[0].toUpperCase()}
                  </Avatar>
                ) : (
                  <AccountCircle />
                )}
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>
                  <Person sx={{ mr: 1 }} />
                  Мой профиль
                </MenuItem>
                {isAdmin && (
                  <MenuItem onClick={() => navigate("/admin/users")}>
                    Пользователи
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>Выйти</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Вход
              </Button>
              <Button color="inherit" onClick={() => navigate("/register")}>
                Регистрация
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}