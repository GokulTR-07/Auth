import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaMicrophoneAlt } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { MdArrowBack } from "react-icons/md";
import { FaRobot } from "react-icons/fa6";
import BotProductList from "./BotProductList";
import SalesExecutive from "../../assets/gif/Animation - 1723113918679.gif";
import Client from "../../assets/gif/Animation - 1723117354452.gif"
import { userContext } from "../../context/UserContext";

const useCaseQuestions = {
  gender: {
    question: "To get started, could you please tell me your gender? This will help us tailor our recommendations to you. (e.g., Male, Female). If you prefer to specify, type your gender below",
    type: "text",
    name: "gender",
    options: ["Male", "Female" ],
  },
  recommendation: {
    question:
      "Type your use case: 1. Culinary Uses, 2. Cosmetic Uses, 3. Medicinal Uses, 4. Pregnant Woman Uses. You can select by typing their numbers (e.g., 1)",
    type: "text",
    name: "useCases",
  },
  culinary: [
    {
      type: "text",
      question: "What type of cuisine do you usually cook?",
      name: "cuisine",
      options: ["Indian", "Mexican", "Chinese", "others"],
    },
    {
      type: "select",
      question: "What types of dishes do you like to cook with saffron?",
      name: "dishes",
      options: ["Desserts", "Main Courses", "Appetizers", "Beverages", "Other"],
    },
    {
      type: "text",
      question: "Do you prefer mild or strong flavors in your dishes?",
      name: "flavor",
      options: ["Mild", "Strong", "Other"],
    },
    {
      type: "select",
      question: "Are you looking for recipes with specific health benefits?",
      name: "healthBenefits",
      options: [
        "Antioxidant-rich",
        "Anti-inflammatory",
        "Digestive health",
        "Other",
      ],
    },
    {
      type: "select",
      question:
        "Do you have any specific health conditions that influence your diet?",
      name: "healthConditions",
      options: ["Diabetes", "High blood pressure", "Heart conditions", "Other"],
    },
    {
      type: "text",
      question:
        "Would you like to learn new cooking techniques involving saffron?",
      name: "learnTechniques",
      options: ["Yes", "No"],
    },
  ],
  medicinal: [
    {
      type: "text",
      question: "Are you currently taking any medications or supplements?",
      name: "medications",
      options: ["Yes", "No"],
    },
    {
      type: "select",
      question:
        "What primary benefits are you seeking from using saffron medicinally?",
      name: "benefits",
      options: [
        "Improved mood",
        "Better sleep",
        "Pain relief",
        "Enhanced digestion",
        "Reduced inflammation",
        "Other (please specify)",
      ],
    },
    {
      type: "select",
      question:
        "Have you consulted your healthcare provider about using saffron for medicinal purposes?",
      name: "consultedProvider",
      options: ["Yes", "No"],
    },
    {
      type: "text",
      question:
        "Do you have any concerns or questions about using saffron for medicinal purposes?",
      name: "concerns",
      options: ["Yes", "No"],
    },
  ],
  cosmetic: [
    {
      type: "text",
      question: "What is your skin type? (e.g., oily, dry, sensitive)",
      name: "skinType",
      options: ["oily", "dry", "sensitive", "other"],
    },
    {
      type: "select",
      question: "What are your primary skin concerns?",
      name: "skinConcerns",
      options: [
        "Acne",
        "Wrinkles",
        "Dark spots",
        "Dryness",
        "Redness",
        "Uneven skin tone",
        "Other",
      ],
    },
    {
      type: "text",
      question: "How often do you apply skincare products?",
      name: "applicationFrequency",
      options: ["Daily", "Weekly Once", "Occasionally", "Never"],
    },
    {
      type: "select",
      question: "Have you used saffron-based skincare products before?",
      name: "usedSaffron",
      options: ["Yes", "No"],
    },
  ],
  pregnantwomen: [
    {
      type: "text",
      question: "What stage of pregnancy are you in?",
      name: "pregnancyStage",
      options: [
        "first trimester",
        "second trimester",
        "third trimester",
        "postpartum",
        "other",
      ],
    },
    {
      type: "text",
      question: "Have you used saffron before your pregnancy?",
      name: "usedBeforePregnancy",
      options: ["Yes", "No"],
    },
    {
      type: "text",
      question: "Are you currently using saffron during your pregnancy?",
      name: "usingDuringPregnancy",
      options: ["Yes", "No"],
    },
    {
      type: "text",
      question: "Do you have any known allergies? Please specify",
      name: "knownAllergies",
    },
  ],
};

const initialMessages = [
  { text: "Hello and welcome! I'm here to help you find the perfect saffron product for your needs.", type: "bot" },
  { text: `${useCaseQuestions.gender.question}`, type: "bot" }
];

const Chatbot = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(-1);
  const [useCases, setUseCases] = useState([]);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [data, setData] = useState({});
  const [recognitionActive, setRecognitionActive] = useState(false);
  const messageEndRef = useRef(null);
  const [suggestion, setSuggestion] = useState();
  const navigate = useNavigate();

  const {user} = useContext(userContext);
  console.log(user);

  let recognition;

  // Initialize speech recognition
  if (!("webkitSpeechRecognition" in window)) {
    console.error("Speech recognition not supported in this browser.");
  } else {
    recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setRecognitionActive(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setRecognitionActive(false);
    };

    recognition.onend = () => {
      setRecognitionActive(false);
    };
  }

  // Function to handle text-to-speech
  const speak = (text, callback) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.onend = callback;
    window.speechSynthesis.speak(utterance);
  };

  const speakInitialMessages = () => {
    let index = 0;
    const speakNextMessage = () => {
      if (index < initialMessages.length) {
        const message = initialMessages[index];
        speak(message.text, () => {
          index += 1;
          speakNextMessage();
        });
      }
    };
    speakNextMessage();
  };

  useEffect(() => {
    speakInitialMessages(); // Speak initial messages
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleMicrophoneClick = () => {
    if (recognitionActive) {
      recognition.stop();
      setRecognitionActive(false);
    } else {
      recognition.start();
      setRecognitionActive(true);
    }
  };

  const handleOptionClick = (option) => {
    setInput(option);
    handleSubmit(option);
  };

  const handleSubmit = async (inputValue = input) => {
    if (!inputValue.trim()) return;
  
    const newMessages = [...messages, { text: inputValue, type: "user" }];
    setMessages(newMessages);
    setInput("");
  
    // Speak the user's response
    speak(inputValue);
  
    if (step === -1) {
      // Handle gender input
      setData({
        ...data,
        gender: inputValue.trim().toLowerCase(), // Save gender data
      });
  
      setMessages([
        ...newMessages,
        { text: useCaseQuestions.recommendation.question, type: "bot" },
      ]);
      speak(useCaseQuestions.recommendation.question);
      setStep(0);
      return;
    }
  
    if (step === 0) {
      // Handle use cases selection
      const selectedUseCases = inputValue
        .split(",")
        .map((caseNum) => caseNum.trim().toLowerCase());
      const validUseCases = ["1", "2", "3", "4"];
      const useCaseMapping = {
        1: "culinary",
        2: "cosmetic",
        3: "medicinal",
        4: "pregnantwomen",
      };
      const selectedValidUseCases = selectedUseCases
        .filter((caseNum) => validUseCases.includes(caseNum))
        .map((caseNum) => useCaseMapping[caseNum]);
  
      if (selectedValidUseCases.length > 0) {
        setUseCases(selectedValidUseCases);
        setData({
          ...data,
          recommendation: { useCases: selectedValidUseCases },
        });
        const questions = selectedValidUseCases.flatMap(
          (useCase) => useCaseQuestions[useCase]
        );
        setCurrentQuestions(questions);
        setStep(1);
        setMessages([
          ...newMessages,
          { text: questions[0].question, type: "bot" },
        ]);
        speak(questions[0].question); // Read aloud
      } else {
        setMessages([
          ...newMessages,
          {
            text: "Invalid use cases selected. Please try again.",
            type: "bot",
          },
        ]);
        speak("Invalid use cases selected. Please try again.");
      }
      return;
    }
  
    if (step >= 1) {
      // Handle responses for subsequent questions
      const currentQuestion = currentQuestions[step - 1];
      const newData = { ...data };
  
      if (currentQuestion.type === "text") {
        newData[currentQuestion.name] = inputValue.trim();
      } else if (currentQuestion.type === "select") {
        newData[currentQuestion.name] = inputValue.trim();
      }
  
      setData(newData);
  
      if (step < currentQuestions.length) {
        const nextQuestion = currentQuestions[step];
        setMessages([
          ...newMessages,
          { text: nextQuestion.question, type: "bot" },
        ]);
        speak(nextQuestion.question);
        setStep(step + 1);
      } else {
        setMessages([
          ...newMessages,
          {
            text: "Thank you for your input! We will process your data now.",
            type: "bot",
          },
        ]);
        speak("Thank you for your input! We will process your data now.");
  
        // Include user data in the request payload
        const requestData = {
          ...data,
          user: user, // Add user data here
        };
  
        // Send data to backend
        try {
          const response = await axios.post("/analyzeData", requestData);
          
          const suggestionText = response.data.suggestion;
          setSuggestion(suggestionText);
  
          setMessages([
            ...messages,
            {
              text: "Thank you for your responses. We have submitted your data.",
              type: "bot",
            },
            { text: suggestionText, type: "suggestion" },
          ]);
  
          speak(
            "Thank you for your responses. We have submitted your data.",
            () => {
              speak(suggestionText);
            }
          );
        } catch (error) {
          console.error("Error submitting data:", error);
          setMessages([
            ...messages,
            {
              text: "There was an error submitting your data. Please try again.",
              type: "bot",
            },
          ]);
          speak("There was an error submitting your data. Please try again.");
        }
      }
    }
  };
  

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded bg-gray-300 hover:bg-gray-400 transition-colors duration-200"
        >
          <MdArrowBack className="text-xl text-gray-700" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Chatbot</h1>
        <div className="flex-1"></div>
      </div>

      <div className="flex-1 overflow-auto p-2 bg-white border border-gray-300 rounded-lg">
        <div className="flex flex-col space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className={`my-2 p-3 rounded-lg ${
                message.type === "bot"
                  ? "bg-blue-100 text-blue-900"
                  : message.type === "suggestion"
                  ? "bg-yellow-100 text-yellow-800 suggestion-message"
                  : "bg-gray-200 text-gray-800"
              } ${
                message.type === "user"
                  ? "flex flex-row-reverse items-center"
                  : "flex items-center"
              }`}
            >
              {message.type === "user" && (
                <img src={Client} width={70} alt="" className="ml-4 rounded-full shadow-sm" />
              )}
              {message.type !== "user" && (
                <img src={SalesExecutive} width={100} alt="" className="mr-4 rounded-full shadow-sm" />
              )}
              <span className="text-base">{message.text}</span>
            </motion.div>
          ))}
          {suggestion && <BotProductList />}
        </div>
        <div ref={messageEndRef} />
      </div>

      <div className="flex items-center mt-4 border-t border-gray-300 pt-2 bg-gray-100 rounded-b-lg">
        <button
          onClick={handleMicrophoneClick}
          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
        >
          <FaMicrophoneAlt className="text-lg" />
        </button>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          className="flex-1 p-2 ml-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
        />
        <button
          onClick={() => handleSubmit()}
          className="p-2 ml-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
        >
          <IoSend className="text-lg" />
        </button>
      </div>

      {currentQuestions.length > 0 && step > 0 && (
        <div className="mt-4">
          {currentQuestions[step - 1].options && (
            <div className="flex flex-wrap space-x-2">
              {currentQuestions[step - 1].options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className="p-2 bg-gray-200 text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;
