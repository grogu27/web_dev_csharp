import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function ValeraCard({ valera, onClick }) {
  const name = valera.name || `Валера #${valera.id}`;
  return (
    <Card variant="outlined" sx={{ cursor: "pointer" }} onClick={onClick}>
      <CardContent>
        <Typography variant="subtitle1">{name}</Typography>
        <Typography variant="body2" color="text.secondary">id: {valera.id}</Typography>
      </CardContent>
    </Card>
  );
}
