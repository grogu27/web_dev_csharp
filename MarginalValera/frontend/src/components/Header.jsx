import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const token = localStorage.getItem("jwt");
  let username = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      username = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || payload.name;
    } catch (e) {
      console.error("Invalid JWT", e);
    }
  }

  function handleLogout() {
    localStorage.removeItem("jwt");
    navigate("/login");
  }

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" component="div" sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          Marginal Valera
        </Typography>

        <div>
          {username && <Typography variant="subtitle1" component="span" sx={{ mr: 2 }}> {username}</Typography>}

          {token ? (
            <Button color="inherit" onClick={handleLogout}>Выйти</Button>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/login")}>Вход</Button>
              <Button color="inherit" onClick={() => navigate("/register")}>Регистрация</Button>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}
