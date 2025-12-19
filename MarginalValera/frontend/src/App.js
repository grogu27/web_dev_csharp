import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Container from "@mui/material/Container";
import Header from "./components/Header";
import ValeraList from "./components/ValeraList";
import ValeraStats from "./components/ValeraStats";
//import ValeraTest from "./components/Test";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import Register from "./components/Register";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Container sx={{ mt: 3 }}>
        <Routes>
          <Route path="/" element={<ValeraList />} />
          <Route path="/valera/:id" element={<ValeraStats />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}
