import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

export default function ProfileForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [education, setEducation] = useState('');
  const [college, setCollege] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [me, setMe] = useState(null);
  const [saving, setSaving] = useState(false);

  const [initialValues, setInitialValues] = useState(null);
  const defaultAvatar = '/reglogo.png'; 

  useEffect(() => {
    api.get('/users/me')
      .then(r => {
        setMe(r.data);
        const u = r.data || {};
        setName(u.name || '');
        setEmail(u.email || '');
        setContact(u.contact || '');
        setEducation(u.education || '');
        setCollege(u.college || '');
        setExperience(u.experience || '');
        setSkills(u.skills || '');
        setAvatar(u.avatar || null); 

        // backup for reset
        setInitialValues({
          name: u.name || '',
          email: u.email || '',
          contact: u.contact || '',
          education: u.education || '',
          college: u.college || '',
          experience: u.experience || '',
          skills: u.skills || '',
          avatar: u.avatar || null
        });
      })
      .catch(() => {
        toast.error("Failed to load profile");
      });
  }, []);

  const submit = async e => {
    e.preventDefault();
    if (contact && !/^\d{10}$/.test(contact)) {
      return toast.error('Contact must be 10 digits');
    }

    const form = new FormData();
    form.append('name', name);
    form.append('email', email);
    form.append('contact', contact);
    form.append('education', education);
    form.append('college', college);
    form.append('experience', experience);
    form.append('skills', skills);
    if (avatar && typeof avatar !== 'string') form.append('avatar', avatar); 

    try {
      setSaving(true);
      await api.post('/users/me', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Profile updated');
    } catch (e) {
      toast.error(e?.response?.data?.msg || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (initialValues) {
      setName(initialValues.name);
      setEmail(initialValues.email);
      setContact(initialValues.contact);
      setEducation(initialValues.education);
      setCollege(initialValues.college);
      setExperience(initialValues.experience);
      setSkills(initialValues.skills);
      setAvatar(initialValues.avatar || null);
    }
  };

  if (!me) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-lg rounded-4 border-0 overflow-hidden">
      <div
        className="card-header text-white p-4"
        style={{ background: 'linear-gradient(135deg, #4548c9ff, #447bdaff)' }}
      >
        <div className="d-flex align-items-center">
        <img
  src={
    avatar
      ? (typeof avatar === 'string' ? `http://localhost:5000${avatar}` : URL.createObjectURL(avatar))
      : defaultAvatar
  }
  onError={(e) => (e.target.src = defaultAvatar)}
  alt="profile"
  className="rounded-circle mb-2"
  style={{ width: '70px', height: '70px', objectFit: 'cover' }}
/>

          <div className="ms-3">
            <div className="fw-bold fs-5">{me?.name || 'Your Name'}</div>
          </div>
        </div>
      </div>

      <div className="card-body p-4 bg-light">
        <form onSubmit={submit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Name</label>
              <input
                className="form-control shadow-sm"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Email</label>
              <input
                className="form-control shadow-sm"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Contact</label>
              <input
                className="form-control shadow-sm"
                value={contact}
                onChange={e => setContact(e.target.value)}
                placeholder="10-digit mobile"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Education</label>
              <input
                className="form-control shadow-sm"
                value={education}
                onChange={e => setEducation(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">College</label>
              <input
                className="form-control shadow-sm"
                value={college}
                onChange={e => setCollege(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Experience</label>
              <input
                className="form-control shadow-sm"
                value={experience}
                onChange={e => setExperience(e.target.value)}
              />
            </div>
            <div className="col-6">
              <label className="form-label fw-semibold">Skills</label>
              <input
                className="form-control shadow-sm"
                value={skills}
                onChange={e => setSkills(e.target.value)}
                placeholder="React, Node, SQL"
              />
            </div>
            <div className="col-6">
              <label className="form-label fw-semibold">Profile Photo</label>
              <input
                className="form-control shadow-sm"
                type="file"
                onChange={e => setAvatar(e.target.files[0])}
                accept="image/*"
              />
            </div>
          </div>

          <div className="mt-2 d-flex justify-content-end">
            <button
              className="btn btn-primary me-2 btn-sm"
              type="submit"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
