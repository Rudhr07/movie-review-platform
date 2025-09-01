import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: ''
	});
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

		const [error, setError] = useState('');
		const [loading, setLoading] = useState(false);

		const handleSubmit = async (e) => {
			e.preventDefault();
			setLoading(true);
			setError('');
			try {
				const res = await fetch('http://localhost:5000/api/auth/register', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(formData)
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.message || 'Registration failed');
				alert('Registration successful!');
				navigate('/login');
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

	return (
			<div className="form-container">
				<div className="form-card">
					<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'.9rem',marginBottom:'.75rem'}}>
						<img src="/logo.svg.png" alt="MovieBuzzCheck" height={82} width={82} style={{filter:'drop-shadow(0 3px 6px rgba(0,0,0,.18))',borderRadius:'16px'}} />
						<h2 className="form-title" style={{margin:0}}>Create Account</h2>
					</div>
					{error && <div className="alert alert-error">{error}</div>}
					<form onSubmit={handleSubmit}>
						<div className="form-group">
							<label className="form-label">Username</label>
							<input
								type="text"
								name="username"
								value={formData.username}
								onChange={handleChange}
								className="form-input"
								placeholder="Enter your username"
								required
							/>
						</div>
						<div className="form-group">
							<label className="form-label">Email Address</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								className="form-input"
								placeholder="Enter your email"
								required
							/>
						</div>
						<div className="form-group">
							<label className="form-label">Password</label>
							<input
								type="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								className="form-input"
								placeholder="Enter your password"
								required
							/>
						</div>
						<button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
					</form>
					<div className="form-footer">Already have an account? <Link to="/login">Login</Link></div>
				</div>
			</div>
	);
};

export default Register;
