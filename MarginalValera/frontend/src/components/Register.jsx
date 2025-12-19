import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleRegister() {
    try {
      const res = await fetch("http://127.0.0.1:5202/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });
      if (!res.ok) throw new Error("Ошибка регистрации");
      alert("Регистрация прошла успешно!");
      navigate("/login");
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div>
      <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth sx={{ mb: 2 }} />
      <TextField label="Имя пользователя" value={username} onChange={e => setUsername(e.target.value)} fullWidth sx={{ mb: 2 }} />
      <TextField label="Пароль" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth sx={{ mb: 2 }} />
      <Button variant="contained" onClick={handleRegister}>Зарегистрироваться</Button>
    </div>
  );
}
