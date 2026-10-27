import React, { useState, useEffect } from 'react';

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('Logging in...');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Invalid email or password.');

     // Check if the selected login role matches the user's actual role in the database
      if (data.user.role.toLowerCase() !== role.toLowerCase()) {
        throw new Error(`Access denied. You are not registered as a ${role}.`);
      }

      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role.toLowerCase() === 'admin') {
        window.location.href = '/admin.html';
      } else if (data.user.role.toLowerCase() === 'student') {
        window.location.href = '/student.html';
      } else {
        setUser(data.user);
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div style={styles.body}>
      <main style={styles.loginContainer}>
        <div style={styles.logo}>🎓</div>
        <h1 style={styles.h1}>Welcome Back!</h1>
        <p style={styles.subtitle}>Student Attendance<br />Management System</p>

        <form onSubmit={handleLogin}>
          <label style={styles.label}>Login As</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.input}>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>

          <label style={styles.label}>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.loginBtn}>Sign In →</button>
          {message && <p style={styles.message}>{message}</p>}
        </form>
      </main>
    </div>
  );
}

const styles = {
  body: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #0f172a, #1d4ed8)',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif',
    width: '100vw',
    margin: 0,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  loginContainer: {
    width: '100%',
    maxWidth: '420px',
    background: '#fff',
    padding: '35px 28px',
    borderRadius: '20px',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
  },
  logo: {
    width: '70px',
    height: '70px',
    margin: '0 auto 18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#dbeafe',
    borderRadius: '20px',
    fontSize: '35px',
  },
  h1: { color: '#0f172a', fontSize: '25px', textAlign: 'center', marginBottom: '8px' },
  subtitle: { textAlign: 'center', color: '#64748b', fontSize: '14px', marginBottom: '28px' },
  label: { display: 'block', color: '#334155', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' },
  input: { width: '100%', padding: '14px', border: '1px solid #cbd5e1', borderRadius: '10px', marginBottom: '20px', background: '#f8fafc', fontSize: '15px', boxSizing: 'border-box' },
  loginBtn: { width: '100%', padding: '15px', border: 'none', borderRadius: '10px', background: '#2563eb', color: 'white', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  message: { textAlign: 'center', fontSize: '14px', marginTop: '15px', color: '#b91c1c' },
};