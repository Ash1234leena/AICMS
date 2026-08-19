import { useState } from "react";
import SeatReservation from "../SeatReservation";
import StudentMap from "./StudentMap";
import "./StudentDashboard.css";

function StudentDashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  // =========================
  // LIVE TRACKING PAGE
  // =========================
  if (activePage === "tracking") {
    return (
      <div className="student-layout">

        <aside className="sidebar">

          <div className="brand">
            <div className="brand-icon">🚌</div>

            <div>
              <h1>SmartBus</h1>
              <p>STUDENT</p>
            </div>
          </div>

          <nav>

            <button
              className="menu-item"
              onClick={() => setActivePage("dashboard")}
            >
              🏠 <span>Dashboard</span>
            </button>

            <button className="menu-item">
              🚌 <span>My Bus</span>
            </button>

            <button className="menu-item active">
              📍 <span>Live Tracking</span>
            </button>

            <button
              className="menu-item"
              onClick={() => setActivePage("seat")}
            >
              💺 <span>Seat Reservation</span>
            </button>

            <button className="menu-item">
              👥 <span>Queue Status</span>
            </button>

            <button className="menu-item">
              🔔 <span>Notifications</span>
            </button>

            <button className="menu-item">
              🔄 <span>Alternate Bus</span>
            </button>

          </nav>

        </aside>

        <main className="main-content">

          <StudentMap />

        </main>

      </div>
    );
  }


  // =========================
  // SEAT RESERVATION PAGE
  // =========================
  if (activePage === "seat") {
    return (
      <div className="student-layout">

        <aside className="sidebar">

          <div className="brand">
            <div className="brand-icon">🚌</div>

            <div>
              <h1>SmartBus</h1>
              <p>STUDENT</p>
            </div>
          </div>

          <nav>

            <button
              className="menu-item"
              onClick={() => setActivePage("dashboard")}
            >
              🏠 <span>Dashboard</span>
            </button>

            <button className="menu-item">
              🚌 <span>My Bus</span>
            </button>

            <button
              className="menu-item"
              onClick={() => setActivePage("tracking")}
            >
              📍 <span>Live Tracking</span>
            </button>

            <button
              className="menu-item active"
              onClick={() => setActivePage("seat")}
            >
              💺 <span>Seat Reservation</span>
            </button>

            <button className="menu-item">
              👥 <span>Queue Status</span>
            </button>

            <button className="menu-item">
              🔔 <span>Notifications</span>
            </button>

            <button className="menu-item">
              🔄 <span>Alternate Bus</span>
            </button>

          </nav>

        </aside>

        <main className="main-content">

          <button
            className="back-button"
            onClick={() => setActivePage("dashboard")}
          >
            ← Back to Dashboard
          </button>

          <SeatReservation />

        </main>

      </div>
    );
  }


  // =========================
  // MAIN DASHBOARD
  // =========================
  return (
    <div className="student-layout">

      {/* LEFT SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-icon">
            🚌
          </div>

          <div>
            <h1>SmartBus</h1>
            <p>STUDENT</p>
          </div>

        </div>


        <nav>

          {/* Dashboard */}

          <button
            className="menu-item active"
            onClick={() => setActivePage("dashboard")}
          >
            🏠
            <span>Dashboard</span>
          </button>


          {/* My Bus */}

          <button className="menu-item">
            🚌
            <span>My Bus</span>
          </button>


          {/* Live Tracking */}

          <button
            className="menu-item"
            onClick={() => setActivePage("tracking")}
          >
            📍
            <span>Live Tracking</span>
          </button>


          {/* Seat Reservation */}

          <button
            className="menu-item"
            onClick={() => setActivePage("seat")}
          >
            💺
            <span>Seat Reservation</span>
          </button>


          {/* Queue Status */}

          <button className="menu-item">
            👥
            <span>Queue Status</span>
          </button>


          {/* Notifications */}

          <button className="menu-item">
            🔔
            <span>Notifications</span>
          </button>


          {/* Alternate Bus */}

          <button className="menu-item">
            🔄
            <span>Alternate Bus</span>
          </button>

        </nav>

      </aside>


      {/* MAIN DASHBOARD */}

      <main className="main-content">

        <div className="dashboard-header">

          <div>

            <p className="small-heading">
              STUDENT DASHBOARD
            </p>

            <h1>
              Welcome to SmartBus
            </h1>

            <p className="subtitle">
              Manage your college transportation
            </p>

          </div>

        </div>


        {/* TODAY'S BUS */}

        <section className="bus-card">

          <p className="small-heading">
            TODAY'S BUS
          </p>

          <h2>
            BUS 101
          </h2>

          <div className="bus-route">

            <div>

              <span className="route-dot"></span>

              <p>College</p>

              <small>
                Departure · 5:30 PM
              </small>

            </div>


            <div className="route-line">

              🚌

            </div>


            <div>

              <span className="route-dot"></span>

              <p>Campus</p>

              <small>
                ETA · 5:55 PM
              </small>

            </div>

          </div>


          {/* TRACK BUTTON */}

          <button
            className="track-button"
            onClick={() => setActivePage("tracking")}
          >
            📍 Track Bus Live
          </button>

        </section>


        {/* QUICK ACTIONS */}

        <section className="quick-section">

          <p className="small-heading">
            QUICK ACTIONS
          </p>

          <h2>
            What do you need?
          </h2>


          <div className="quick-grid">


            {/* RESERVE SEAT */}

            <button
              className="quick-card"
              onClick={() => setActivePage("seat")}
            >

              <div className="quick-icon">
                💺
              </div>

              <h3>
                Reserve Seat
              </h3>

              <p>
                Book your evening seat
              </p>

            </button>


            {/* TRACK BUS */}

            <button
              className="quick-card"
              onClick={() => setActivePage("tracking")}
            >

              <div className="quick-icon">
                📍
              </div>

              <h3>
                Track Bus
              </h3>

              <p>
                See live bus location
              </p>

            </button>


            {/* QUEUE STATUS */}

            <button className="quick-card">

              <div className="quick-icon">
                👥
              </div>

              <h3>
                Queue Status
              </h3>

              <p>
                Check students waiting
              </p>

            </button>


            {/* ALTERNATE BUS */}

            <button className="quick-card">

              <div className="quick-icon">
                🔄
              </div>

              <h3>
                Alternate Bus
              </h3>

              <p>
                Find another available bus
              </p>

            </button>


          </div>

        </section>

      </main>

    </div>
  );
}

export default StudentDashboard;