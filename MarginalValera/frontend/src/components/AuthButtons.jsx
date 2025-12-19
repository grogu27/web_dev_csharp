import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function AuthButtons() {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");

  // Если токен есть, показываем только выход
  if (token) return null;

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <Button variant="contained" onClick={() => navigate("/login")}>
        Войти
      </Button>
      <Button variant="outlined" onClick={() => navigate("/register")}>
        Зарегистрироваться
      </Button>
    </div>
  );
}
