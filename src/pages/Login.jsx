import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const handleLogin = () => {
    // Name validation
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (name.trim().length < 3) {
      alert("Name must contain at least 3 letters");
      return;
    }

    // Email validation
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      alert("Please enter a valid email");
      return;
    }

    // Success
    alert("Login Successful ✅");

    navigate("/upload", {
      state: {
        name,
        email,
      },
    });
  };

  // Enter key support
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>AI Interview Quantum System</h1>

        <p style={styles.subtitle}>Smart Real-Time Interview Evaluation</p>

        <input
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyPress}
          style={styles.input}
        />

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyPress}
          style={styles.input}
        />

        <button style={styles.button} onClick={handleLogin}>
          Start Interview
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #0f172a, #1e293b)",
    padding: "20px",
  },

  card: {
    background: "white",
    padding: "50px",
    borderRadius: "25px",
    width: "500px",
    textAlign: "center",
    boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
  },

  title: {
    fontSize: "38px",
    color: "#0f172a",
    marginBottom: "15px",
    fontWeight: "bold",
  },

  subtitle: {
    color: "#64748b",
    marginBottom: "35px",
    fontSize: "18px",
  },

  input: {
    width: "100%",
    padding: "18px",
    marginBottom: "20px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "16px",
    boxSizing: "border-box",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "18px",
    background: "#2563eb",
    border: "none",
    borderRadius: "12px",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Login;
