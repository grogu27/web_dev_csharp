import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { fetchValera, doAction } from "../api/valeraApi";

function StatBar({ label, value, max = 100 }) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <Box>
      <Typography variant="subtitle2">{label}: {value}</Typography>
      <LinearProgress variant="determinate" value={percent} sx={{ height: 10, borderRadius: 2 }} />
    </Box>
  );
}

export default function ValeraStats() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [valera, setValera] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchValera(id);
      setValera(data);
    } catch (e) {
      console.error(e);
      alert("Ошибка при загрузке Валеры: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  async function handleAction(action) {
    setActionLoading(true);
    try {
      await doAction(id, action);
      await load();
    } catch (e) {
      console.error(e);
      alert("Ошибка при выполнении действия: " + e.message);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading || !valera) return <Typography>Загрузка...</Typography>;

  const workDisabled = (valera.fatigue ?? 0) >= 10 || (valera.alcohol ?? 0) >= 50;

  return (
    <Paper sx={{ p: 3 }}>
      {/* Кнопка Назад */}
      <Button variant="outlined" sx={{ mb: 2 }} onClick={() => navigate("/")}>
        Назад
      </Button>

      <Typography variant="h5" gutterBottom>{valera.name || `Валера #${valera.id}`}</Typography>

      <Stack spacing={2} sx={{ mb: 3 }}>
        <StatBar label="Здоровье" value={valera.health ?? 0} />
        <StatBar label="Алкоголь" value={valera.alcohol ?? 0} />
        <StatBar label="Жизнерадостность" value={valera.cheerfulness ?? 0} />
        <StatBar label="Усталость" value={valera.fatigue ?? 0} />
        <StatBar label="Деньги" value={valera.money ?? 0} max={Math.max(100, valera.money ?? 100)} />
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Button fullWidth variant="contained" disabled={workDisabled || actionLoading} onClick={() => handleAction("work")}>
            Пойти на работу
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button fullWidth variant="contained" onClick={() => handleAction("nature")} disabled={actionLoading}>
            Созерцать природу
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button fullWidth variant="contained" onClick={() => handleAction("wine")} disabled={actionLoading}>
            Пить вино и смотреть сериал
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button fullWidth variant="contained" onClick={() => handleAction("bar")} disabled={actionLoading}>
            Сходить в бар
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button fullWidth variant="contained" onClick={() => handleAction("marginals")} disabled={actionLoading}>
            Выпить с маргиналами
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button fullWidth variant="contained" onClick={() => handleAction("sing")} disabled={actionLoading}>
            Петь в метро
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button fullWidth variant="contained" onClick={() => handleAction("sleep")} disabled={actionLoading}>
            Спать
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
