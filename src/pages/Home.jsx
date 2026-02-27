import SearchForm from "../components/SearchForm";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* Floating Background Orbs */}
      <div className="orb blue"></div>
      <div className="orb purple"></div>
      <div className="orb pink"></div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div style={{
            animation: "fadeInUp 0.8s ease forwards",
            marginBottom: "40px"
          }}>
            <div style={{
              fontSize: "72px",
              marginBottom: "20px",
              animation: "float 3s ease-in-out infinite"
            }}>
              ✈️
            </div>

            <h1 style={{
              lineHeight: "1.2",
              marginBottom: "20px"
            }}>
              Your Next Adventure
              <br/>
              <span style={{
                background: "linear-gradient(135deg, #38bdf8, #8b5cf6, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                Starts Here
              </span>
            </h1>

            <p style={{
              fontSize: "18px",
              color: "rgba(255, 255, 255, 0.8)",
              maxWidth: "600px",
              margin: "0 auto 50px",
              lineHeight: "1.8"
            }}>
              Plan group trips, conferences & weddings with real-time hotel availability, 
              smart pricing, and seamless coordination for hundreds of guests.
            </p>
          </div>

          {/* Search Form */}
          <div style={{
            maxWidth: "900px",
            margin: "0 auto",
            animation: "fadeInUp 1.2s ease forwards",
            perspective: "1000px"
          }}>
            <SearchForm />
          </div>

          {/* Advanced Search Link */}
          <div style={{
            textAlign: "center",
            marginTop: "20px",
            animation: "fadeInUp 1.3s ease forwards"
          }}>
            <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px", marginBottom: "12px" }}>
              Want advanced filters and better real-time experience?
            </p>
            <button
              onClick={() => navigate("/hotel-search")}
              style={{
                background: "rgba(56, 189, 248, 0.15)",
                border: "1px solid rgba(56, 189, 248, 0.4)",
                color: "#38bdf8",
                padding: "10px 24px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(56, 189, 248, 0.25)";
                e.target.style.borderColor = "#38bdf8";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(56, 189, 248, 0.15)";
              }}
            >
              Try Advanced Hotel Search ✨
            </button>
          </div>

          {/* Feature Pills */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: "50px",
            flexWrap: "wrap",
            animation: "fadeInUp 1.4s ease forwards"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(10px)",
              padding: "12px 24px",
              borderRadius: "50px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "14px",
              fontWeight: "600"
            }}>
              <span>🏨</span> 100+ Hotels
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(10px)",
              padding: "12px 24px",
              borderRadius: "50px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "14px",
              fontWeight: "600"
            }}>
              <span>⚡</span> Real-time Prices
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(10px)",
              padding: "12px 24px",
              borderRadius: "50px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "14px",
              fontWeight: "600"
            }}>
              <span>🚀</span> Best Deals
            </div>
          </div>
        </div>
      </section>

      {/* 🏆 GAMIFICATION HIGHLIGHT SECTION */}
      <section style={{
        background: "linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.15))",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(245, 158, 11, 0.3)",
        borderRadius: "20px",
        padding: "60px 40px",
        textAlign: "center",
        margin: "60px 20px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Animated Background */}
        <div style={{
          position: "absolute",
          top: "-50%",
          right: "-10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(245, 158, 11, 0.2), transparent)",
          borderRadius: "50%",
          filter: "blur(40px)"
        }}></div>
        
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>🏆</div>
          <h2 style={{ 
            marginBottom: "15px",
            background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Earn Rewards & Scale Leaderboards!
          </h2>
          <p style={{
            fontSize: "18px",
            color: "rgba(255, 255, 255, 0.8)",
            marginBottom: "40px",
            maxWidth: "700px",
            margin: "0 auto 40px",
            lineHeight: "1.7"
          }}>
            Compete with other guests, complete exciting challenges, and climb the leaderboards. 
            Earn badges, points, and exclusive rewards as you engage with your group events!
          </p>
          
          {/* Feature Row */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            flexWrap: "wrap",
            marginBottom: "40px"
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>⭐</div>
              <p style={{ color: "rgba(255, 255, 255, 0.8)" }}>Earn Points</p>
              <p style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.6)" }}>Complete activities & challenges</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>🎯</div>
              <p style={{ color: "rgba(255, 255, 255, 0.8)" }}>Daily Challenges</p>
              <p style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.6)" }}>Networking, activities & more</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>👑</div>
              <p style={{ color: "rgba(255, 255, 255, 0.8)" }}>Live Leaderboard</p>
              <p style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.6)" }}>Ranked by engagement</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/gamification")}
            style={{
              padding: "14px 36px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              color: "white",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              transition: "all 0.3s ease",
              boxShadow: "0 8px 20px rgba(245, 158, 11, 0.4)",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 12px 30px rgba(245, 158, 11, 0.6)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(245, 158, 11, 0.4)";
            }}
          >
            <span>🏆</span> Check Leaderboards & Challenges
          </button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container" style={{ marginTop: "100px", marginBottom: "100px" }}>
        <h2 style={{
          textAlign: "center",
          marginBottom: "60px",
          fontSize: "2.5rem"
        }}>
          Why Choose <span style={{
            background: "linear-gradient(135deg, #38bdf8, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>GroupTravel</span>?
        </h2>

        <div className="cards-grid">
          <div className="card-item bounce-in" style={{ animationDelay: "0s" }}>
            <div className="card-icon">🎯</div>
            <h3 className="card-title">Smart Allocation</h3>
            <p className="card-desc">
              Intelligent room allocation for large groups with preference-based matching.
            </p>
          </div>

          <div className="card-item bounce-in" style={{ animationDelay: "0.1s" }}>
            <div className="card-icon">💰</div>
            <h3 className="card-title">Best Rates</h3>
            <p className="card-desc">
              Negotiate bulk discounts and get the best rates for group bookings automatically.
            </p>
          </div>

          <div className="card-item bounce-in" style={{ animationDelay: "0.2s" }}>
            <div className="card-icon">🤝</div>
            <h3 className="card-title">Easy Coordination</h3>
            <p className="card-desc">
              Manage guest preferences, dietary requirements, and special needs seamlessly.
            </p>
          </div>

          <div className="card-item bounce-in" style={{ animationDelay: "0.3s" }}>
            <div className="card-icon">📊</div>
            <h3 className="card-title">Real-time Analytics</h3>
            <p className="card-desc">
              Track bookings, revenue, and guest metrics with beautiful dashboards.
            </p>
          </div>

          <div className="card-item bounce-in" style={{ animationDelay: "0.4s" }}>
            <div className="card-icon">🏆</div>
            <h3 className="card-title">Premium Support</h3>
            <p className="card-desc">
              24/7 dedicated support team to help with any group travel needs.
            </p>
          </div>

          <div className="card-item bounce-in" style={{ animationDelay: "0.5s" }}>
            <div className="card-icon">🌍</div>
            <h3 className="card-title">Global Coverage</h3>
            <p className="card-desc">
              Access to hotels across India with instant availability and booking.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "20px",
        padding: "80px 40px",
        textAlign: "center",
        margin: "100px 20px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ marginBottom: "20px" }}>
            Ready to Plan Your Group?
          </h2>
          <p style={{
            fontSize: "18px",
            color: "rgba(255, 255, 255, 0.8)",
            marginBottom: "40px",
            maxWidth: "600px",
            margin: "0 auto 40px"
          }}>
            Join thousands of event planners and travel agents who trust GroupTravel for seamless group bookings.
          </p>
          <button className="btn-primary" style={{ fontSize: "16px", padding: "18px 40px" }}>
            Start Planning Now
          </button>
        </div>
      </section>
    </>
  );
};

export default Home;
