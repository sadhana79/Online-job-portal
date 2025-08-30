import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function UserEdit() {
  const { id } = useParams();
  const history = useHistory();
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get(`/admin/user/${id}`)
      .then((response) => setUser(response.data))
      .catch((error) => {
        toast.error('Failed to fetch user details.');
        console.error(error);
      });
  }, [id]);

  const handleUpdateUser = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const updatedUser = Object.fromEntries(form.entries());

    api.put(`/admin/user/${id}`, updatedUser)
      .then(() => {
        toast.success('User updated successfully');
        history.push('/admin/users');
      })
      .catch((error) => {
        toast.error('Error updating user');
        console.error(error);
      });
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container">
      <h4>Edit User</h4>
      <form className="row g-3 mb-4 p-3 border rounded shadow-sm" onSubmit={handleUpdateUser}>
        <div className="col-md-3">
          <label className="form-label fw-bold">Name</label>
          <input className="form-control" name="name" defaultValue={user.name} required />
        </div>
        <div className="col-md-3">
          <label className="form-label fw-bold">Email</label>
          <input type="email" className="form-control" name="email" defaultValue={user.email} required />
        </div>
        <div className="col-md-3">
          <label className="form-label fw-bold">Password</label>
          <input type="password" className="form-control" name="password" placeholder="Password" />
        </div>
        <div className="col-md-3">
          <label className="form-label fw-bold">Education</label>
          <input className="form-control" name="education" defaultValue={user.education} />
        </div>
        <div className="col-md-3">
          <label className="form-label fw-bold">Skills</label>
          <input className="form-control" name="skills" defaultValue={user.skills} />
        </div>
        <div className="col-md-3">
          <label className="form-label fw-bold">Experience</label>
          <input className="form-control" name="experience" defaultValue={user.experience} />
        </div>
        <div className="col-md-3">
          <label className="form-label fw-bold">College</label>
          <input className="form-control" name="college" defaultValue={user.college} />
        </div>
        <div className="col-md-3 d-flex align-items-end">
          <button className="btn btn-primary w-100">Update User</button>
        </div>
      </form>
    </div>
  );
}
