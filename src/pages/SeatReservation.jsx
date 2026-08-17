import { useState } from "react";
import "./SeatReservation.css";

function SeatReservation() {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [reserved, setReserved] = useState(false);

  // GIRLS - 5 rows
  const girlsRows = [
    ["G01", "G02", "G03", "G04", "G05"],
    ["G06", "G07", "G08", "G09", "G10"],
    ["G11", "G12", "G13", "G14", "G15"],
    ["G16", "G17", "G18", "G19", "G20"],
    ["G21", "G22", "G23", "G24", "G25"],
  ];

  // BOYS - 5 rows
  const boysRows = [
    ["B01", "B02", "B03", "B04", "B05"],
    ["B06", "B07", "B08", "B09", "B10"],
    ["B11", "B12", "B13", "B14", "B15"],
    ["B16", "B17", "B18", "B19", "B20"],
    ["B21", "B22", "B23", "B24", "B25"],
  ];

  // LAST ROW - 6 BOYS
  const lastRow = [
    "B26",
    "B27",
    "B28",
    "B29",
    "B30",
    "B31",
  ];

  // Example booked seats
  const bookedSeats = [
    "G04",
    "G13",
    "G21",
    "B03",
    "B14",
    "B22",
    "B29",
  ];

  const handleSeatClick = (seat) => {
    if (bookedSeats.includes(seat)) return;

    setSelectedSeat(seat);
    setReserved(false);
  };

  const getSeatClass = (seat) => {
    if (bookedSeats.includes(seat)) {
      return "seat booked";
    }

    if (selectedSeat === seat) {
      return "seat selected";
    }

    return "seat available";
  };

  // Individual seat
  const Seat = ({ seat }) => (
    <button
      className={getSeatClass(seat)}
      disabled={bookedSeats.includes(seat)}
      onClick={() => handleSeatClick(seat)}
    >
      <span className="seat-back"></span>

      <span className="seat-cushion">
        {seat}
      </span>
    </button>
  );

  // Normal row:
  // 2 seats | PATHWAY | 3 seats
  const renderRow = (row, index) => (
    <div className="seat-row" key={index}>

      <div className="two-seater">
        <Seat seat={row[0]} />
        <Seat seat={row[1]} />
      </div>

      <div className="pathway"></div>

      <div className="three-seater">
        <Seat seat={row[2]} />
        <Seat seat={row[3]} />
        <Seat seat={row[4]} />
      </div>

    </div>
  );

  const reserveSeat = () => {
    if (selectedSeat) {
      setReserved(true);
    }
  };

  return (
    <div className="reservation-page">

      {/* HEADER */}
      <header className="top-bar">

        <div>
          <h1>SmartBus</h1>
          <p>College Transport</p>
        </div>

        <div className="bus-info">
          <strong>BUS 101</strong>
          <span>College → Campus</span>
        </div>

      </header>


      <main className="main-content">

        {/* BUS */}
        <section className="bus-section">

          <h2>Select Your Seat</h2>

          <p className="instruction">
            Choose an available seat from the bus layout
          </p>

          <div className="bus">

            {/* DRIVER */}
            <div className="driver-area">
              <div className="steering-wheel">◉</div>
              <span>DRIVER</span>
            </div>


            {/* GIRLS */}
            <div className="gender-title girls-title">
              GIRLS
            </div>

            <div className="girls-section">
              {girlsRows.map((row, index) =>
                renderRow(row, `girls-${index}`)
              )}
            </div>


            {/* BOYS DIVIDER */}
            <div className="gender-divider">
              <span>BOYS</span>
            </div>


            {/* BOYS */}
            <div className="boys-section">
              {boysRows.map((row, index) =>
                renderRow(row, `boys-${index}`)
              )}
            </div>


            {/* LAST ROW */}
            <div className="last-row-title">
              LAST ROW — BOYS
            </div>

            <div className="last-row">
              {lastRow.map((seat) => (
                <Seat key={seat} seat={seat} />
              ))}
            </div>


            {/* BACK */}
            <div className="back-area">
              BACK OF BUS
            </div>

          </div>


          {/* LEGEND */}
          <div className="legend">

            <div>
              <span className="legend-box available"></span>
              Available
            </div>

            <div>
              <span className="legend-box selected"></span>
              Selected
            </div>

            <div>
              <span className="legend-box booked"></span>
              Booked
            </div>

          </div>

        </section>


        {/* BOOKING PANEL */}
        <section className="booking-panel">

          <h2>Trip Details</h2>

          <div className="trip-card">
            <span>BUS</span>
            <strong>101</strong>
          </div>

          <div className="trip-details">

            <p>
              <strong>Route</strong>
              <br />
              College → Campus
            </p>

            <p>
              <strong>Departure</strong>
              <br />
              5:30 PM
            </p>

          </div>

          <hr />

          <h3>Selected Seat</h3>

          <div className="selected-display">
            {selectedSeat || "No seat selected"}
          </div>

          {reserved && (
            <div className="confirmation">
              ✓ Seat {selectedSeat} reserved successfully!
            </div>
          )}

          <button
            className="reserve-button"
            disabled={!selectedSeat || reserved}
            onClick={reserveSeat}
          >
            {reserved ? "RESERVED" : "RESERVE SEAT"}
          </button>

        </section>

      </main>

    </div>
  );
}

export default SeatReservation;