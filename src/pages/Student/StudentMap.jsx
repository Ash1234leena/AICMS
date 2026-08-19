import { useEffect, useMemo, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./StudentMap.css";


/*
=========================================================
REC TRANSPORT ROUTES
=========================================================
*/

const REC_ROUTES = {

  "19A": {
    destination: "Perungalathur",
    stops: [
      "REC",
      "Mudichur Road",
      "Parvathy Nagar",
      "Padmavathy Kalyanamandapam",
      "Krishnanagar",
      "Old Tambaram Kulam",
      "Irumpuliyur",
      "Perungalathur Bus Stop",
    ],
  },

  "20F": {
    destination: "Tambaram",
    stops: [
      "REC",
      "Mudichur Road",
      "Padmavathy Kalyanamandapam",
      "Tambaram",
    ],
  },

  "20D": {
    destination: "Sembakkam",
    stops: [
      "REC",
      "Mudichur Road",
      "Padmavathy Kalyanamandapam",
      "Tambaram Railway Station",
      "Camp Road",
      "Sembakkam",
      "Nanmangalam",
    ],
  },

  "21C": {
    destination: "Velachery",
    stops: [
      "REC",
      "Thillaiganga Nagar Subway",
      "NGO Colony Bus Stand",
      "Velachery",
    ],
  },

  "22": {
    destination: "Sholinganallur",
    stops: [
      "REC",
      "Sholinganallur",
    ],
  },

  "25C": {
    destination: "VGP",
    stops: [
      "REC",
      "Guindy",
      "Anna University",
      "Adyar",
      "Thiruvanmiyur Bus Stand",
      "Palavakkam",
      "VGP",
    ],
  },

  "27C": {
    destination: "Santhome",
    stops: [
      "REC",
      "Stella Maris",
      "Music Academy",
      "Luz",
      "Billroth Hospital",
      "Kotturpuram",
      "Santhome",
    ],
  },

};


/*
=========================================================
TRIP SCHEDULE
=========================================================
*/

const TRIPS = [
  {
    id: "morning7",
    label: "7:00 AM",
    name: "Morning Trip 1",
  },

  {
    id: "morning9",
    label: "9:00 AM",
    name: "Morning Trip 2",
  },

  {
    id: "evening315",
    label: "3:15 PM",
    name: "Evening Trip 1",
  },

  {
    id: "evening505",
    label: "5:05 PM",
    name: "Evening Trip 2",
  },
];


/*
=========================================================
DEFAULT SCHEDULE
=========================================================
*/

function createDefaultSchedule() {

  const schedule = {};

  TRIPS.forEach((trip) => {

    schedule[trip.id] = {};

    Object.keys(REC_ROUTES).forEach((route) => {

      schedule[trip.id][route] = true;

    });

  });

  return schedule;
}


/*
=========================================================
READ ADMIN SCHEDULE
=========================================================
*/

function getSavedSchedule() {

  try {

    const saved =
      localStorage.getItem("smartbusSchedule");

    if (saved) {

      const parsed = JSON.parse(saved);

      return parsed;

    }

  } catch (error) {

    console.error(
      "Error reading SmartBus schedule:",
      error
    );

  }

  return createDefaultSchedule();

}


/*
=========================================================
INITIAL POSITIONS
=========================================================
*/

const INITIAL_USER_LOCATION = [
  12.9232,
  80.1262,
];

const INITIAL_BUS_LOCATION = [
  12.9255,
  80.1295,
];


/*
=========================================================
BUS ICON
=========================================================
*/

const createBusIcon = (routeNumber) =>

  L.divIcon({

    className: "smartbus-marker",

    html: `

      <div class="bus-marker-wrapper">

        <div class="marker-label bus-label">
          ROUTE ${routeNumber}
        </div>

        <div class="bus-marker">
          🚌
        </div>

      </div>

    `,

    iconSize: [95, 82],

    iconAnchor: [47, 67],

    popupAnchor: [0, -65],

  });


/*
=========================================================
USER ICON
=========================================================
*/

const userIcon = L.divIcon({

  className: "smartbus-marker",

  html: `

    <div class="user-marker-wrapper">

      <div class="marker-label user-label">
        YOU
      </div>

      <div class="user-marker">

        <div class="user-dot"></div>

      </div>

    </div>

  `,

  iconSize: [70, 70],

  iconAnchor: [35, 35],

});


/*
=========================================================
DISTANCE
=========================================================
*/

function calculateDistance(point1, point2) {

  const R = 6371;

  const lat1 =
    point1[0] * Math.PI / 180;

  const lat2 =
    point2[0] * Math.PI / 180;

  const deltaLat =
    (point2[0] - point1[0]) *
    Math.PI / 180;

  const deltaLon =
    (point2[1] - point1[1]) *
    Math.PI / 180;

  const a =

    Math.sin(deltaLat / 2) *
    Math.sin(deltaLat / 2)

    +

    Math.cos(lat1) *
    Math.cos(lat2) *

    Math.sin(deltaLon / 2) *
    Math.sin(deltaLon / 2);

  const c =

    2 *

    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;

}


/*
=========================================================
MAIN COMPONENT
=========================================================
*/
function StudentMap() {
    const [schedule, setSchedule] = useState(() => {
    try {
      const saved = localStorage.getItem("smartbusSchedule");

      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Schedule error:", error);
    }

    return {};
  });
  const [selectedRoute, setSelectedRoute] =
    useState("20F");

  const [selectedTrip, setSelectedTrip] =
    useState("morning7");

  const [userLocation, setUserLocation] =
    useState(INITIAL_USER_LOCATION);

  const [busLocation, setBusLocation] =
    useState(INITIAL_BUS_LOCATION);

  const [busStatus, setBusStatus] =
    useState("Moving");


  /*
  ========================================================
  REFRESH ADMIN SETTINGS
  ========================================================
  */

  useEffect(() => {

    const refreshSchedule = () => {

      const updated =
        getSavedSchedule();

      setSchedule(updated);

    };


    window.addEventListener(
      "storage",
      refreshSchedule
    );


    const timer =
      setInterval(
        refreshSchedule,
        1000
      );


    return () => {

      window.removeEventListener(
        "storage",
        refreshSchedule
      );

      clearInterval(timer);

    };

  }, []);


  /*
  ========================================================
  ACTIVE ROUTES
  ========================================================
  */

  const activeRoutes = useMemo(() => {

    const tripSchedule =
      schedule[selectedTrip];

    if (!tripSchedule) {

      return Object.keys(REC_ROUTES);

    }

    return Object.keys(REC_ROUTES)
      .filter(
        (route) =>
          tripSchedule[route] !== false
      );

  }, [
    schedule,
    selectedTrip,
  ]);


  /*
  ========================================================
  SELECT FIRST ACTIVE ROUTE
  IF CURRENT ROUTE WAS DISABLED
  ========================================================
  */

  useEffect(() => {

    if (
      activeRoutes.length > 0 &&
      !activeRoutes.includes(selectedRoute)
    ) {

      setSelectedRoute(
        activeRoutes[0]
      );

    }

  }, [
    activeRoutes,
    selectedRoute,
  ]);


  /*
  ========================================================
  ROUTE DATA
  ========================================================
  */

  const route =
    REC_ROUTES[selectedRoute];


  /*
  ========================================================
  BUS MOVEMENT
  ========================================================
  */

  useEffect(() => {

    const timer = setInterval(() => {

      setBusLocation((current) => [

        current[0] - 0.000012,

        current[1] - 0.000018,

      ]);


      setUserLocation((current) => [

        current[0] + 0.000007,

        current[1] + 0.000010,

      ]);


      setBusStatus("Moving");

    }, 2500);


    return () =>
      clearInterval(timer);

  }, []);


  /*
  ========================================================
  DISTANCE
  ========================================================
  */

  const distance = useMemo(() => {

    return calculateDistance(
      userLocation,
      busLocation
    );

  }, [
    userLocation,
    busLocation,
  ]);


  /*
  ========================================================
  ETA
  ========================================================
  */

  const eta = Math.max(
    2,
    Math.round(distance * 3)
  );


  /*
  ========================================================
  CONNECTION LINE
  ========================================================
  */

  const connectionLine = [
    userLocation,
    busLocation,
  ];


  /*
  ========================================================
  ROUTE CHANGE
  ========================================================
  */

  const handleRouteChange = (event) => {

    setSelectedRoute(
      event.target.value
    );

  };


  /*
  ========================================================
  TRIP CHANGE
  ========================================================
  */

  const handleTripChange = (event) => {

    setSelectedTrip(
      event.target.value
    );

  };


  /*
  ========================================================
  RENDER
  ========================================================
  */

  return (

    <section className="student-map-page">


      {/* HEADER */}

      <div className="student-map-header">

        <div>

          <p className="small-heading">
            REC LIVE TRANSPORT
          </p>

          <h1>
            Track Your Bus
          </h1>

          <p className="subtitle">
            Follow your bus and your location in real time.
          </p>

        </div>


        {/* STATUS */}

        <div className="bus-status-card">

          <div className="bus-status-icon">
            🚌
          </div>

          <div>

            <strong>
              ROUTE {selectedRoute}
            </strong>

            <span className="bus-status-text">

              <span className="status-dot"></span>

              {busStatus}

            </span>

          </div>

        </div>

      </div>


      {/* =================================================
          TRIP SELECTOR
      ================================================= */}

      <div className="route-selector-card">

        <div className="route-selector-left">

          <span className="route-selector-icon">
            🕐
          </span>

          <div>

            <span className="info-label">
              BUS TIMING
            </span>

            <strong>
              Select trip
            </strong>

          </div>

        </div>


        <select
          value={selectedTrip}
          onChange={handleTripChange}
          className="route-select"
        >

          {TRIPS.map((trip) => (

            <option
              key={trip.id}
              value={trip.id}
            >

              {trip.label} — {trip.name}

            </option>

          ))}

        </select>

      </div>


      {/* =================================================
          ROUTE SELECTOR
      ================================================= */}

      <div className="route-selector-card">

        <div className="route-selector-left">

          <span className="route-selector-icon">
            🛣️
          </span>

          <div>

            <span className="info-label">
              YOUR REC ROUTE
            </span>

            <strong>
              Select your route
            </strong>

          </div>

        </div>


        <select
          value={selectedRoute}
          onChange={handleRouteChange}
          className="route-select"
          disabled={activeRoutes.length === 0}
        >

          {activeRoutes.map(
            (routeNumber) => (

              <option
                key={routeNumber}
                value={routeNumber}
              >

                {routeNumber} — {
                  REC_ROUTES[routeNumber]
                    .destination
                }

              </option>

            )
          )}

        </select>

      </div>


      {/* =================================================
          NO ROUTES MESSAGE
      ================================================= */}

      {activeRoutes.length === 0 ? (

        <div className="route-stops-card">

          <div className="route-title-row">

            <div>

              <span className="info-label">
                ROUTES
              </span>

              <h2>
                No buses available
              </h2>

            </div>

            <span className="destination-badge">
              ⚠️ Disabled
            </span>

          </div>

          <p className="subtitle">

            The administrator has currently
            disabled all routes for this trip.

          </p>

        </div>

      ) : (

        <>


          {/* ROUTE STOPS */}

          <div className="route-stops-card">

            <div className="route-title-row">

              <div>

                <span className="info-label">
                  ROUTE
                </span>

                <h2>
                  {selectedRoute}
                </h2>

              </div>

              <span className="destination-badge">

                → {route.destination}

              </span>

            </div>


            <div className="stops-list">

              {route.stops.map(
                (stop, index) => (

                  <div
                    className="stop-item"
                    key={`${stop}-${index}`}
                  >

                    <span
                      className={
                        index === 0
                          ? "stop-dot first-stop"
                          : "stop-dot"
                      }
                    ></span>

                    <span className="stop-name">
                      {stop}
                    </span>

                    {index <
                      route.stops.length - 1 && (

                      <span className="stop-line"></span>

                    )}

                  </div>

                )
              )}

            </div>

          </div>


          {/* MAP */}

          <div className="map-card">

            <MapContainer

              center={INITIAL_USER_LOCATION}

              zoom={15}

              scrollWheelZoom={true}

              zoomControl={true}

              className="student-map"

            >

              <TileLayer

                attribution="&copy; OpenStreetMap contributors"

                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

              />


              {/* COLLEGE */}

              <Marker
                position={INITIAL_USER_LOCATION}
              >

                <Popup>

                  <strong>
                    🏫 Rajalakshmi Engineering College
                  </strong>

                  <br />

                  SmartBus starting point

                </Popup>

              </Marker>


              {/* STUDENT */}

              <Marker

                position={userLocation}

                icon={userIcon}

              >

                <Popup>

                  <strong>
                    📍 Your Location
                  </strong>

                  <br />

                  You are here.

                </Popup>

              </Marker>


              {/* BUS */}

              <Marker

                position={busLocation}

                icon={
                  createBusIcon(
                    selectedRoute
                  )
                }

              >

                <Popup>

                  <strong>
                    🚌 ROUTE {selectedRoute}
                  </strong>

                  <br />

                  Destination:
                  {" "}
                  {route.destination}

                  <br />

                  Status:
                  {" "}
                  {busStatus}

                  <br />

                  Distance:
                  {" "}
                  {distance.toFixed(2)}
                  {" "}
                  km

                </Popup>

              </Marker>


              {/* CONNECTION */}

              <Polyline

                positions={connectionLine}

                pathOptions={{

                  color: "#7c3aed",

                  weight: 3,

                  opacity: 0.5,

                  dashArray: "8 8",

                }}

              />

            </MapContainer>


            {/* RECENTER */}

            <button

              className="recenter-button"

              onClick={() =>
                window.location.reload()
              }

              title="Reset map"

            >

              🎯

            </button>

          </div>


          {/* LIVE BUS INFORMATION */}

          <div className="bus-info-card">


            <div className="bus-info-item">

              <span className="info-icon">
                🚌
              </span>

              <div>

                <span className="info-label">
                  ROUTE
                </span>

                <strong>
                  {selectedRoute}
                </strong>

              </div>

            </div>


            <div className="bus-info-item">

              <span className="info-icon">
                🏁
              </span>

              <div>

                <span className="info-label">
                  DESTINATION
                </span>

                <strong>
                  {route.destination}
                </strong>

              </div>

            </div>


            <div className="bus-info-item">

              <span className="info-icon">
                📏
              </span>

              <div>

                <span className="info-label">
                  BUS DISTANCE
                </span>

                <strong>
                  {distance.toFixed(2)}
                  {" "}
                  km
                </strong>

              </div>

            </div>


            <div className="bus-info-item">

              <span className="info-icon">
                ⏱️
              </span>

              <div>

                <span className="info-label">
                  ESTIMATED ARRIVAL
                </span>

                <strong>
                  {eta} min
                </strong>

              </div>

            </div>

          </div>


          {/* LIVE UPDATE */}

          <div className="live-update">

            <span className="live-indicator"></span>

            Live tracking enabled ·

            {" "}

            Route {selectedRoute}

            {" · "}

            {TRIPS.find(
              (trip) =>
                trip.id === selectedTrip
            )?.label}

          </div>

        </>

      )}

    </section>

  );

}


export default StudentMap;