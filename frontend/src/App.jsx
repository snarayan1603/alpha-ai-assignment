// src/App.jsx
import React from "react";
import Home from "./pages/Home";
import Header from "./components/layout/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FileUpload from "./pages/FileUpload";
import DashboardLayout from "./pages/DashboardLayout";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<FileUpload />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
      </Routes>
    </Router>
  );
};

export default App;
