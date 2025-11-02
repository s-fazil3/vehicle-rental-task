import { useNavigate } from "react-router-dom";
import "./Navbar.css";
export default function Navbar({ admin = false }) {
  const nav = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    nav("/");
  };
  return (
    <div className="navbar">
      <h3 onClick={() => nav(admin ? "/admin" : "/home")}> Vehicle Rental</h3>
      <div>
        {admin ? null : (
          <button onClick={() => nav("/bookings")}>My Bookings</button>
        )}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
