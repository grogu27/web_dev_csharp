const API_URL = "http://localhost:5228/api/auth";

function getAuthHeader() {
  const token = localStorage.getItem("jwt");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

// Регистрация
export async function register(email, username, password) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password }),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Ошибка регистрации" }));
    throw new Error(error.message || "Ошибка регистрации");
  }
  
  return await res.json();
}

// Вход
export async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Ошибка входа" }));
    throw new Error(error.message || "Ошибка входа");
  }
  
  const data = await res.json();
  localStorage.setItem("jwt", data.token);
  localStorage.setItem("user", JSON.stringify({
    id: data.userId,
    email: data.email,
    username: data.username,
    role: data.role
  }));
  
  return data;
}

// Получить информацию о текущем пользователе
export async function getCurrentUser() {
  const res = await fetch(`${API_URL}/me`, {
    headers: getAuthHeader(),
  });
  
  if (!res.ok) {
    if (res.status === 401) throw new Error("Не авторизован");
    const error = await res.json().catch(() => ({ message: "Ошибка при получении информации" }));
    throw new Error(error.message || "Не удалось получить информацию о пользователе");
  }
  
  return await res.json();
}

// Удалить свой аккаунт
export async function deleteMyAccount() {
  const res = await fetch(`${API_URL}/me`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Ошибка при удалении аккаунта" }));
    throw new Error(error.message || "Не удалось удалить аккаунт");
  }
  
  return res.status === 204 ? {} : await res.json();
}

// Выход
export function logout() {
  localStorage.removeItem("jwt");
  localStorage.removeItem("user");
}

// Проверить авторизацию
export function isAuthenticated() {
  return !!localStorage.getItem("jwt");
}

// Получить информацию о пользователе из localStorage
export function getCurrentUserInfo() {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}