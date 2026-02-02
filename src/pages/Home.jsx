import SearchForm from "../components/SearchForm";

const Home = () => {
  return (
    <>
      <div className="orb blue"></div>
<div className="orb purple"></div>

      <section className="container fade-in" style={{ marginTop: "90px" }}>
        <h1 style={{
          fontSize: "54px",
          fontWeight: "700",
          lineHeight: "1.1",
          maxWidth: "800px"
        }}>
          Smart{" "}
          <span style={{
            background: "linear-gradient(90deg, #38bdf8, #2563eb)",
            WebkitBackgroundClip: "text",
            color: "transparent"
          }}>
            Group Hotel
          </span>{" "}
          Booking
        </h1>

        <p style={{
          marginTop: "18px",
          maxWidth: "650px",
          color: "#c7d2fe",
          fontSize: "18px"
        }}>
          Plan weddings, conferences & large group trips with real-time hotel availability,
          pricing, and intelligent allocation.
        </p>

        <div style={{ marginTop: "50px" }}>
          <SearchForm />
        </div>
      </section>
    </>
  );
};

export default Home;
