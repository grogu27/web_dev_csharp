const API_URL = "http://localhost:5228/api/profile";

function getAuthHeader() {
  const token = localStorage.getItem("jwt");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

// Получить свой профиль
export async function getMyProfile() {
  const res = await fetch(`${API_URL}/me`, {
    headers: getAuthHeader(),
  });
  
  if (!res.ok) {
    if (res.status === 401) throw new Error("Не авторизован");
    const error = await res.json().catch(() => ({ message: "Ошибка при получении профиля" }));
    throw new Error(error.message || "Ошибка при получении профиля");
  }
  
  return await res.json();
}

// Получить свои блоги
export async function getMyBlogs(page = 1, pageSize = 10, search = "") {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(search && { search })
  });
  
  const res = await fetch(`${API_URL}/me/blogs?${params}`, {
    headers: getAuthHeader(),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Ошибка при получении блогов" }));
    throw new Error(error.message || "Ошибка при получении блогов");
  }
  
  return await res.json();
}

// Обновить профиль
export async function updateProfile(username, bio) {
  const res = await fetch(`${API_URL}/me`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify({ username, bio }),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Ошибка при обновлении профиля" }));
    throw new Error(error.message || "Ошибка при обновлении профиля");
  }
  
  return await res.json();
}

// Создать блог в профиле
export async function createMyBlog(title, content) {
  const res = await fetch(`${API_URL}/me/blogs`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify({ title, content }),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Ошибка при создании блога" }));
    throw new Error(error.message || "Ошибка при создании блога");
  }
  
  return await res.json();
}