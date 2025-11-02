import React, { useEffect, useState } from "react";
import { API } from "../src/api";
import Navbar from "../components/Navbar";
import "./Bookings.css";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    API.get(`/bookings/${userId}`).then((res) => setBookings(res.data));
  }, []);

  const refresh = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    const res = await API.get(`/bookings/${userId}`);
    setBookings(res.data);
  };

  const handleReturn = async (bookingId) => {
    try {
      await API.post('/bookings/return', { bookingId });
      alert('Return processed');
      refresh();
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    }
  };

  return (
    <div className="bookings">
      <Navbar />
      <h2>My Bookings</h2>
      {bookings.map((b, i) => (
        <div key={i} className="booking-card">
          <p><strong>Vehicle ID:</strong> {b.vehicleId}</p>
          <p><strong>Hours:</strong> {b.hours}</p>
          <p><strong>Total Price:</strong> ₹{b.totalPrice}</p>
          <p><strong>Status:</strong> {b.status}{b.paymentStatus ? ` / ${b.paymentStatus}` : ''}</p>
          {b.status === 'booked' && (
            <button onClick={() => handleReturn(b._id)}>Return</button>
          )}
        </div>
      ))}
    </div>
  );
}
