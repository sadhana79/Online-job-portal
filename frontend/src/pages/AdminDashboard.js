import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import DashboardLayout from "../components/AdminDashboardLayout";
import ProfileForm from '../components/ProfileForm';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AdminDashboard() {
  const url = new URL(window.location.href);
  const initialTab = url.searchParams.get("tab") || "stats";
  const [tab, setTab] = useState(initialTab);
  const [hrs, setHrs] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ jobs: 0, applications: 0, users: 0, hrs: 0 });
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [qHr, setQHr] = useState("");
  const [qUser, setQUser] = useState("");
  const [qJob, setQJob] = useState("");
  const [qApp, setQApp] = useState("");

  const [me, setMe] = useState(null);

  const [hrPage, setHrPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [jobPage, setJobPage] = useState(1);
  const [appPage, setAppPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    load();
    api.get("/admin/stats").then((r) => setStats(r.data)).catch(() => {});
    api.get("/users/me").then((r) => setMe(r.data)).catch(() => {});

    api.get("/jobs").then((r) => setJobs(r.data)).catch(() => {});
    api.get("/admin/applications").then((r) => setApplications(r.data)).catch(() => {});
  }, []);

  const load = async () => {
    try {
      const [h, u] = await Promise.all([
        api.get("/admin/hrs"),
        api.get("/admin/users"),
      ]);
      setHrs(h.data);
      setUsers(u.data);
    } catch (e) {
      console.error("Failed to load admin data", e);
    }
  };

  const addHR = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData(e.target);
      const payload = Object.fromEntries(fd.entries());
      await api.post('/admin/hr', payload);
      toast.success('HR added');
      e.target.reset();
      load();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add HR');
    }
  };

  const deleteHR = async (id) => {
    try {
      await api.delete("/admin/hr/" + id);
      toast.success("HR deleted");
      load();
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete HR');
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/admin/user/${id}`);
      toast.success('User deleted');
      load();
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete user');
    }
  };

  const addUser = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData(e.target);
      const payload = Object.fromEntries(fd.entries());
      await api.post('/admin/user', payload);
      toast.success('User added');
      e.target.reset();
      load();
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error('Failed to add user');
    }
  };

  const paginate = (items, page) => {
    const start = (page - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  };

  const filteredHrs = hrs.filter(h =>
    h.name?.toLowerCase().includes(qHr.toLowerCase()) ||
    h.email?.toLowerCase().includes(qHr.toLowerCase())
  );
  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(qUser.toLowerCase()) ||
    u.email?.toLowerCase().includes(qUser.toLowerCase())
  );
  const filteredJobs = jobs.filter(j =>
    j.title?.toLowerCase().includes(qJob.toLowerCase()) ||
    j.category?.toLowerCase().includes(qJob.toLowerCase()) ||
    j.location?.toLowerCase().includes(qJob.toLowerCase())
  );
  const filteredApps = applications.filter(a =>
    a.applicant_name?.toLowerCase().includes(qApp.toLowerCase()) ||
    a.user_email?.toLowerCase().includes(qApp.toLowerCase()) ||
    a.job_title?.toLowerCase().includes(qApp.toLowerCase()) ||
    a.status?.toLowerCase().includes(qApp.toLowerCase())
  );

  const hrPages = Math.ceil(filteredHrs.length / itemsPerPage);
  const userPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const jobPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const appPages = Math.ceil(filteredApps.length / itemsPerPage);

  const paginatedJobs = paginate(filteredJobs, jobPage);
  const paginatedApps = paginate(filteredApps, appPage);

  return (
    <><style>{`
        /* =============== FONT & BACKGROUND =============== */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #f2f6fc; color: #333; }

        /* =============== CARD STATS =============== */
        .card-stats { height: 180px; border-radius: 16px; padding: 20px; font-size: 1rem; position: relative; transition: all 0.3s ease-in-out; }
        .card-stats:hover { transform: translateY(-6px); box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2); }
        .card-stats .icon { position: absolute; top: 15px; right: 20px; font-size: 3.5rem; opacity: 0.3; z-index: 1; }

        .bg-gradient-blue { background: linear-gradient(135deg, #007bff, #00c6ff); color: white; }
        .bg-gradient-green { background: linear-gradient(135deg, #34af38ff, #81c784); color: white; }
        .bg-gradient-orange { background: linear-gradient(135deg, #ff9800, #ffb74d); color: white; }
        .bg-gradient-purple { background: linear-gradient(135deg, #9c27b0, #961fabff); color: white; }

        /* =============== TABLES =============== */
        .table thead { background: linear-gradient(to right, #487ab0ff, #5fa6b9ff); color: white; font-weight: 600; }
        .table-striped tbody tr:nth-of-type(odd) { background-color: rgba(58, 109, 163, 0.05); }
        .table-hover tbody tr:hover { background-color: rgba(0, 0, 0, 0.05); transition: background-color 0.3s ease; }

        /* =============== BUTTONS =============== */
        .btn-primary { background: linear-gradient(45deg, #007bff, #00c6ff); border: none; transition: all 0.3s ease; color: white; }
        .btn-primary:hover { background: linear-gradient(45deg, #0056b3, #00a0e9); transform: scale(1.03); box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); }
        .btn-outline-primary:hover { background-color: #007bff; color: white; border-color: #007bff; }

        /* =============== FORMS =============== */
        form { background: linear-gradient(120deg, #bdcdd8ff, #8bb4eaff); border-radius: 12px; padding: 20px; }
        input.form-control:focus { border-color: #007bff; box-shadow: 0 0 0 0.1rem rgba(0, 123, 255, 0.25); }

        /* =============== PAGINATION =============== */
        button.btn-outline-secondary:hover { background-color: #007bff; color: white; border-color: #007bff; }
        .btn-group .btn-outline-primary:hover { background: #007bff; color: #fff; }

        /* =============== CUSTOM SCROLLBAR =============== */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: #007bff; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #0056b3; }
      `}</style>


      
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

      {tab === "profile" && (<ProfileForm />)}

      {tab === "hrs" && (
        <div>
          <form className="row g-3 mb-4 p-3 border rounded shadow-sm" onSubmit={addHR}>
            <h4>Add HR</h4>
            <div className="col-md-3"><input className="form-control" name="name" placeholder="HR Name" required /></div>
            <div className="col-md-3"><input type="email" className="form-control" name="email" placeholder="HR Email" required /></div>
            <div className="col-md-3"><input className="form-control" name="contact" placeholder="HR Contact" /></div>
            <div className="col-md-3 d-flex align-items-end"><button className="btn btn-primary w-100">Add HR</button></div>
          </form>
          <h4>View HR</h4>
          <input className="form-control mb-2" placeholder="Search HR..." value={qHr} onChange={e => setQHr(e.target.value)} />
          <div className="table-responsive">
            <table className="table table-striped">
              <thead><tr><th>Name</th><th>Email</th><th>Contact</th><th>Actions</th></tr></thead>
              <tbody>
                {paginate(filteredHrs, hrPage).map((h) => (
                  <tr key={h.id}>
                    <td>{h.name}</td><td>{h.email}</td><td>{h.contact || '-'}</td>
                    <td>
                      <Link className="btn btn-sm btn-outline-primary" to={`/admin/hr/${h.id}/edit`}>Update</Link>
                      <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => deleteHR(h.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex justify-content-end align-items-center p-2">
              <button className="btn btn-sm btn-outline-secondary me-2" disabled={hrPage === 1} onClick={() => setHrPage(p => p - 1)}>Previous</button>
              <span>Page {hrPage} of {hrPages}</span>
              <button className="btn btn-sm btn-outline-secondary ms-2" disabled={hrPage === hrPages} onClick={() => setHrPage(p => p + 1)}>Next</button>
            </div>
          </div>
        </div>
      )}

      {tab === "users" && (
        <div>
          <form className="row g-3 mb-4 p-3 border rounded shadow-sm" onSubmit={addUser}>
            <h4>Add User</h4>
            <div className="col-md-3"><input className="form-control" name="name" placeholder="User Name" required /></div>
            <div className="col-md-3"><input type="email" className="form-control" name="email" placeholder="User Email" required /></div>
            <div className="col-md-3"><input className="form-control" name="contact" placeholder="User Contact" required /></div>
            <div className="col-md-3"><input type="password" className="form-control" name="password" placeholder="Password" required /></div>
            <div className="col-md-3"><input className="form-control" name="education" placeholder="User Education" /></div>
            <div className="col-md-3"><input className="form-control" name="college" placeholder="User College" /></div>
            <div className="col-md-3"><input className="form-control" name="skills" placeholder="User Skills" /></div>
            <div className="col-md-3"><input className="form-control" name="experience" placeholder="User Experience" /></div>
            <div className="col-md-3 d-flex align-items-end"><button className="btn btn-primary w-100">Add User</button></div>
          </form>

          <h4>View Users</h4>
          <input className="form-control mb-2" placeholder="Search User..." value={qUser} onChange={e => setQUser(e.target.value)} />
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th><th>Email</th><th>Contact</th><th>Education</th><th>College</th><th>Skills</th><th>Experience</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginate(filteredUsers, userPage).map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td><td>{u.email}</td><td>{u.contact || '-'}</td><td>{u.education || '-'}</td><td>{u.college || '-'}</td><td>{u.skills || '-'}</td><td>{u.experience || '-'}</td>
                    <td>
                      <Link className="btn btn-sm btn-outline-primary" to={`/admin/user/${u.id}/edit`}>Update</Link>
                      <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => deleteUser(u.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex justify-content-end align-items-center p-2">
              <button className="btn btn-sm btn-outline-secondary me-2" disabled={userPage === 1} onClick={() => setUserPage(p => p - 1)}>Previous</button>
              <span>Page {userPage} of {userPages}</span>
              <button className="btn btn-sm btn-outline-secondary ms-2" disabled={userPage === userPages} onClick={() => setUserPage(p => p + 1)}>Next</button>
            </div>
          </div>
        </div>
      )}

     {tab === "stats" && (
  <div>
    <div className="row g-4 mb-4">
      <div className="col-md-3">
        <div
          className="card shadow-lg text-white p-4 rounded-4"
          style={{ minHeight: "180px", background: "linear-gradient(135deg, #4b0263ff, #7e2a98ff)" }}
        >
          <div className="card-body d-flex align-items-center justify-content-between">
            <div>
              <div className="fs-4 fw-bold">Jobs</div>
              <div className="display-4 fw-bolder">{filteredJobs.length}</div>
            </div>
            <i className="fas fa-briefcase fa-4x opacity-75"></i>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div
          className="card shadow-lg text-white p-4 rounded-4"
          style={{ minHeight: "180px", background: "linear-gradient(135deg, #05867cff, #38ef7d)" }}
        >
          <div className="card-body d-flex align-items-center justify-content-between">
            <div>
              <div className="fs-4 fw-bold">Applications</div>
              <div className="display-4 fw-bolder">{filteredApps.length}</div>
            </div>
            <i className="fas fa-file-alt fa-4x opacity-75"></i>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div
          className="card shadow-lg text-white p-4 rounded-4"
          style={{ minHeight: "180px", background: "linear-gradient(135deg, #60130bff, #ed213a)" }}
        >
          <div className="card-body d-flex align-items-center justify-content-between">
            <div>
              <div className="fs-4 fw-bold">Users</div>
              <div className="display-4 fw-bolder">{filteredUsers.length}</div>
            </div>
            <i className="fas fa-users fa-4x opacity-75"></i>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div
          className="card shadow-lg text-white p-4 rounded-4"
          style={{ minHeight: "180px", background: "linear-gradient(135deg, #b05500ff, #ffc837)" }}
        >
          <div className="card-body d-flex align-items-center justify-content-between">
            <div>
              <div className="fs-4 fw-bold">HRs</div>
              <div className="display-4 fw-bolder">{filteredHrs.length}</div>
            </div>
            <i className="fas fa-user-tie fa-4x opacity-75"></i>
          </div>
        </div>
      </div>
    </div>


        <div className="card shadow-lg mb-4 rounded-4">
  <div
    className="card-header fw-bold text-white"
    style={{ background: "linear-gradient(135deg, #1e3c72, #2a5298)" }}
  >
    All Jobs
  </div>
  <div className="p-2">
    <input
      className="form-control"
      placeholder="Search Jobs..."
      value={qJob}
      onChange={(e) => setQJob(e.target.value)}
    />
  </div>
  <div className="table-responsive">
    <table className="table table-hover align-middle mb-0">
      <thead
        className="text-white"
        style={{ background: "linear-gradient(135deg, #232526, #414345)" }}
      >
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Category</th>
          <th>Location</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        {paginatedJobs.map((j) => (
          <tr key={j.id}>
            <td>{j.id}</td>
            <td>{j.title}</td>
            <td>{j.category}</td>
            <td>{j.location}</td>
            <td>{new Date(j.created_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="d-flex justify-content-start align-items-center p-2">
      <button
        className="btn btn-sm me-2"
        style={{ border: "1px solid #000", color: "#000", backgroundColor: "#f1f1f1" }}
        disabled={jobPage === 1}
        onClick={() => setJobPage((p) => p - 1)}
      >
        Previous
      </button>
      <span>Page {jobPage} of {jobPages}</span>
      <button
        className="btn btn-sm ms-2"
        style={{ border: "1px solid #000", color: "#000", backgroundColor: "#f1f1f1" }}
        disabled={jobPage === jobPages}
        onClick={() => setJobPage((p) => p + 1)}
      >
        Next
      </button>
    </div>
  </div>
</div>

<div className="p-2 border border-dark rounded">
  <div
    className="card-header fw-bold text-white"
    style={{ background: "linear-gradient(135deg, #93291e, #ed213a)" }}
  >
    All Applications
  </div>
  <div className="p-2">
    <input
      className="form-control"
      placeholder="Search Applications..."
      value={qApp}
      onChange={(e) => setQApp(e.target.value)}
    />
  </div>
  <div className="table-responsive">
    <table className="table table-hover align-middle mb-0">
      <thead
        className="text-white"
        style={{ background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)" }}
      >
        <tr>
          <th>ID</th>
          <th>Applicant</th>
          <th>Email</th>
          <th>Job</th>
          <th>Category</th>
          <th>Location</th>
          <th>Status</th>
          <th>Applied On</th>
        </tr>
      </thead>
      <tbody>
        {paginatedApps.map((a) => (
          <tr key={a.id}>
            <td>{a.id}</td>
            <td>{a.applicant_name}</td>
            <td>{a.user_email}</td>
            <td>#{a.job_id} - {a.job_title}</td>
            <td>{a.category}</td>
            <td>{a.location}</td>
            <td>{a.status}</td>
            <td>{new Date(a.created_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="d-flex justify-content-start align-items-center p-2">
      <button
        className="btn btn-sm me-2"
        style={{ border: "1px solid #000", color: "#000", backgroundColor: "#f1f1f1" }}
        disabled={appPage === 1}
        onClick={() => setAppPage((p) => p - 1)}
      >
        Previous
      </button>
      <span>Page {appPage} of {appPages}</span>
      <button
        className="btn btn-sm ms-2"
        style={{ border: "1px solid #000", color: "#000", backgroundColor: "#f1f1f1" }}
        disabled={appPage === appPages}
        onClick={() => setAppPage((p) => p + 1)}
      >
        Next
      </button>
    </div>
  </div>
</div>

        </div>
      )}
    </DashboardLayout>
    </>
  );
}
