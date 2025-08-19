import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import FormPage from "./pages/FormPage";
import Login from "./pages/Login"

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/form/:id" element={<FormPage />} />
      </Routes>
    </Router>
  );
}

export default App;
