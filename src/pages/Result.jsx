import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";

function Result() {
  const location = useLocation();

  const answers = location.state?.answers || [];
  const questions = location.state?.questions || [];
  const jobRole = location.state?.jobRole || "Not Selected";

  const combinedAnswer = answers.join(" ").toLowerCase();

  // Role Keywords
  const keywords = {
    "Software Developer": [
      "react",
      "javascript",
      "frontend",
      "backend",
      "oop",
      "database",
      "python",
    ],

    "Cyber Security Analyst": [
      "security",
      "phishing",
      "encryption",
      "aes",
      "des",
      "network",
    ],

    "Cloud Engineer": ["cloud", "aws", "virtualization", "saas", "paas"],

    "AI/ML Engineer": [
      "machine learning",
      "ai",
      "deep learning",
      "nlp",
      "python",
    ],

    "Data Analyst": ["excel", "data", "analytics", "visualization", "sql"],
  };

  // Question-wise expected answers
  const expectedAnswers = {
    "What is React?": ["javascript", "library", "ui", "component"],

    "Explain OOP concepts": [
      "inheritance",
      "polymorphism",
      "encapsulation",
      "abstraction",
    ],

    "Difference between frontend and backend?": [
      "frontend",
      "backend",
      "server",
      "client",
    ],

    "What is cloud computing?": ["internet", "storage", "server", "cloud"],

    "What is cyber security?": ["security", "attack", "protection", "network"],

    "What is Artificial Intelligence?": [
      "machine",
      "human intelligence",
      "automation",
      "learning",
    ],
  };

  const selectedKeywords = keywords[jobRole] || [];

  // Keyword matching
  let matchedKeywords = 0;

  selectedKeywords.forEach((keyword) => {
    if (combinedAnswer.includes(keyword)) {
      matchedKeywords++;
    }
  });

  // Remove empty answers
  const validAnswers = answers.filter(
    (ans) => ans && ans.trim() !== "" && ans.trim().length > 10
  );

  // Real Answer Validation
  let validAnswerScore = 0;

  questions.forEach((question, index) => {
    const userAnswer = answers[index]?.toLowerCase() || "";

    const expectedKeywords = expectedAnswers[question] || [];

    let matched = 0;

    expectedKeywords.forEach((word) => {
      if (userAnswer.includes(word)) {
        matched++;
      }
    });

    if (expectedKeywords.length > 0) {
      validAnswerScore += (matched / expectedKeywords.length) * 20;
    }
  });

  // Smart Score
  let score = 0;

  if (validAnswers.length === 0 || combinedAnswer.trim() === "") {
    score = 0;
  } else {
    score = matchedKeywords * 10 + validAnswerScore + validAnswers.length * 2;

    if (score > 100) {
      score = 100;
    }
  }

  // Communication
  const communicationScore =
    score > 80 ? 90 : score > 60 ? 75 : score > 0 ? 50 : 0;

  // Technical
  const technicalScore = score > 80 ? 90 : score > 60 ? 75 : score > 0 ? 45 : 0;

  // Confidence
  const confidenceScore =
    validAnswers.length >= 5 ? 85 : validAnswers.length > 0 ? 60 : 0;

  // Recommendation
  const recommendation =
    score > 80
      ? "Highly Recommended"
      : score > 60
      ? "Recommended"
      : score > 0
      ? "Needs Improvement"
      : "No Interview Response";

  // Strengths
  const strengths = [];

  if (technicalScore >= 70) {
    strengths.push("Strong technical understanding");
  }

  if (communicationScore >= 70) {
    strengths.push("Good communication skills");
  }

  if (confidenceScore >= 70) {
    strengths.push("Confident answering");
  }

  // Weaknesses
  const weaknesses = [];

  if (technicalScore < 70) {
    weaknesses.push("Need more technical depth");
  }

  if (communicationScore < 70) {
    weaknesses.push("Improve communication");
  }

  if (confidenceScore < 70) {
    weaknesses.push("Need more confidence");
  }

  // PDF Download
  const downloadReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("AI Interview Evaluation Report", 20, 20);

    doc.setFontSize(12);

    doc.text(`Job Role: ${jobRole}`, 20, 40);

    doc.text(`Overall Score: ${score}%`, 20, 50);

    doc.text(`Communication: ${communicationScore}%`, 20, 60);

    doc.text(`Technical: ${technicalScore}%`, 20, 70);

    doc.text(`Confidence: ${confidenceScore}%`, 20, 80);

    doc.text(`Recommendation: ${recommendation}`, 20, 90);

    doc.save("AI_Interview_Report.pdf");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>AI Interview Result</h1>

        <h2>{jobRole}</h2>

        <div style={styles.scoreBox}>
          <h3>Overall Score</h3>

          <h1 style={styles.score}>{score}%</h1>
        </div>

        <div style={styles.feedback}>
          <p>
            🗣 Communication:
            {communicationScore}%
          </p>

          <p>
            💻 Technical:
            {technicalScore}%
          </p>

          <p>
            🎯 Confidence:
            {confidenceScore}%
          </p>

          <p>
            🚀 Recommendation:
            {recommendation}
          </p>
        </div>

        <div style={styles.skillSection}>
          <h3>Skill Analysis</h3>

          {[
            {
              label: "Communication",
              score: communicationScore,
            },
            {
              label: "Technical Skills",
              score: technicalScore,
            },
            {
              label: "Confidence",
              score: confidenceScore,
            },
          ].map((item, index) => (
            <div key={index} style={styles.skillItem}>
              <div style={styles.skillHeader}>
                <span>{item.label}</span>

                <span>{item.score}%</span>
              </div>

              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${item.score}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div style={styles.listBox}>
          <h3>Strengths</h3>

          {strengths.length > 0 ? (
            strengths.map((s, index) => <p key={index}>✅ {s}</p>)
          ) : (
            <p>No strengths detected</p>
          )}

          <h3>Weaknesses</h3>

          {weaknesses.map((w, index) => (
            <p key={index}>⚠ {w}</p>
          ))}
        </div>

        <button style={styles.button} onClick={downloadReport}>
          Download PDF Report
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #0f172a, #1e293b)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },

  card: {
    background: "white",
    padding: "40px",
    borderRadius: "20px",
    width: "700px",
  },

  title: {
    textAlign: "center",
  },

  scoreBox: {
    textAlign: "center",
    background: "#dbeafe",
    padding: "20px",
    borderRadius: "20px",
    marginBottom: "20px",
  },

  score: {
    fontSize: "50px",
    color: "#2563eb",
  },

  feedback: {
    marginBottom: "20px",
  },

  skillSection: {
    marginTop: "30px",
    marginBottom: "30px",
  },

  skillItem: {
    marginBottom: "20px",
  },

  skillHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontWeight: "bold",
  },

  progressBar: {
    width: "100%",
    height: "14px",
    background: "#e2e8f0",
    borderRadius: "20px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: "#2563eb",
    borderRadius: "20px",
    transition: "0.5s",
  },

  listBox: {
    marginTop: "20px",
    marginBottom: "20px",
  },

  button: {
    width: "100%",
    padding: "15px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Result;
