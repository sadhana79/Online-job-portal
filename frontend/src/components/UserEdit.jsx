import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import HRDashboardLayout from '../components/DashboardLayout'; 

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/admin/user/${id}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        toast.error('Failed to fetch user details.');
        console.error(error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData(e.target);
      const payload = Object.fromEntries(fd.entries());
      await api.put(`/admin/user/${id}`, payload);
      toast.success('User updated');
      navigate('/admin?tab=users');
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error('Failed to update user');
    }
  };

  if (loading) return <div className="p-3">Loading...</div>;
  if (!user) return <div className="p-3">User not found</div>;

  return (
    <HRDashboardLayout>
      <div className="container mt-5">
        <div className="card shadow-lg border-1 rounded-4">
          <div className="card-header bg-primary text-white fw-bold fs-5">
            Edit User
          </div>
          <div className="card-body">
            <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-4">
                <label className="form-label">Name</label>
                <input name="name" defaultValue={user.name} className="form-control" required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Email</label>
                <input name="email" defaultValue={user.email} className="form-control" type="email" required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Contact</label>
                <input name="contact" defaultValue={user.contact} className="form-control" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Education</label>
                <input name="education" defaultValue={user.education} className="form-control" />
              </div>
              <div className="col-md-4">
                <label className="form-label">College</label>
                <input name="college" defaultValue={user.college} className="form-control" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Skills</label>
                <input name="skills" defaultValue={user.skills} className="form-control" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Experience</label>
                <input name="experience" defaultValue={user.experience} className="form-control" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Password (leave blank to keep)</label>
                <input name="password" className="form-control" type="password" />
              </div>
              <div className="col-12 d-flex justify-content-end mt-3">
                <button className="btn btn-primary">Update User</button>
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={() => navigate('/admin?tab=users')}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </HRDashboardLayout>
  );
}
