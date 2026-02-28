const Reports = () => {
  return (
    <div className="container fade-in" style={{ marginTop: "60px" }}>
      <h1>📊 Group Travel Reports</h1>

      <div className="glass-card" style={{ marginTop: "24px" }}>
        <h3>Total Group Bookings</h3>
        <p>12</p>
      </div>

      <div className="glass-card" style={{ marginTop: "24px" }}>
        <h3>Active Groups</h3>
        <p>5</p>
      </div>

      <div className="glass-card" style={{ marginTop: "24px" }}>
        <h3>Total Revenue</h3>
        <p>₹ 3,45,000</p>
      </div>

      <div className="glass-card" style={{ marginTop: "24px" }}>
        <h3>Most Booked Destination</h3>
        <p>Gangtok</p>
      </div>
    </div>
  );
};

export default Reports;
