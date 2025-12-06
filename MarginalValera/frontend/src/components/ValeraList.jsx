// import React, { useEffect, useState } from "react";
// import Grid from "@mui/material/Grid";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import Box from "@mui/material/Box";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import DialogActions from "@mui/material/DialogActions";
// import Typography from "@mui/material/Typography";
// import { useNavigate } from "react-router-dom";
// import ValeraCard from "./ValeraCard";
// import { fetchValeras, createValera, deleteValera } from "../api/valeraApi";

// export default function ValeraList() {
//   const [valeras, setValeras] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [q, setQ] = useState("");
//   const [createOpen, setCreateOpen] = useState(false);
//   const [form, setForm] = useState({
//     name: "",
//     health: 100,
//     alcohol: 0,
//     cheerfulness: 0,
//     fatigue: 0,
//     money: 0,
//   });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   async function load() {
//     setLoading(true);
//     try {
//       const data = await fetchValeras();
//       setValeras(data);
//       setFiltered(data);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => { load(); }, []);

//   useEffect(() => {
//     const ql = q.trim().toLowerCase();
//     if (!ql) setFiltered(valeras);
//     else setFiltered(
//       valeras.filter(v => (v.name || `Валера #${v.id}`).toLowerCase().includes(ql))
//     );
//   }, [q, valeras]);

//   function openCreate() {
//     setForm({ name: "", health: 100, alcohol: 0, cheerfulness: 0, fatigue: 0, money: 0 });
//     setCreateOpen(true);
//   }

//   function handleChange(field, value) {
//     // Убираем ведущие нули и сохраняем число
//     const clean = value.replace(/^0+(?=\d)/, "");
//     setForm({ ...form, [field]: clean === "" ? 0 : parseInt(clean) });
//   }

//   async function handleCreate() {
//     try {
//       const valeraData = {
//         name: form.name || undefined, // если имя пустое, бэкенд сам присвоит Валера #ID
//         health: Number(form.health),
//         alcohol: Number(form.alcohol),
//         cheerfulness: Number(form.cheerfulness),
//         fatigue: Number(form.fatigue),
//         money: Number(form.money),
//       };
//       await createValera(valeraData);
//       setCreateOpen(false);
//       await load();
//     } catch (e) {
//       console.error(e);
//       alert("Ошибка при создании: " + e.message);
//     }
//   }

//   return (
//     <Box>
//       <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
//         <TextField
//           label="Поиск по имени"
//           value={q}
//           onChange={(e) => setQ(e.target.value)}
//           fullWidth
//         />
//         <Button variant="contained" onClick={openCreate}>Создать Валеру</Button>
//       </Box>

//       {loading && <Typography>Загрузка...</Typography>}

//       <Grid container spacing={2}>
//         {filtered.map((v) => (
//           <Grid item xs={12} sm={6} md={4} key={v.id}>
//             <ValeraCard valera={v} onClick={() => navigate(`/valera/${v.id}`)} />
//           </Grid>
//         ))}
//         {filtered.length === 0 && !loading && <Typography>Список пуст</Typography>}
//       </Grid>

//       <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
//         <DialogTitle>Создать Валеру</DialogTitle>
//         <DialogContent>
//           <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: 360, mt: 1 }}>
//             <TextField
//               label="Имя (необязательно)"
//               value={form.name}
//               onChange={(e) => setForm({ ...form, name: e.target.value })}
//             />
//             <TextField
//               label="Здоровье"
//               type="text"
//               value={form.health}
//               onChange={(e) => handleChange("health", e.target.value)}
//             />
//             <TextField
//               label="Алкоголь"
//               type="text"
//               value={form.alcohol}
//               onChange={(e) => handleChange("alcohol", e.target.value)}
//             />
//             <TextField
//               label="Жизнерадостность"
//               type="text"
//               value={form.cheerfulness}
//               onChange={(e) => handleChange("cheerfulness", e.target.value)}
//             />
//             <TextField
//               label="Усталость"
//               type="text"
//               value={form.fatigue}
//               onChange={(e) => handleChange("fatigue", e.target.value)}
//             />
//             <TextField
//               label="Деньги"
//               type="text"
//               value={form.money}
//               onChange={(e) => handleChange("money", e.target.value)}
//             />
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setCreateOpen(false)}>Отмена</Button>
//           <Button variant="contained" onClick={handleCreate}>Создать</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }

import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import ValeraCard from "./ValeraCard";
import { fetchValeras, createValera, deleteValera } from "../api/valeraApi";

export default function ValeraList() {
  const [valeras, setValeras] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [q, setQ] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    health: 100,
    alcohol: 0,
    cheerfulness: 0,
    fatigue: 0,
    money: 0,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    try {
      const data = await fetchValeras();
      setValeras(data);
      setFiltered(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) setFiltered(valeras);
    else setFiltered(
      valeras.filter(v => (v.name || `Валера #${v.id}`).toLowerCase().includes(ql))
    );
  }, [q, valeras]);

  function openCreate() {
    setForm({ name: "", health: 100, alcohol: 0, cheerfulness: 0, fatigue: 0, money: 0 });
    setCreateOpen(true);
  }

  function handleChange(field, value) {
    const clean = value.replace(/^0+(?=\d)/, "");
    setForm({ ...form, [field]: clean === "" ? 0 : parseInt(clean) });
  }

  async function handleCreate() {
    try {
      const valeraData = {
        name: form.name || undefined,
        health: Number(form.health),
        alcohol: Number(form.alcohol),
        cheerfulness: Number(form.cheerfulness),
        fatigue: Number(form.fatigue),
        money: Number(form.money),
      };
      await createValera(valeraData);
      setCreateOpen(false);
      await load();
    } catch (e) {
      console.error(e);
      alert("Ошибка при создании: " + e.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(`Вы точно хотите удалить Валеру #${id}?`)) return;
    try {
      await deleteValera(id);
      await load();
    } catch (e) {
      console.error(e);
      alert("Ошибка при удалении: " + e.message);
    }
  }

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Поиск по имени"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={openCreate}>Создать Валеру</Button>
      </Box>

      {loading && <Typography>Загрузка...</Typography>}

      <Grid container spacing={2}>
        {filtered.map((v) => (
          <Grid item xs={12} sm={6} md={4} key={v.id}>
            <ValeraCard valera={v} onClick={() => navigate(`/valera/${v.id}`)} />
            <Button
              fullWidth
              variant="outlined"
              color="error"
              sx={{ mt: 1 }}
              onClick={() => handleDelete(v.id)}
            >
              Удалить
            </Button>
          </Grid>
        ))}
        {filtered.length === 0 && !loading && <Typography>Список пуст</Typography>}
      </Grid>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
        <DialogTitle>Создать Валеру</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: 360, mt: 1 }}>
            <TextField
              label="Имя (необязательно)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Здоровье"
              type="text"
              value={form.health}
              onChange={(e) => handleChange("health", e.target.value)}
            />
            <TextField
              label="Алкоголь"
              type="text"
              value={form.alcohol}
              onChange={(e) => handleChange("alcohol", e.target.value)}
            />
            <TextField
              label="Жизнерадостность"
              type="text"
              value={form.cheerfulness}
              onChange={(e) => handleChange("cheerfulness", e.target.value)}
            />
            <TextField
              label="Усталость"
              type="text"
              value={form.fatigue}
              onChange={(e) => handleChange("fatigue", e.target.value)}
            />
            <TextField
              label="Деньги"
              type="text"
              value={form.money}
              onChange={(e) => handleChange("money", e.target.value)}
            />
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
