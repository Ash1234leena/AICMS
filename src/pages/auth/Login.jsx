import { useState } from "react";
import "./Login.css";

import collegeLogo from "../../assets/college-logo.png";

import StudentDashboard from "../student/StudentDashboard";
import AdminDashboard from "../admin/AdminDashboard";

function Login() {
  const [role, setRole] = useState(
    localStorage.getItem("smartbusRole") || "student"
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("smartbusLoggedIn") === "true"
  );

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    // Save login information
    localStorage.setItem("smartbusLoggedIn", "true");
    localStorage.setItem("smartbusRole", role);
    localStorage.setItem("smartbusEmail", email);

    setLoggedIn(true);
  };

  // Show dashboard after login
  if (loggedIn) {
    if (role === "student") {
      return <StudentDashboard />;
    }

    return <AdminDashboard />;
  }

  return (
    <div className="login-page">

      {/* Background glow */}
      <div className="glow glow-one"></div>
      <div className="glow glow-two"></div>
      <div className="glow glow-three"></div>

      {/* LOGIN CARD */}
      <div className="login-card">

        {/* COLLEGE LOGO */}
        <div className="college-logo-container">
          <img
            src={collegeLogo}
            alt="Rajalakshmi Engineering College"
            className="college-logo"
          />
        </div>

        {/* SMARTBUS BRAND */}
        <div className="smartbus-brand">

          <div className="bus-logo">
            🚌
          </div>

          <div>
            <h1>SmartBus</h1>

            <p>
              COLLEGE TRANSPORT SYSTEM
            </p>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="login-divider"></div>

        {/* HEADING */}
        <div className="login-heading">

          <h2>Welcome Back</h2>

          <p>
            Sign in to continue to SmartBus
          </p>

        </div>

        {/* ROLE SELECTION */}
        <div className="role-section">

          <label>
            LOGIN AS
          </label>

          <div className="role-buttons">

            {/* STUDENT */}
            <button
              type="button"
              className={
                role === "student"
                  ? "role-button active"
                  : "role-button"
              }
              onClick={() => setRole("student")}
            >
              <span className="role-icon">
                🎓
              </span>

              <span>
                Student
              </span>
            </button>

            {/* ADMIN */}
            <button
              type="button"
              className={
                role === "admin"
                  ? "role-button active"
                  : "role-button"
              }
              onClick={() => setRole("admin")}
            >
              <span className="role-icon">
                🛡️
              </span>

              <span>
                Admin
              </span>
            </button>

          </div>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin}>

          {/* EMAIL */}
          <div className="input-group">

            <label>
              College Email
            </label>

            <div className="input-wrapper">

              <span>
                ✉
              </span>

              <input
                type="email"
                placeholder="Enter your college email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

            </div>
          </div>

          {/* PASSWORD */}
          <div className="input-group">

            <label>
              Password
            </label>

            <div className="input-wrapper">

              <span>
                🔒
              </span>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="login-button"
          >

            <span>
              Login as{" "}
              {role === "student"
                ? "Student"
                : "Admin"}
            </span>

            <span className="login-arrow">
              →
            </span>

          </button>

        </form>

        {/* SECURITY */}
        <div className="security-message">

          <span>
            🔐
          </span>

          <p>
            Secure college account verification
          </p>

        </div>

        {/* COLLEGE NAME */}
        <p className="college-name">
          Rajalakshmi Engineering College
        </p>

      </div>
    </div>
  );
}

export default Login;