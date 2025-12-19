const API_URL = "http://127.0.0.1:5202/api/valera";

function getAuthHeader() {
  const token = localStorage.getItem("jwt");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchValeras() {
  const res = await fetch(`${API_URL}/my`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error("Ошибка при получении списка Валер");
  return await res.json();
}

export async function fetchValera(id) {
  const res = await fetch(`${API_URL}/${id}`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error(`Валера с id ${id} не найдена`);
  return await res.json();
}

export async function createValera(valera) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(valera),
  });
  if (!res.ok) throw new Error("Ошибка при создании Валеры");
  return await res.json();
}

export async function deleteValera(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error(`Не удалось удалить Валеру #${id}`);
}

export async function doAction(id, action) {
  const res = await fetch(`${API_URL}/${id}/${action}`, {
    method: "POST",
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error(`Не удалось выполнить действие: ${action}`);
  return await res.json();
}
