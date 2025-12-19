import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchValeras, createValera, deleteValera } from "../api/valeraApi";
import ValeraCard from "./ValeraCard";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

export default function ValeraList() {
  const [valeras, setValeras] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [q, setQ] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: "", health: 100, alcohol: 0, cheerfulness: 0, fatigue: 0, money: 0 });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) navigate("/login");
    else load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchValeras();
      setValeras(data);
      setFiltered(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    const ql = q.trim().toLowerCase();
    setFiltered(ql ? valeras.filter(v => (v.name || `Валера #${v.id}`).toLowerCase().includes(ql)) : valeras);
  }, [q, valeras]);

  function openCreate() { setForm({ name: "", health: 100, alcohol: 0, cheerfulness: 0, fatigue: 0, money: 0 }); setCreateOpen(true); }
  function handleChange(field, value) { setForm({ ...form, [field]: value === "" ? 0 : Number(value) }); }

  async function handleCreate() {
    try { await createValera(form); setCreateOpen(false); await load(); } 
    catch (e) { alert("Ошибка при создании: " + e.message); }
  }

  async function handleDelete(id) {
    if (!window.confirm(`Вы точно хотите удалить Валеру #${id}?`)) return;
    try { await deleteValera(id); await load(); } 
    catch (e) { alert("Ошибка при удалении: " + e.message); }
  }

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField label="Поиск по имени" value={q} onChange={(e) => setQ(e.target.value)} fullWidth />
        <Button variant="contained" onClick={openCreate}>Создать Валеру</Button>
      </Box>

      {loading && <Typography>Загрузка...</Typography>}

      <Grid container spacing={2}>
        {filtered.map(v => (
          <Grid item xs={12} sm={6} md={4} key={v.id}>
            <ValeraCard valera={v} onClick={() => navigate(`/valera/${v.id}`)} />
            <Button fullWidth variant="outlined" color="error" sx={{ mt: 1 }} onClick={() => handleDelete(v.id)}>Удалить</Button>
          </Grid>
        ))}
      </Grid>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
        <DialogTitle>Создать Валеру</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: 360, mt: 1 }}>
            <TextField label="Имя (необязательно)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <TextField label="Здоровье" type="number" value={form.health} onChange={(e) => handleChange("health", e.target.value)} />
            <TextField label="Алкоголь" type="number" value={form.alcohol} onChange={(e) => handleChange("alcohol", e.target.value)} />
            <TextField label="Жизнерадостность" type="number" value={form.cheerfulness} onChange={(e) => handleChange("cheerfulness", e.target.value)} />
            <TextField label="Усталость" type="number" value={form.fatigue} onChange={(e) => handleChange("fatigue", e.target.value)} />
            <TextField label="Деньги" type="number" value={form.money} onChange={(e) => handleChange("money", e.target.value)} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleCreate}>Создать</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
