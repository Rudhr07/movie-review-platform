import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { movieService } from '../services/movieService';

const AdminDashboard = () => {
  const { user } = useSelector(s => s.auth);
  const [form, setForm] = useState({ title:'', overview:'', releaseDate:'', genres:'', director:'', cast:'', runtime:'', tagline:'' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user && user.isAdmin) {
      // Admin specific logic if needed
    }
  }, [user]);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async e => {
    e.preventDefault();
    setSubmitting(true); setMessage('');
    try {
      const payload = { ...form, genres: form.genres.split(',').map(g=>g.trim()).filter(Boolean), cast: form.cast.split(',').map(c=>c.trim()).filter(Boolean) };
      const res = await movieService.addMovie(payload);
      setMessage(`Movie added: ${res.data.movie?.title || res.data.title}`);
      setForm({ title:'', overview:'', releaseDate:'', genres:'', director:'', cast:'', runtime:'', tagline:'' });
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Failed to add movie');
    } finally { setSubmitting(false); }
  };

  if (!user || !user.isAdmin) {
    return (
      <div className="admin-dashboard">
        <div className="unauthorized">
          <h2>Access Denied</h2>
          <p>You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>Admin - Add Movie</h1>
        
        {message && <div className="message" style={{marginBottom:'1rem'}}>{message}</div>}
        
        <form onSubmit={onSubmit} className="simple-form">
          <div className="grid-2">
            <label>Title
              <input name="title" value={form.title} onChange={onChange} required />
            </label>
            <label>Release Date
              <input name="releaseDate" type="date" value={form.releaseDate} onChange={onChange} />
            </label>
          </div>
          <label>Overview
            <textarea name="overview" value={form.overview} onChange={onChange} rows={4} required />
          </label>
          <div className="grid-2">
            <label>Genres (comma separated)
              <input name="genres" value={form.genres} onChange={onChange} />
            </label>
            <label>Cast (comma separated)
              <input name="cast" value={form.cast} onChange={onChange} />
            </label>
          </div>
          <div className="grid-2">
            <label>Director
              <input name="director" value={form.director} onChange={onChange} />
            </label>
            <label>Runtime (min)
              <input name="runtime" value={form.runtime} onChange={onChange} type="number" />
            </label>
          </div>
          <label>Tagline
            <input name="tagline" value={form.tagline} onChange={onChange} />
          </label>
          <button className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Add Movie'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;