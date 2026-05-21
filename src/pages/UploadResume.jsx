import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { extractTextFromPDF } from "../utils/resumeParser";

function UploadResume() {
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);

  const [jobRole, setJobRole] = useState("");

  const handleContinue = async () => {
    if (!resume) {
      alert("Please upload resume");
      return;
    }

    if (!jobRole) {
      alert("Please select job role");
      return;
    }

    try {
      let resumeText = "";

      // Only PDF parsing
      if (resume.type === "application/pdf") {
        resumeText = await extractTextFromPDF(resume);
      }

      navigate("/interview", {
        state: {
          jobRole,
          resumeText,
        },
      });
    } catch (error) {
      console.log("Resume parsing error:", error);

      // still continue
      navigate("/interview", {
        state: {
          jobRole,
          resumeText: "",
        },
      });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Upload Resume</h1>

        <p style={styles.subtitle}>Upload your resume and select job role</p>

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          style={styles.input}
          onChange={(e) => setResume(e.target.files[0])}
        />

        {resume && (
          <p style={styles.resumeText}>
            Selected Resume:
            <strong> {resume.name}</strong>
          </p>
        )}

        <select
          style={styles.select}
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
        >
          <option value="">Select Job Role</option>

          <option>Software Developer</option>

          <option>Data Analyst</option>

          <option>Cyber Security Analyst</option>

          <option>Cloud Engineer</option>

          <option>AI/ML Engineer</option>
        </select>

        <button style={styles.button} onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #0f172a, #1e293b)",
  },

  card: {
    background: "white",
    padding: "40px",
    borderRadius: "20px",
    width: "420px",
    textAlign: "center",
    boxShadow: "0px 5px 20px rgba(0,0,0,0.3)",
  },

  title: {
    color: "#0f172a",
    marginBottom: "10px",
  },

  subtitle: {
    color: "gray",
    marginBottom: "20px",
  },

  input: {
    width: "100%",
    marginBottom: "20px",
  },

  resumeText: {
    color: "#0f172a",
    marginBottom: "20px",
  },

  select: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "16px",
  },

  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default UploadResume;
