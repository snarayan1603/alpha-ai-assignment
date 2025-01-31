// src/App.jsx
import React from "react";
import Home from "./pages/Home";
import Header from "./components/layout/Header";

const App = () => {
  return (
    <div className="app-container">
      <div>
        <Header />
        <Home />
      </div>
    </div>
  );
};

export default App;
