const API_URL = "http://localhost:5228/api/blog";

function getAuthHeader() {
  const token = localStorage.getItem("jwt");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

// Получить все блоги с пагинацией
export async function getAllBlogs(page = 1, pageSize = 10, search = "") {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(search && { search })
  });
  
  const res = await fetch(`${API_URL}?${params}`, {
    headers: getAuthHeader(),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Ошибка при получении блогов" }));
    throw new Error(error.message || "Ошибка при получении блогов");
  }
  
  return await res.json();
}

// Получить блог по ID
export async function getBlogById(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  
  if (!res.ok) {
    if (res.status === 404) throw new Error(`Блог с id ${id} не найден`);
    const error = await res.json().catch(() => ({ message: "Ошибка при получении блога" }));
    throw new Error(error.message || `Ошибка при получении блога #${id}`);
  }
  
  return await res.json();
}

// Создать блог
export async function createBlog(title, content) {
  const res = await fetch(API_URL, {
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

// Обновить блог
export async function updateBlog(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Ошибка при обновлении блога" }));
    throw new Error(error.message || `Ошибка при обновлении блога #${id}`);
  }
  
  return await res.json();
}

// Удалить блог
export async function deleteBlog(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Ошибка при удалении блога" }));
    throw new Error(error.message || `Не удалось удалить блог #${id}`);
  }
  
  return res.status === 204 ? {} : await res.json();
}

// Получить блоги автора
export async function getBlogsByAuthor(authorId, page = 1, pageSize = 10, search = "") {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(search && { search })
  });
  
  const res = await fetch(`http://localhost:5228/api/users/${authorId}/blogs?${params}`, {
    headers: getAuthHeader(),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Ошибка при получении блогов автора" }));
    throw new Error(error.message || "Ошибка при получении блогов автора");
  }
  
  return await res.json();
}