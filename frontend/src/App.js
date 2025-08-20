import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import FormPage from "./pages/FormPage";
import Login from "./pages/Login"
import ThankYouPage from "./pages/ThankYouPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/form/:id" element={<FormPage />} />
        <Route path="/form/:id/submitted" element={<ThankYouPage />} />
      </Routes>
    </Router>
  );
}

export default App;
