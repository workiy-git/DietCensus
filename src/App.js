import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/pages/login";
import Download from "./components/pages/download";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />}/>
        <Route path="/download" element={<Download />}/>
      </Routes>
    </Router>
  );
}

export default App;
