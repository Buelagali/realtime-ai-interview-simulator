import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import UploadResume from "./pages/UploadResume";
import Interview from "./pages/Interview";
import Dashboard from "./pages/Dashboard";
import Result from "./pages/Result";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/upload" element={<UploadResume />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
