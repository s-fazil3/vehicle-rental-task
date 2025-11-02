import React, { useEffect, useState } from "react";
import { API } from "../src/api";
import Navbar from "../components/Navbar";
import "./Admindashboard.css";

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({ name: "", type: "", pricePerHour: "", image: "" });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [localPreview, setLocalPreview] = useState("");

  useEffect(() => { fetchVehicles(); }, []);

  const fetchVehicles = async () => {
    const res = await API.get("/vehicles");
    setVehicles(res.data);
  };

  const handleAddVehicle = async () => {
    console.log('[ADMIN] submitting vehicle', form);
    if (!form.name || !form.type || !form.pricePerHour) {
      alert('Please fill name, type and price');
      return;
    }
    await API.post("/vehicles/add", form);
    setForm({ name: "", type: "", pricePerHour: "", image: "" });
    fetchVehicles();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 7 * 1024 * 1024) {
      setUploadError('File too large. Please select an image under 7MB.');
      return;
    }
    setLocalPreview(URL.createObjectURL(file));
    const toBase64 = (f) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });
    try {
      setUploading(true);
      setUploadError("");
      const dataUrl = await toBase64(file);
      const res = await API.post('/vehicles/upload', { image: dataUrl });
      if (res.data?.url) {
        setForm((prev) => ({ ...prev, image: res.data.url }));
        console.log('[ADMIN] upload success url', res.data.url);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setUploadError(msg);
      alert(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    await API.delete(`/vehicles/${id}`);
    fetchVehicles();
  };
  return (
    <>
      <Navbar admin />
      <div className="admin-container">
        <h2>Admin Dashboard</h2>
        <div className="add-form">
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          <input placeholder="Price/hour" value={form.pricePerHour} onChange={(e) => setForm({ ...form, pricePerHour: e.target.value })} />
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {uploading && <span>Uploading...</span>}
          {uploadError && <small style={{ color: 'crimson' }}>{uploadError}</small>}
          <button onClick={handleAddVehicle} disabled={uploading || !form.name || !form.type || !form.pricePerHour}>Add Vehicle</button>
        </div>
        <h3>All Vehicles</h3>
        <div className="vehicle-grid">
          {vehicles.map((v) => (
            <div key={v._id} className="admin-card">
              <img src={v.image || "https://via.placeholder.com/150"} alt={v.name} />
              <h4>{v.name}</h4>
              <p>{v.type}</p>
              <p>₹{v.pricePerHour}/hour</p>
              <button onClick={() => handleDelete(v._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
