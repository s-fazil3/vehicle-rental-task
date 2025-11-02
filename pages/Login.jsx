import React, { useState } from "react";
import { API, decodeJwt } from "../src/api";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleLogin = async () => {
    const res = await API.post("/auth/login", { email, password });
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      const payload = decodeJwt(res.data.token);
      if (payload && payload.id) {
        localStorage.setItem("userId", payload.id);
      }
      if (res.data.role) {
        localStorage.setItem("role", res.data.role);
      }
      if (res.data.role === "admin") nav("/admin");
      else nav("/home");
    } else alert(res.data.message);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p onClick={() => nav("/signup")}>Don’t have an account? Signup</p>
    </div>
  );
}
