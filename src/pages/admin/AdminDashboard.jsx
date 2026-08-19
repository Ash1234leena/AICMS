import { useState } from "react";
import "./AdminDashboard.css";

const ROUTES = [
  "17G",
  "17D",
  "18D",
  "19F",
  "19A",
  "19C",
  "20F",
  "20B",
  "20D",
  "20",
  "20E",
  "21C",
  "22",
  "23",
  "25C",
  "27C",
];

const TRIPS = [
  {
    id: "morning7",
    label: "7:00 AM",
    period: "Morning Trip 1",
    icon: "🌅",
  },
  {
    id: "morning9",
    label: "9:00 AM",
    period: "Morning Trip 2",
    icon: "☀️",
  },
  {
    id: "evening315",
    label: "3:15 PM",
    period: "Evening Trip 1",
    icon: "🌇",
  },
  {
    id: "evening505",
    label: "5:05 PM",
    period: "Evening Trip 2",
    icon: "🌙",
  },
];

const createDefaultSchedule = () => {
  const schedule = {};

  TRIPS.forEach((trip) => {
    schedule[trip.id] = {};

    ROUTES.forEach((route) => {
      schedule[trip.id][route] = true;
    });
  });

  return schedule;
};

function AdminDashboard() {
  const [selectedTrip, setSelectedTrip] = useState("morning7");

  const [schedule, setSchedule] = useState(() => {
    const savedSchedule = localStorage.getItem("smartbusSchedule");

    if (savedSchedule) {
      return JSON.parse(savedSchedule);
    }

    return createDefaultSchedule();
  });

  const toggleRoute = (route) => {
    setSchedule((previousSchedule) => {
      const updatedSchedule = {
        ...previousSchedule,
        [selectedTrip]: {
          ...previousSchedule[selectedTrip],
          [route]: !previousSchedule[selectedTrip][route],
        },
      };

      localStorage.setItem(
        "smartbusSchedule",
        JSON.stringify(updatedSchedule)
      );

      return updatedSchedule;
    });
  };

  const enableAllRoutes = () => {
    setSchedule((previousSchedule) => {
      const updatedTrip = {};

      ROUTES.forEach((route) => {
        updatedTrip[route] = true;
      });

      const updatedSchedule = {
        ...previousSchedule,
        [selectedTrip]: updatedTrip,
      };

      localStorage.setItem(
        "smartbusSchedule",
        JSON.stringify(updatedSchedule)
      );

      return updatedSchedule;
    });
  };

  const disableAllRoutes = () => {
    setSchedule((previousSchedule) => {
      const updatedTrip = {};

      ROUTES.forEach((route) => {
        updatedTrip[route] = false;
      });

      const updatedSchedule = {
        ...previousSchedule,
        [selectedTrip]: updatedTrip,
      };

      localStorage.setItem(
        "smartbusSchedule",
        JSON.stringify(updatedSchedule)
      );

      return updatedSchedule;
    });
  };

  const activeRoutes = ROUTES.filter(
    (route) => schedule[selectedTrip]?.[route]
  ).length;

  const selectedTripDetails = TRIPS.find(
    (trip) => trip.id === selectedTrip
  );

  return (
    <div className="admin-page">

      {/* HEADER */}
      <header className="admin-header">

        <div>
          <p className="admin-small-title">
            SMARTBUS ADMIN
          </p>

          <h1>
            Transport Management
          </h1>

          <p className="admin-subtitle">
            Manage routes and transport schedules
          </p>
        </div>

        <div className="admin-status">
          <span className="admin-status-dot"></span>
          System Online
        </div>

      </header>


      {/* TRIP SELECTOR */}
      <section className="trip-section">

        <div className="section-heading">

          <div>
            <span className="section-label">
              TRANSPORT SCHEDULE
            </span>

            <h2>
              Select Trip
            </h2>
          </div>

          <div className="route-count">
            <strong>{activeRoutes}</strong>
            <span>Active Routes</span>
          </div>

        </div>


        <div className="trip-grid">

          {TRIPS.map((trip) => {

            const activeCount =
              ROUTES.filter(
                (route) =>
                  schedule[trip.id]?.[route]
              ).length;

            return (
              <button
                key={trip.id}
                className={
                  selectedTrip === trip.id
                    ? "trip-card active"
                    : "trip-card"
                }
                onClick={() =>
                  setSelectedTrip(trip.id)
                }
              >

                <span className="trip-icon">
                  {trip.icon}
                </span>

                <span className="trip-info">

                  <strong>
                    {trip.label}
                  </strong>

                  <small>
                    {trip.period}
                  </small>

                </span>

                <span className="trip-active-count">
                  {activeCount}
                </span>

              </button>
            );
          })}

        </div>

      </section>


      {/* ROUTE MANAGEMENT */}
      <section className="route-management">

        <div className="route-management-header">

          <div>

            <span className="section-label">
              ROUTE CONTROL
            </span>

            <h2>
              {selectedTripDetails?.icon}{" "}
              {selectedTripDetails?.label}
            </h2>

            <p>
              Enable or disable routes operating during this trip.
            </p>

          </div>


          <div className="bulk-actions">

            <button
              className="enable-all"
              onClick={enableAllRoutes}
            >
              ✓ Enable All
            </button>

            <button
              className="disable-all"
              onClick={disableAllRoutes}
            >
              × Disable All
            </button>

          </div>

        </div>


        {/* ROUTES */}
        <div className="route-grid">

          {ROUTES.map((route) => {

            const isActive =
              schedule[selectedTrip]?.[route];

            return (
              <div
                key={route}
                className={
                  isActive
                    ? "route-card active"
                    : "route-card disabled"
                }
              >

                <div className="route-icon">
                  🚌
                </div>

                <div className="route-details">

                  <strong>
                    Route {route}
                  </strong>

                  <span>
                    {isActive
                      ? "Operating"
                      : "Disabled"}
                  </span>

                </div>


                {/* TOGGLE */}
                <button
                  type="button"
                  className={
                    isActive
                      ? "route-toggle on"
                      : "route-toggle"
                  }
                  onClick={() =>
                    toggleRoute(route)
                  }
                  aria-label={`Toggle route ${route}`}
                >

                  <span></span>

                </button>

              </div>
            );
          })}

        </div>

      </section>


      {/* SYSTEM INFORMATION */}
      <section className="admin-info">

        <div className="info-box">
          <span>🕐</span>

          <div>
            <strong>
              Current Schedule
            </strong>

            <p>
              {selectedTripDetails?.label} —{" "}
              {selectedTripDetails?.period}
            </p>
          </div>
        </div>


        <div className="info-box">
          <span>🚌</span>

          <div>
            <strong>
              Active Routes
            </strong>

            <p>
              {activeRoutes} of {ROUTES.length} routes
              currently enabled
            </p>
          </div>
        </div>


        <div className="info-box">
          <span>🔐</span>

          <div>
            <strong>
              Admin Control
            </strong>

            <p>
              Route changes are saved automatically.
            </p>
          </div>
        </div>

      </section>

    </div>
  );
}

export default AdminDashboard;
