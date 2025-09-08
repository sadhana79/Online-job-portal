import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function DashboardLayout({ children, active, onTabChange }) {
  const [me, setMe] = useState(null);

  useEffect(() => {
    api.get("/users/me").then((r) => setMe(r.data));
  }, []);

  
  const tabs = [
    { key: "add", label: "Add Job" },
    { key: "manage", label: "Manage Jobs" },
    { key: "applications", label: "View Applications" },
    { key: "profile", label: "Profile" },
  ];

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        
        <div
          className="col-auto col-md-3 col-xl-2 px-sm-2 px-0"
          style={{
            minHeight: "100vh",
            background: "linear-gradient(180deg, #e8f2fc, #f9fcff)",
            borderRight: "1px solid #dce7f5",
          }}
        >
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-3 text-dark min-vh-100">
            
        
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
                <h6 className="mb-0">{me.name}</h6>
                <small className="text-muted">{me.email}</small>
              </div>
            )}

        
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start w-100">
              {tabs.map((t) => (
                <li className="nav-item w-100" key={t.key}>
                  <button
                    className={`nav-link text-start w-100 mb-2 ${
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

      
        <div className="col py-3">{children}</div>
      </div>

    
      <style>
        {`
          .tab-btn {
            background: transparent;
            border: none;
            padding: 10px 15px;
            border-radius: 8px;
            color: #333;
            transition: all 0.3s ease;
          }
          .tab-btn:hover {
            background: #e1efff;
            color: #007bff;
          }
          .active-tab {
            background: linear-gradient(135deg, #007bff, #3399ff);
            color: white !important;
            border: none;
            padding: 10px 15px;
            border-radius: 8px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
        `}
      </style>
    </div>
  );
}
