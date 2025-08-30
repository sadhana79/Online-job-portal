import React, { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import DashboardLayout from "../components/AdminDashboardLayout";
import ProfileForm from '../components/ProfileForm';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faFileAlt, faUsers, faUserTie } from "@fortawesome/free-solid-svg-icons";

export default function AdminDashboard() {
  const url = new URL(window.location.href);
  const initialTab = url.searchParams.get("tab") || "stats";
  const [tab, setTab] = useState(initialTab);
  const [hrs, setHrs] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ jobs: 0, applications: 0, users: 0, hrs: 0 });
  const [qHr, setQHr] = useState("");
  const [qUser, setQUser] = useState("");
  const [me, setMe] = useState(null);

  const [hrPage, setHrPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    load();
    api.get("/admin/stats").then((r) => setStats(r.data));
    api.get("/users/me").then((r) => setMe(r.data));
  }, []);

  const load = async () => {
    const [h, u] = await Promise.all([
      api.get("/admin/hrs", { params: { q: qHr } }),
      api.get("/admin/users", { params: { q: qUser } }),
    ]);
    setHrs(h.data);
    setUsers(u.data);
  };

  const addHR = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = Object.fromEntries(fd.entries());
    await api.post('/admin/hr', payload);
    toast.success('HR added');
    e.target.reset();
    load();
  };

  const updateHR = async (hr) => {
    await api.put("/admin/hr/" + hr.id, hr);
    toast.success("HR updated");
    load();
  };

  const deleteHR = async (id) => {
    await api.delete("/admin/hr/" + id);
    toast.success("HR deleted");
    load();
  };

  const updateUser = async (u) => {
    const payload = {
      name: u.name,
      email: u.email,
      password: u.password,
      education: u.education,
      college: u.college,
      skills: u.skills,
      experience: u.experience,
    };
    await api.put(`/admin/user/${u.id}`, payload);
    toast.success('User updated');
    load();
  };

  const deleteUser = async (id) => {
    await api.delete(`/admin/user/${id}`);
    toast.success('User deleted');
    load();
  };

  const addUser = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = Object.fromEntries(fd.entries());
    await api.post('/admin/user', payload); // Add user to DB
    toast.success('User added');
    e.target.reset();
    load();
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    await api.post("/users/me", form, { headers: { "Content-Type": "multipart/form-data" } });
    toast.success("Profile updated");
    api.get("/users/me").then((r) => setMe(r.data));
  };

  const paginate = (items, page) => {
    const start = (page - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  };

  const hrPages = Math.ceil(hrs.length / itemsPerPage);
  const userPages = Math.ceil(users.length / itemsPerPage);

  return (
    <DashboardLayout active={tab} onTabChange={setTab}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="m-0">Admin Dashboard</h3>
        <div className="btn-group">
          <button className={`btn btn-sm ${tab === "stats" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setTab("stats")}>
            Stats
          </button>
          <button className={`btn btn-sm ${tab === "hrs" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setTab("hrs")}>
            HRs
          </button>
          <button className={`btn btn-sm ${tab === "users" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setTab("users")}>
            Users
          </button>
          <button className={`btn btn-sm ${tab === "profile" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setTab("profile")}>
            Profile
          </button>
        </div>
      </div>

      <br></br>
      {tab === "profile" && (<ProfileForm />)}

      {tab === "stats" && (
        <div className="row g-4">
          {[ 
            { icon: faBriefcase, label: "Jobs", value: stats.jobs, color: "linear-gradient(135deg,#6a11cb,#2575fc)" },
            { icon: faFileAlt, label: "Applications", value: stats.applications, color: "linear-gradient(135deg,#ff416c,#ff4b2b)" },
            { icon: faUsers, label: "Users", value: stats.users, color: "linear-gradient(135deg,#56ab2f,#a8e063)" },
            { icon: faUserTie, label: "HRs", value: stats.hrs, color: "linear-gradient(135deg,#00c6ff,#0072ff)" }
          ].map((c, i) => (
            <div className="col-md-3" key={i}>
              <div className="card shadow-lg text-white h-100 card-hover" style={{
                background: c.color,
                minHeight: "220px",
                transition: "all 0.3s ease"
              }}>
                <div className="card-body d-flex flex-column align-items-center justify-content-center text-center">
                  <FontAwesomeIcon icon={c.icon} size="3x" className="mb-3" />
                  <div className="h5">{c.label}</div>
                  <div className="display-5 fw-bold">{c.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <br></br>
      {tab === "hrs" && (
        <div>
          <form className="row g-3 mb-4 p-3 border rounded shadow-sm" style={{ background: "linear-gradient(135deg,#c4daf1,#b0cdee)" }} onSubmit={addHR}>
            <h4>Add HR</h4>
            <div className="col-md-3">
              <label className="form-label fw-bold">Name</label>
              <input className="form-control" name="name" placeholder="HR Name" required />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">Email</label>
              <input type="email" className="form-control" name="email" placeholder="HR Email" required />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">Contact</label>
              <input className="form-control" name="contact" placeholder="HR Contact" />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">Education</label>
              <input className="form-control" name="education" placeholder="HR Education" />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">Password</label>
              <input type="password" className="form-control" name="password" placeholder="Password" required />
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button className="btn btn-primary w-100">Add HR</button>
            </div>
          </form>
          <h4>View HR</h4>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Education</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginate(hrs, hrPage).map((h) => (
                  <tr key={h.id}>
                    <td>{h.name}</td>
                    <td>{h.email}</td>
                   
                    <td>{h.contact || '-'}</td>
                    <td>{h.education || '-'}</td>
                    <td className="d-flex gap-2">
                      <a className="btn btn-sm btn-outline-primary" href={`/admin/hr/${h.id}/edit`}>Update</a>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => deleteHR(h.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav className="mt-3">
            <ul className="pagination">
              {Array.from({ length: hrPages }, (_, i) => (
                <li key={i} className={`page-item ${hrPage === i + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setHrPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      {tab === "users" && (
        <div>
          <form className="row g-3 mb-4 p-3 border rounded shadow-sm" style={{ background: "linear-gradient(135deg,#c4daf1,#b0cdee)" }} onSubmit={addUser}>
            <h4>Add User</h4>
            <div className="col-md-3">
              <label className="form-label fw-bold">Name</label>
              <input className="form-control" name="name" placeholder="User Name" required />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">Email</label>
              <input type="email" className="form-control" name="email" placeholder="User Email" required />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">Password</label>
              <input type="password" className="form-control" name="password" placeholder="Password" required />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">Education</label>
              <input className="form-control" name="education" placeholder="User Education" />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">College</label>
              <input className="form-control" name="college" placeholder="User College" />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">Skills</label>
              <input className="form-control" name="skills" placeholder="User Skills" />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">Experience</label>
              <input className="form-control" name="experience" placeholder="User Experience" />
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button className="btn btn-primary w-100">Add User</button>
            </div>
          </form>

          <h4>View Users</h4>
          <div className="input-group mb-2">
            <input className="form-control" placeholder="Search user by name..." value={qUser} onChange={(e) => setQUser(e.target.value)} />
            <button className="btn btn-outline-secondary" onClick={load}>
              Search
            </button>
          </div>

          <ul className="list-group">
            {paginate(users, userPage).map((u) => (
              <li className="list-group-item" key={u.id}>
                <div className="row g-2 align-items-center">
                  <div className="col-md-3">
                    <input className="form-control" value={u.name || ""} onChange={(e) => setUsers(users.map((x) => (x.id === u.id ? { ...x, name: e.target.value } : x)))} />
                  </div>
                  <div className="col-md-3">
                    <input className="form-control" value={u.email || ""} onChange={(e) => setUsers(users.map((x) => (x.id === u.id ? { ...x, email: e.target.value } : x)))} />
                  </div>
                  <div className="col-md-3">
                    <input className="form-control" value={u.education || ""} onChange={(e) => setUsers(users.map((x) => (x.id === u.id ? { ...x, education: e.target.value } : x)))} />
                  </div>
                  <div className="col-md-3">
                    <input className="form-control" value={u.college || ""} onChange={(e) => setUsers(users.map((x) => (x.id === u.id ? { ...x, college: e.target.value } : x)))} />
                  </div>
                  <div className="col-md-3">
                    <input className="form-control" value={u.skills || ""} onChange={(e) => setUsers(users.map((x) => (x.id === u.id ? { ...x, skills: e.target.value } : x)))} />
                  </div>
                  <div className="col-md-3">
                    <input className="form-control" value={u.experience || ""} onChange={(e) => setUsers(users.map((x) => (x.id === u.id ? { ...x, experience: e.target.value } : x)))} />
                  </div>
                  <div className="col-md-3 d-flex gap-2">
                    <button className="btn btn-sm btn-primary" onClick={() => updateUser(u)}>
                      Update
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteUser(u.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <nav className="mt-3">
            <ul className="pagination">
              {Array.from({ length: userPages }, (_, i) => (
                <li key={i} className={`page-item ${userPage === i + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setUserPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

    </DashboardLayout>
  );
}
