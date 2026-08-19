import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CVManager from "./pages/CVManager";
import JobManager from "./pages/JobManager";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cv" element={<CVManager />} />
        <Route path="/jobs" element={<JobManager />} />
      </Routes>
    </Router>
  );
}

export default App;