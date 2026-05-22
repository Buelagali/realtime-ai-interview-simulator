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

  const [confidence, setConfidence] = useState(0);
  const [emotion, setEmotion] = useState("Neutral 😐");
  const [isListening, setIsListening] = useState(false);

  // Start Camera
  useEffect(() => {
    startCamera();
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

  // Camera
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

  // Resume Based Questions
  if (lowerResume.includes("python")) {
    questions.push("Explain Python libraries you know");
  }

  if (lowerResume.includes("aws")) {
    questions.push("Explain AWS services used in cloud computing");
  }

  if (lowerResume.includes("react")) {
    questions.push("Explain React Hooks");
  }

  if (lowerResume.includes("cyber") || lowerResume.includes("security")) {
    questions.push("Explain cyber security threats");
  }

  // Speech to Text
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    // Stop previous recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();

    recognitionRef.current = recognition;

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

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

      // Better Confidence Calculation
      const words = transcript.trim().split(/\s+/).filter(Boolean).length;

      let confidenceValue = 0;

      if (words >= 120) {
        confidenceValue = 95;
      } else if (words >= 90) {
        confidenceValue = 85;
      } else if (words >= 60) {
        confidenceValue = 75;
      } else if (words >= 40) {
        confidenceValue = 65;
      } else if (words >= 20) {
        confidenceValue = 50;
      } else if (words >= 8) {
        confidenceValue = 30;
      } else {
        confidenceValue = 10;
      }

      setConfidence(confidenceValue);

      // Emotion Detection
      if (confidenceValue >= 85) {
        setEmotion("Very Confident 😎");
      } else if (confidenceValue >= 65) {
        setEmotion("Confident 😊");
      } else if (confidenceValue >= 40) {
        setEmotion("Focused 🙂");
      } else if (confidenceValue >= 15) {
        setEmotion("Nervous 😐");
      } else {
        setEmotion("Silent 😶");
      }
    };

    recognition.onerror = (event) => {
      console.log("Mic Error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log("Mic Ended");
      setIsListening(false);
    };

    // Auto stop after 45 sec
    setTimeout(() => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }, 300000);
  };

  // Next Question
  const handleNext = () => {
    const updatedAnswers = [...answers, answer];

    setAnswers(updatedAnswers);

    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      setAnswer("");
      setConfidence(0);
      setEmotion("Neutral 😐");
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
            🎭 Expression:
            <strong> {emotion}</strong>
          </p>

          <p>
            Status:
            <strong>
              {" "}
              {confidence > 80
                ? "Excellent"
                : confidence > 60
                ? "Good"
                : confidence > 0
                ? "Average"
                : "No Response"}
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
    minHeight: "600px",
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
    height: "350px", // increased height
    borderRadius: "10px",
    padding: "15px",
    fontSize: "16px",
    marginBottom: "20px",
    resize: "none",
    overflowY: "auto", // scroll enable
    lineHeight: "1.8",
    background: "#f8fafc",
    color: "#000",
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
