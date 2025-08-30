import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function DashboardLayout({ children, active, onTabChange }) {
  const [me, setMe] = useState(null);

  useEffect(() => {
    api.get("/users/me").then((r) => setMe(r.data));
  }, []);

  // tabs to show in sidebar (user)
  const tabs = [
    { key: "jobs", label: "Jobs" },
    { key: "applied", label: "Applied" },
    { key: "profile", label: "Profile" },
  ];

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        {/* Sidebar */}
        <div
          className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 d-flex flex-column"
          style={{
            minHeight: "100vh",
            backgroundColor: "#2c3e50",
            borderRight: "1px solid #dce7f5",
            color: "white",
            paddingTop: "20px",
          }}
        >
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 text-white min-vh-100 w-100">
            {/* Profile */}
            {me && (
              <div className="text-center mb-4 w-100">
                <img
                  src={
                    me.avatar
                      ? `http://localhost:5000/${me.avatar}`
                      : "https://via.placeholder.com/80"
                  }
                  alt="profile"
                  className="rounded-circle mb-2"
                  style={{ width: "70px", height: "70px", objectFit: "cover" }}
                />
                <h6 className="mb-0 text-white">{me.name}</h6>
                <small className="text-light">{me.email}</small>
              </div>
            )}

            {/* Tabs */}
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start w-100">
              {tabs.map((t) => (
                <li className="nav-item w-100" key={t.key}>
                  <button
                    className={`nav-link text-start w-100 mb-2 sidebar-item-btn ${
                      active === t.key ? "active-tab" : "tab-btn"
                    }`}
                    onClick={() => onTabChange(t.key)}
                  >
                    {t.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Content */}
        <div className="col py-3">{children}</div>
      </div>

      {/* Styles */}
      <style>
        {`
          .tab-btn {
            background: transparent;
            border: 1px solid rgba(255,255,255,0.2);
            padding: 10px 15px;
            border-radius: 8px;
            color: white;
            transition: all 0.3s ease;
          }
          .tab-btn:hover {
            background: #34495e;
            color: #f1f1f1;
          }
          .active-tab {
            background: linear-gradient(135deg, #007bff, #3399ff);
            color: white !important;
            border: 1px solid #3399ff;
            padding: 10px 15px;
            border-radius: 8px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          .sidebar-item-btn {
            display: block;
            width: 100%;
            text-align: left;
          }
        `}
      </style>
    </div>
  );
}