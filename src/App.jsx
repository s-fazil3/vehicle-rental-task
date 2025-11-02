import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import AdminDashboard from "../pages/Admindashboard";
import Bookings from "../pages/Bookings";
import Navbar from "../components/Navbar";  
import Landing from "../pages/Landing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="*" element={<h2 style={{ textAlign: "center", marginTop: "100px" }}>404 - Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
