import { useState } from "react";

/**
 * Secure Landing Page
 * - Planner login & signup (full access)
 * - Guests join via secure invite token
 * - No guest signup / no public access
 */
const SecureLanding = () => {
  const [view, setView] = useState(null); // null | plannerLogin | plannerSignup | guest
  const [plannerLoggedIn, setPlannerLoggedIn] = useState(false);
  const [guestVerified, setGuestVerified] = useState(false);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  // In-memory mock DB of planners (for demo only)
  const [planners, setPlanners] = useState([
    { email: "planner@event.com", password: "planner123", name: "Default Planner", type: "Company" },
  ]);

  const VALID_GUEST_TOKENS = ["WED-2026-A1", "WED-2026-B2"];
  const [signupType, setSignupType] = useState("Individual"); // default type for signup

  /* ---- HANDLERS ---- */
  const handlePlannerLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const user = planners.find((p) => p.email === email && p.password === password);
    if (user) {
      setPlannerLoggedIn(true);
      setError("");
    } else {
      setError("Invalid planner credentials");
    }
  };

  const handlePlannerSignup = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const name = e.target.name.value;
    const contact = e.target.contact.value;
    const gst = e.target.gst?.value;
    const govtId = e.target.govtId?.files?.[0];

    if (planners.find((p) => p.email === email)) {
      setError("Planner already exists with this email");
      return;
    }

    // Add new planner to in-memory DB
    setPlanners([...planners, { email, password, name, type: signupType, contact, gst, govtId }]);
    setPlannerLoggedIn(true); // auto-login after signup
    setError("");
  };

  const verifyGuest = () => {
    if (VALID_GUEST_TOKENS.includes(token.trim())) {
      setGuestVerified(true);
      setError("");
    } else {
      setError("Invalid or expired invite code");
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* LANDING */}
      {!view && (
        <div style={styles.card}>
          <h1>Wedding Event Portal</h1>
          <p>Private access for planners & invited guests</p>

          <div style={styles.row}>
            <button style={styles.button} onClick={() => setView("plannerLogin")}>
              Planner Login
            </button>
            <button style={styles.button} onClick={() => setView("plannerSignup")}>
              Planner Signup
            </button>
            <button style={styles.button} onClick={() => setView("guest")}>
              Guest Access
            </button>
          </div>
        </div>
      )}

      {/* PLANNER LOGIN */}
      {view === "plannerLogin" && !plannerLoggedIn && (
        <div style={styles.card}>
          <h2>Planner Login</h2>
          <form
            onSubmit={handlePlannerLogin}
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <input name="email" placeholder="Email" required style={styles.input} />
            <input name="password" type="password" placeholder="Password" required style={styles.input} />
            <button type="submit" style={styles.button}>Login</button>
          </form>
          <p style={{ marginTop: 8 }}>
            New?{" "}
            <span
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => { setView("plannerSignup"); setError(""); }}
            >
              Sign up here
            </span>
          </p>
          {error && <p style={styles.error}>{error}</p>}
        </div>
      )}

      {/* PLANNER SIGNUP */}
      {view === "plannerSignup" && !plannerLoggedIn && (
        <div style={styles.card}>
          <h2>Planner Signup</h2>
          <form
            onSubmit={handlePlannerSignup}
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <input name="name" placeholder="Full Name" required style={styles.input} />
            <input name="email" placeholder="Email" required style={styles.input} />
            <input name="password" type="password" placeholder="Password" required style={styles.input} />
            <input name="contact" placeholder="Contact Number" required style={styles.input} />

            <label>
              Planner Type:
              <select
                value={signupType}
                onChange={(e) => setSignupType(e.target.value)}
                style={{ ...styles.input, 
                  padding: "6px 12px",
                  background: "rgba(255,255,255,0.05)", // darkish background
                  color: "white", // text color
                  border: "1px solid white",
                  borderRadius: 6,
                  appearance: "none", // removes default arrow styling on some browsers
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                }}
              >
                <option value="Individual" style={{ background: "#0f172a", color: "white" }}>Individual</option>
                <option value="Company"style={{ background: "#0f172a", color: "white" }}>Company</option>
                <option value="Agency"style={{ background: "#0f172a", color: "white" }}>Agency</option>
              </select> 
            </label>

            {/* Conditional fields */}
            {signupType === "Company" && (
              <input name="gst" placeholder="GST Number" style={styles.input} />
            )}
            {signupType === "Individual" && (
              <input type="file" name="govtId" accept="image/*,.pdf" style={styles.input} />
            )}

            <button type="submit" style={styles.button}>Sign Up</button>
          </form>
          <p style={{ marginTop: 8 }}>
            Already have an account?{" "}
            <span
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => { setView("plannerLogin"); setError(""); }}
            >
              Login here
            </span>
          </p>
          {error && <p style={styles.error}>{error}</p>}
        </div>
      )}

      {/* PLANNER DASHBOARD */}
      {plannerLoggedIn && (
        <div style={styles.card}>
          <h2>Planner Dashboard</h2>
          <ul style={{ textAlign: "left", paddingLeft: "20px" }}>
            <li>Create & manage events</li>
            <li>Add hotels & logistics</li>
            <li>Generate guest invite links</li>
            <li>View reports</li>
          </ul>

          <div style={styles.tokenBox}>
            Sample Guest Invite Code: <strong>WED-2026-A1</strong>
          </div>
        </div>
      )}

      {/* GUEST VERIFICATION */}
      {view === "guest" && !guestVerified && (
        <div style={styles.card}>
          <h2>Guest Verification</h2>
          <p>Enter your invite code</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "12px" }}>
            <input
              placeholder="Invite Code"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              style={styles.input}
            />
            <button style={styles.button} onClick={verifyGuest}>
              Verify
            </button>
          </div>
          {error && <p style={styles.error}>{error}</p>}
        </div>
      )}

      {/* GUEST VIEW */}
      {guestVerified && (
        <div style={styles.card}>
          <h2>💍 Wedding Details</h2>
          <p><b>Couple:</b> Rohan & Meera</p>
          <p><b>Date:</b> 12 March 2026</p>
          <p><b>Venue:</b> Udaipur Palace</p>
          <p><b>Hotel:</b> Taj Lake Palace</p>
          <p style={{ opacity: 0.7 }}>Read-only access · Secure event view</p>
        </div>
      )}
    </div>
  );
};

export default SecureLanding;

/* ---- STYLES ---- */
const styles = {
  wrapper: {
    minHeight: "calc(100vh - 80px)",
    background: "linear-gradient(135deg,#020617,#0f172a)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    padding: "20px",
    textAlign: "center",
    color: "white",
    fontFamily: "Inter, sans-serif",
  },
  card: {
    width: 500,
    maxWidth: "90%",
    padding: 32,
    borderRadius: 14,
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(14px)",
    boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
    textAlign: "center",
    marginBottom: "20px",
  },
  row: {
    display: "flex",
    justifyContent: "center",
    gap: 16,
    marginTop: 24,
  },
  button: {
    padding: "10px 18px",
    borderRadius: 6,
    border: "1px solid white",
    background: "transparent",
    color: "white",
    cursor: "pointer",
    fontWeight: 500,
    transition: "all 0.2s",
  },
  input: {
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid white",
    background: "rgba(255,255,255,0.05)",
    color: "white",
    outline: "none",
    flex: 1,
  },
  tokenBox: {
    marginTop: 16,
    padding: 12,
    background: "rgba(255,255,255,0.12)",
    borderRadius: 8,
  },
  error: {
    color: "#ff6b6b", 
    marginTop: 8,
  },
};
