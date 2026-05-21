import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

function Interview() {
  const navigate = useNavigate();
  const location = useLocation();

  const jobRole = location.state?.jobRole || "";
  const resumeText = location.state?.resumeText || "";

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);

  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [confidence, setConfidence] = useState(75);
  const [isListening, setIsListening] = useState(false);

  // Start Camera
  useEffect(() => {
    startCamera();
  }, []);

  // Confidence simulation
  useEffect(() => {
    const confidenceTimer = setInterval(() => {
      const randomScore = Math.floor(Math.random() * 21) + 70;

      setConfidence(randomScore);
    }, 3000);

    return () => clearInterval(confidenceTimer);
  }, []);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      navigate("/result", {
        state: {
          answers,
          questions,
          jobRole,
        },
      });

      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Start Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.log("Camera Error:", error);
    }
  };

  // Speech to Text
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    // Stop previous mic
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();

    recognitionRef.current = recognition;

    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;

    setAnswer("");
    setIsListening(true);

    recognition.start();

    recognition.onstart = () => {
      console.log("Mic Started");
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }

      setAnswer(transcript);
    };

    recognition.onerror = (event) => {
      console.log("Mic Error:", event.error);

      setIsListening(false);
    };

    recognition.onend = () => {
      console.log("Mic Ended");

      setIsListening(false);
    };

    // Auto stop after 15 sec
    setTimeout(() => {
      recognition.stop();
    }, 15000);
  };

  // Questions
  const roleQuestions = {
    "Software Developer": [
      "Tell me about yourself",
      "Explain OOP concepts",
      "What is React?",
      "Difference between frontend and backend?",
      "Explain your final year project",
    ],

    "Cyber Security Analyst": [
      "What is cyber security?",
      "What is phishing?",
      "Difference between AES and DES?",
      "Explain network security",
      "Tell me about your project",
    ],

    "Cloud Engineer": [
      "What is cloud computing?",
      "Difference between SaaS and PaaS?",
      "What is AWS?",
      "Explain virtualization",
      "Why cloud security matters?",
    ],

    "AI/ML Engineer": [
      "What is Artificial Intelligence?",
      "Difference between AI and ML?",
      "What is deep learning?",
      "Explain NLP",
      "Tell me about your AI project",
    ],

    "Data Analyst": [
      "What is data analysis?",
      "Explain Excel usage",
      "Difference between data and information?",
      "What is data visualization?",
      "Tell me about analytics",
    ],
  };

  let questions = [...(roleQuestions[jobRole] || ["Tell me about yourself"])];

  const lowerResume = resumeText.toLowerCase();

  // Resume Questions
  if (lowerResume.includes("python")) {
    questions.push("Explain Python libraries you know");
  }

  if (lowerResume.includes("aws")) {
    questions.push("Explain AWS services used in cloud computing");
  }

  if (lowerResume.includes("react")) {
    questions.push("Explain React hooks");
  }

  if (lowerResume.includes("cyber") || lowerResume.includes("security")) {
    questions.push("Explain cyber security threats");
  }

  // Next Question
  const handleNext = () => {
    const updatedAnswers = [...answers, answer];

    setAnswers(updatedAnswers);

    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);

      setAnswer("");
    } else {
      navigate("/result", {
        state: {
          answers: updatedAnswers,
          questions,
          jobRole,
        },
      });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>AI Interview Session</h1>

        <div style={styles.timer}>
          ⏱ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
        </div>
      </div>

      <div style={styles.roleBox}>
        Selected Role:
        <strong> {jobRole}</strong>
      </div>

      <div style={styles.content}>
        <div style={styles.questionCard}>
          <h2>Interview Question</h2>

          <p style={styles.question}>{questions[questionIndex]}</p>

          <textarea
            placeholder="Your answer will appear here..."
            style={styles.textarea}
            value={answer}
            readOnly
          />

          <button style={styles.micButton} onClick={startListening}>
            {isListening ? "🎙 Listening..." : "🎤 Start Speaking"}
          </button>
        </div>

        <div style={styles.cameraCard}>
          <h2>Camera Preview</h2>

          <div style={styles.cameraBox}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={styles.video}
            />
          </div>

          <p>
            🙂 Confidence:
            <strong> {confidence}%</strong>
          </p>

          <p>
            Status:
            <strong>
              {" "}
              {confidence > 80
                ? "Excellent"
                : confidence > 70
                ? "Good"
                : "Average"}
            </strong>
          </p>
        </div>
      </div>

      <button style={styles.nextButton} onClick={handleNext}>
        {questionIndex === questions.length - 1
          ? "Finish Interview"
          : "Next Question"}
      </button>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    padding: "30px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  timer: {
    background: "#2563eb",
    padding: "10px 20px",
    borderRadius: "10px",
  },

  roleBox: {
    background: "#1e293b",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
  },

  content: {
    display: "flex",
    gap: "30px",
    flexWrap: "wrap",
  },

  questionCard: {
    flex: 1,
    background: "#1e293b",
    padding: "30px",
    borderRadius: "20px",
  },

  cameraCard: {
    width: "350px",
    background: "#1e293b",
    padding: "30px",
    borderRadius: "20px",
    textAlign: "center",
  },

  question: {
    fontSize: "20px",
    marginBottom: "20px",
  },

  textarea: {
    width: "100%",
    height: "150px",
    borderRadius: "10px",
    padding: "15px",
    fontSize: "16px",
    marginBottom: "20px",
  },

  micButton: {
    padding: "12px 20px",
    background: "#22c55e",
    border: "none",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
  },

  cameraBox: {
    height: "250px",
    background: "#334155",
    borderRadius: "15px",
    overflow: "hidden",
    marginBottom: "20px",
  },

  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  nextButton: {
    marginTop: "30px",
    padding: "15px 30px",
    background: "#2563eb",
    border: "none",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Interview;
