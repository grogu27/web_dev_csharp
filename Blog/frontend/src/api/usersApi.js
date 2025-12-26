const API_URL = "http://localhost:5228/api/users";

function getAuthHeader() {
  const token = localStorage.getItem("jwt");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

// Получить профиль автора
export async function getAuthorProfile(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  
  if (!res.ok) {
    if (res.status === 404) throw new Error("Автор не найден");
    const error = await res.json().catch(() => ({ message: "Ошибка при получении профиля автора" }));
    throw new Error(error.message || "Автор не найден");
  }
  
  return await res.json();
}

// Получить блоги автора с пагинацией
export async function getBlogsByAuthor(authorId, page = 1, pageSize = 10, search = "") {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(search && { search })
  });
  
  const res = await fetch(`${API_URL}/${authorId}/blogs?${params}`, {
    headers: getAuthHeader(),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Ошибка при получении блогов автора" }));
    throw new Error(error.message || "Ошибка при получении блогов автора");
  }
  
  return await res.json();
}

// Получить всех пользователей (только для админов)
export async function getAllUsers() {
  const res = await fetch("http://localhost:5228/api/auth/users", {
    headers: getAuthHeader(),
  });
  
  if (!res.ok) {
    if (res.status === 403) throw new Error("Нет прав администратора");
    const error = await res.json().catch(() => ({ message: "Ошибка при получении пользователей" }));
    throw new Error(error.message || "Ошибка при получении пользователей");
  }
  
  return await res.json();
}

// Удалить пользователя (только для админов)
export async function deleteUser(id) {
  const res = await fetch(`http://localhost:5228/api/auth/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Ошибка при удалении пользователя" }));
    throw new Error(error.message || `Не удалось удалить пользователя #${id}`);
  }
  
  return res.status === 204 ? {} : await res.json();
}