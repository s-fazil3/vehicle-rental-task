import React from "react";
import "./VehicleCard.css";

export default function VehicleCard({ vehicle, onBook }) {
  return (
    <div className="vehicle-card">
      <img src={vehicle.image || "https://via.placeholder.com/150"} alt={vehicle.name} />
      <h4>{vehicle.name}</h4>
      <p>Type: {vehicle.type}</p>
      <p>₹{vehicle.pricePerHour}/hour</p>
      <p>
        Status: {vehicle.availability ? (
          <span style={{ color: '#16a34a' }}>Available</span>
        ) : (
          <span style={{ color: '#ef4444' }}>Booked</span>
        )}
      </p>
      {!vehicle.availability && <span className="booked-badge">Booked</span>}
      <button
        onClick={() => onBook(vehicle)}
        disabled={vehicle.availability === false}
      >
        {vehicle.availability === false ? 'Booked' : 'Book'}
      </button>
    </div>
  );
}
