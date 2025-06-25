import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch("http://localhost:5002/api/tables"); // Fetch table data from backend
        if (response.ok) {
          const data = await response.json();
          setTables(data || []); // Update state with fetched tables
        } else {
          console.error("Failed to fetch tables");
        }
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };

    fetchTables();
  }, []);

  const handleTableClick = (tableId) => {
    // Navigate to ItemsPage and pass the tableId as a query param
    navigate(`/items?tableId=${tableId}`);
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "available":
        return "status-available";
      case "occupied":
        return "status-occupied";
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
          <FontAwesomeIcon icon={faReceipt} className="icon kot-icon" />
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
          <button className="action-btn">+ Table Reservation</button>
          <button className="action-btn">+ Contactless</button>
          <button className="action-btn">Delivery</button>
          <button className="action-btn">Pick Up</button>
          <button className="action-btn">+ Add Table</button>
        </div>
      </div>

      {/* Filter/Legend Section */}
      <div className="filter-legend">
        <div className="filter-left">
          <button className="action-btn">Move KOT / Items</button>
        </div>
        <div className="filter-right">
          <div className="legends">
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
          >
            <h3>{table.table_name}</h3>
            <p>Status: {table.table_status}</p>
            {table.reservation_status && (
              <div className="reservation-info">
                <p>Customer: {table.customer_name}</p>
                <p>Time: {new Date(table.date_time).toLocaleTimeString()}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;