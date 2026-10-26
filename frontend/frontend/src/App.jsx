import { useState } from 'react';
import heroImg from './assets/hero.png';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [role, setRole] = useState("student");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  // New states for location attendance check-in
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceMessage, setAttendanceMessage] = useState("");
  const [attendanceError, setAttendanceError] = useState("");

  function handleLogin(event) {
    event.preventDefault();
    const id = userId.trim().toUpperCase();
 console.log("Logging in with Role:", role, "ID:", id, "Password:", password);
    if (
      role === "admin" &&
      id === "ADMIN001" &&
      password === "Admin123"
    ) {
      setSuccess(true);
      setMessage("Admin login successful!");
       setTimeout(() => {
        window.location.href = './admin.html';
      }, 500);
      return;
    }  else if (
      role === "student" &&
      id === "STU001" &&
      password === "Student123"
    ) {
      setSuccess(true);
      setMessage("Student login successful!");
    } else {
      setSuccess(false);
      setMessage("Invalid User ID, password, or selected role.");
    }
  }

  // Geolocation & Attendance API call function
  const handleMarkAttendance = () => {
    setAttendanceLoading(true);
    setAttendanceMessage("");
    setAttendanceError("");

    if (!navigator.geolocation) {
      setAttendanceError("Geolocation is not supported by your browser.");
      setAttendanceLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch('http://localhost:5000/api/attendance/mark', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: 1, // Maps to your database user record ID
              locationId: 1, // Target building/office location ID
              latitude,
              longitude,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to mark attendance.');
          }

          setAttendanceMessage(data.message);
        } catch (err) {
          setAttendanceError(err.message);
        } finally {
          setAttendanceLoading(false);
        }
      },
      () => {
        setAttendanceError("Unable to retrieve your location. Please enable GPS permissions.");
        setAttendanceLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <main className="login-container">
      <section className="login-container">
        
        {/* Conditional Rendering: If logged in successfully as a Student */}
        {success && role === "student" ? (
          <div className="dashboard-container" style={{ textAlign: 'center', padding: '20px' }}>
            <h2>Welcome, {userId}</h2>
            <p style={{ color: '#15803d', fontWeight: 'bold' }}>{message}</p>
            <p>Click below to verify your location and mark your attendance for today.</p>

            <button
              onClick={handleMarkAttendance}
              disabled={attendanceLoading}
              className="login-btn"
              style={{ marginTop: '20px', cursor: 'pointer' }}
            >
              {attendanceLoading ? "Verifying GPS Location..." : "Mark Attendance 📍"}
            </button>

            {attendanceMessage && (
              <p style={{ color: "#15803d", marginTop: "15px", fontWeight: "bold" }}>
                {attendanceMessage}
              </p>
            )}
            {attendanceError && (
              <p style={{ color: "#b91c1c", marginTop: "15px", fontWeight: "bold" }}>
                Error: {attendanceError}
              </p>
            )}

            <button
              onClick={() => { setSuccess(false); setUserId(""); setPassword(""); }}
              style={{ marginTop: '30px', background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Sign Out
            </button>
          </div>
        ) : success && role === "admin" ? (
          // Admin View after successful login
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>Admin Dashboard</h2>
            <p style={{ color: '#15803d', fontWeight: 'bold' }}>{message}</p>
            <button
              onClick={() => { setSuccess(false); setUserId(""); setPassword(""); }}
              style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          // Default Login Form View
          <>
            <div className="logo">🎓</div>
            <h1>Welcome Back!</h1>
            <p className="subtitle">
              Student Attendance<br />
              Management System
            </p>

            <form id="loginForm" onSubmit={handleLogin}>
              <label htmlFor="role">Login As</label>
              <select
                id="role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                required
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>

              <label htmlFor="userId">User ID</label>
              <input
                type="text"
                id="userId"
                placeholder="Enter your User ID"
                autoComplete="username"
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                required
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <button type="submit" className="login-btn">
                Sign In &rarr;
              </button>

              <p
                id="message"
                role="status"
                style={{ color: success ? "#15803d" : "#b91c1c" }}
              >
                {message}
              </p>
            </form>
          </>
        )}

        <div className="footer">
          Student Attendance Management System
        </div>
      </section>
    </main>
  );
}

export default App;