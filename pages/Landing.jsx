import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const nav = useNavigate();
  return (
    <div style={{
      minHeight: "100vh",
      background: "#ffffff",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      padding: "40px",
      paddingTop: "60px"
    }}>
      <div style={{ maxWidth: 700, textAlign: "center", margin: "0 auto", width: "100%" }}>
        <h1 style={{ marginBottom: 12, color: "#1e90ff" }}>Vehicle Rental Platform</h1>
        <p style={{ color: "#333", lineHeight: 1.6, marginBottom: 24 }}>
          Welcome to our simple vehicle rental platform. Browse vehicles, make bookings,
          and manage your rentals with ease. Get started by logging in or creating a new account.
        </p>
        <div>
          <button onClick={() => nav("/login")} style={{
            background: "#1e90ff",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: 6,
            cursor: "pointer",
            marginRight: 10
          }}>Login</button>
          <button onClick={() => nav("/signup")} style={{
            background: "#ffffff",
            color: "#1e90ff",
            border: "1px solid #1e90ff",
            padding: "10px 16px",
            borderRadius: 6,
            cursor: "pointer"
          }}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}
