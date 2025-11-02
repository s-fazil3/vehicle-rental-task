import React, { useState } from "react";
import { API } from "../src/api";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const nav = useNavigate();

  const handleSignup = async () => {
    const res = await API.post("/auth/signup", form);
    alert(res.data.message);
    nav("/");
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <label style={{ display: 'block', textAlign: 'left', marginTop: 8, marginBottom: 4 }}>Role</label>
      <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}
