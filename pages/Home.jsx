import React, { useEffect, useState } from "react";
import { API } from "../src/api";
import Navbar from "../components/Navbar";
import VehicleCard from "../components/VehicleCard";
import PaymentModal from "../components/PaymentModal";
import "./Home.css";

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [payOpen, setPayOpen] = useState(false);
  const [pendingBody, setPendingBody] = useState(null);
  const [pendingVehicle, setPendingVehicle] = useState(null);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    const res = await API.get(`/vehicles?t=${Date.now()}`);
    console.log('[HOME] fetched vehicles', res.data.map(v => ({ id: v._id, availability: v.availability })));
    setVehicles(res.data);
  };

  const handleBook = async (vehicle) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Not logged in");
        return;
      }
      let hours = 0;
      let body = { userId, vehicleId: vehicle._id };
      if (startAt && endAt) {
        const start = new Date(startAt);
        const end = new Date(endAt);
        if (!(start < end)) {
          alert('Invalid date range');
          return;
        }
        const diffHrs = (end - start) / (1000 * 60 * 60);
        hours = Math.ceil(diffHrs);
        const totalPrice = hours * Number(vehicle.pricePerHour || 0);
        body = { ...body, startAt: start.toISOString(), endAt: end.toISOString(), hours, totalPrice };
      } else {
        const hoursInput = prompt("Enter number of hours to rent:", "1");
        if (hoursInput === null) return; 
        hours = parseInt(hoursInput, 10);
        if (isNaN(hours) || hours <= 0) {
          alert("Please enter a valid number of hours (greater than 0)");
          return;
        }
        const totalPrice = hours * Number(vehicle.pricePerHour || 0);
        body = { ...body, hours, totalPrice };
      }
      setPendingBody(body);
      setPendingVehicle(vehicle);
      setAmount(body.totalPrice || 0);
      setPayOpen(true);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const finalizeBooking = async () => {
    if (!pendingBody || !pendingVehicle) return;
    const res = await API.post("/bookings/book", pendingBody);
    console.log('[HOME] booking response', res.data);
    if (res.data?.bookingId) {
      try {
        await API.post('/payments/confirm', { bookingId: res.data.bookingId, status: 'succeeded' });
      } catch (e) {
        console.warn('Payment confirm failed', e?.message);
      }
    }
    alert(res.data.message || "Booked");
    const updated = res.data?.vehicle;
    if (updated && updated._id) {
      setVehicles((prev) => prev.map((v) => v._id === updated._id ? { ...v, availability: !!updated.availability } : v));
    } else {
      setVehicles((prev) => prev.map((v) => v._id === pendingVehicle._id ? { ...v, availability: false } : v));
    }
    setPayOpen(false);
    setPendingBody(null);
    setPendingVehicle(null);
  };

  return (
    <div className="home">
      <Navbar />
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center', margin: '12px 0' }}>
        <div>
          <label style={{ display: 'block', fontSize: 12 }}>Start</label>
          <input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12 }}>End</label>
          <input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
        </div>
        <button onClick={() => { setStartAt(""); setEndAt(""); }}>Clear</button>
      </div>
      <h2>Available Vehicles</h2>
      <div className="vehicle-list">
        {vehicles.map((v) => (
          <VehicleCard key={v._id} vehicle={v} onBook={handleBook} />
        ))}
      </div>

      <PaymentModal
        open={payOpen}
        amount={amount}
        onClose={() => { setPayOpen(false); setPendingBody(null); setPendingVehicle(null); }}
        onSuccess={() => finalizeBooking()}
      />
    </div>
  );
}
