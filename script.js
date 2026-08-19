const setupForm = document.getElementById("setupForm");

let trackingInterval;

setupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const studentName =
        document.getElementById("studentName").value.trim();

    const busNumber =
        document.getElementById("busNumber").value.trim();

    const busStop =
        document.getElementById("busStop").value;

    showDashboard(studentName, busNumber, busStop);
});


function showDashboard(studentName, busNumber, busStop) {

    const app = document.querySelector(".app");

    app.innerHTML = `
        <div class="dashboard">

            <div class="dashboard-header">
                <p class="welcome-small">Welcome back 👋</p>

                <h1>Hi, ${studentName} 👋</h1>

                <p class="dashboard-subtitle">
                    Your SmartBus is being tracked
                </p>
            </div>


            <div class="bus-card">

                <div>
                    <p class="card-label">Your Bus</p>

                    <h2>🚌 ${busNumber}</h2>
                </div>

                <div class="live-status">
                    <span class="status-dot"></span>
                    <span id="liveStatus">LIVE</span>
                </div>

            </div>


            <div class="location-card">

                <div class="card-icon">
                    📍
                </div>

                <div>
                    <p class="card-label">Location Status</p>

                    <h3 id="locationStatus">
                        Bus is inside campus
                    </h3>
                </div>

            </div>


            <div class="info-grid">

                <div class="info-card">

                    <div class="info-icon">
                        🚌
                    </div>

                    <p class="card-label">
                        Distance
                    </p>

                    <h2 id="distanceValue">
                        320 m
                    </h2>

                    <p class="info-description">
                        Bus → You
                    </p>

                </div>


                <div class="info-card">

                    <div class="info-icon">
                        ⏱️
                    </div>

                    <p class="card-label">
                        Estimated Arrival
                    </p>

                    <h2 id="etaValue">
                        2 min
                    </h2>

                    <p class="info-description">
                        Bus arrival
                    </p>

                </div>


                <div class="info-card">

                    <div class="info-icon">
                        🚶
                    </div>

                    <p class="card-label">
                        Walking Time
                    </p>

                    <h2 id="walkingTimeValue">
                        3 min
                    </h2>

                    <p class="info-description">
                        You → Bus
                    </p>

                </div>

            </div>

            <div class="stop-card">

                <div class="stop-icon">
                    📍
                </div>

                <div>
                    <p class="card-label">
                        Your Stop
                    </p>

                    <h3>${busStop}</h3>
                </div>

            </div>


            <div class="map-section">

                <div class="map-title">
                    <h3>🗺️ Live Campus Map</h3>
                    <p>Bus location and your stop</p>
                </div>

                <div id="map"></div>

            </div>

        </div>
    `;

    startSimulatedTracking();
    initializeMap();
}


function startSimulatedTracking() {

    // Starting distance
    let distance = 320;

    // Update every 5 seconds
    trackingInterval = setInterval(function () {

        // Bus moves 20 meters closer
        distance -= 20;

        if (distance <= 0) {
            distance = 0;
        }

        updateTrackingDisplay(distance);

        // Stop simulation when bus reaches the student
        if (distance === 0) {
            clearInterval(trackingInterval);
        }

    }, 5000);
}


function updateTrackingDisplay(distance) {

    const distanceElement =
        document.getElementById("distanceValue");

    const etaElement =
        document.getElementById("etaValue");

    const locationElement =
        document.getElementById("locationStatus");

    const liveStatusElement =
        document.getElementById("liveStatus");


    if (!distanceElement ||
        !etaElement ||
        !locationElement ||
        !liveStatusElement) {
        return;
    }


    // Update distance
    distanceElement.textContent = distance + " m";


    // Calculate approximate ETA
    const eta = Math.ceil(distance / 160);

    if (distance === 0) {

        etaElement.textContent = "Arrived";

        locationElement.textContent =
            "Bus has reached your stop";

        liveStatusElement.textContent =
            "ARRIVED";

    } else {

        etaElement.textContent = eta + " min";

        locationElement.textContent =
            "Bus is approaching your stop";

        liveStatusElement.textContent =
            "LIVE";
    }
}

function initializeMap() {

    const map = L.map("map").setView(
        [13.0827, 80.2707],
        13
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);


    // Student location
    const studentLocation = [13.0827, 80.2707];

    L.marker(studentLocation)
        .addTo(map)
        .bindPopup("📍 Your Location")
        .openPopup();


    // Simulated bus location
    const busLocation = [13.0850, 80.2730];

    L.marker(busLocation)
        .addTo(map)
        .bindPopup("🚌 REC-42");


    // Draw line between bus and student
    L.polyline(
        [busLocation, studentLocation],
        {
            color: "#382e6a",
            weight: 4
        }
    ).addTo(map);
}