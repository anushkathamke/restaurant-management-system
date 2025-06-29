import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faPhone,
  faFileInvoice,
  faCashRegister,
  faUtensils,
  faReceipt,
  faChartBar,
  faClock,
  faBell,
  faUser,
  faPowerOff,
} from "@fortawesome/free-solid-svg-icons";
import "./HomePage.css";

const HomePage = () => {
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();
  const handleKotClick = () => {
    navigate("/kot");
  };

useEffect(() => {
  const fetchTables = async () => {
    try {
      const res = await axios.get("http://localhost:5002/api/tables");
      setTables(res.data);
    } catch (err) {
      console.error("Error fetching tables:", err);
    }
  };
  fetchTables();
}, []);


  const handleTableClick = (tableId) => {
    // Navigate to ItemsPage and pass the tableId as a query param
    navigate(`/items?tableId=${tableId}`);
  };
  

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "status-available";
      case "occupied":
        return "status-occupied";
      case "kot":
        return "status-kot";
      case "reserved":
        return "status-reserved";
      default:
        return "";
    }
  };

  return (
    <div className="home-page">
      {/* Top Navigation Bar */}
      <div className="top-nav">
        <div className="logo">Table Reservation</div>
        <div className="nav-actions">
          <button className="action-btn">New Order</button>
          <input type="text" className="bill-no" placeholder="Bill No" disabled />
        </div>
        <div className="support-info">
          <FontAwesomeIcon icon={faPhone} className="icon" />
          <span>Call for Support: 9099912483</span>
        </div>
        <div className="toolbar-icons">
          <FontAwesomeIcon icon={faFileInvoice} className="icon billing-icon" />
          <FontAwesomeIcon icon={faCashRegister} className="icon pos-icon" />
          <FontAwesomeIcon icon={faUtensils} className="icon menu-icon" />
          <FontAwesomeIcon icon={faReceipt} className="icon kot-icon"
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
          onClick={handleKotClick}
          title="KOT" />
          <FontAwesomeIcon icon={faChartBar} className="icon reports-icon" />
          <FontAwesomeIcon icon={faClock} className="icon timer-icon" />
          <FontAwesomeIcon icon={faBell} className="icon notifications-icon" />
          <FontAwesomeIcon icon={faUser} className="icon user-icon" />
          <FontAwesomeIcon icon={faPowerOff} className="icon power-icon" />
        </div>
      </div>

      {/* Table View Title Section */}
      <div className="table-view-title">
        <h2>Table View</h2>
        <div className="title-actions">
          <button className="action-btn">Delivery</button>
          <button className="action-btn">Pick Up</button>
          <button className="action-btn">+ Add Table</button>
        </div>
      </div>

      {/* Filter/Legend Section */}
      <div className="filter-legend">
        <div className="filter-left flex gap-4">
          <button className="action-btn">+ Table Reservation</button>
          <button className="action-btn">+ Contactless</button>
          
        </div>
        <div className="filter-right">
          <div className="legends">
            <button className="action-btn">Move KOT / Items</button>
            <span className="legend blank">Blank Table</span>
            <span className="legend running">Running Table</span>
            <span className="legend printed">Printed Table</span>
            <span className="legend paid">Paid Table</span>
            <span className="legend kot">Running KOT Table</span>
          </div>
        </div>
      </div>

      {/* Table Grid Section */}
      <div className="table-grid">
        {tables.map((table) => (
          <div
            key={table.table_id}
            className={`table-card ${getStatusClass(table.table_status)}`}
            onClick={() => handleTableClick(table.table_id)}
            style={
              table.table_status?.toLowerCase() === "kot"
                ? { background: "#fffbe6", border: "1px solid #ffe58f", color: "#222" }
                : {}
            }
          >
            {table.table_status?.toLowerCase() === "kot" ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 8 }}>
                <div style={{ color: "#888", fontSize: 14, marginBottom: 2 }}>
                  {table.kot_time ? `${table.kot_time} Min` : "0 Min"}
                </div>
                <div style={{ fontWeight: "bold", fontSize: 20, marginBottom: 2 }}>
                  {table.table_id}
                </div>
                <div style={{ color: "#333", fontSize: 16, marginBottom: 6 }}>
                  ₹{table.kot_amount ? Number(table.kot_amount).toFixed(2) : "0.00"}
                </div>
                <button style={{ border: "none", background: "none", cursor: "pointer" }}>
                  <span role="img" aria-label="view" style={{ fontSize: 22 }}>👁️</span>
                </button>
              </div>
            ) : (
              <>
                <h3>{table.table_name}</h3>
                <p>Status: {table.table_status}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;