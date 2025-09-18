"use client";
import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Globe } from "lucide-react";

export default function Home() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en-US"); // default English
  const recognitionRef = useRef(null);

 useEffect(() => {
  if (typeof window !== "undefined") {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setText(transcript);
      };

      recognition.onerror = (err: any) => {
        console.error("Speech recognition error:", err);
        setListening(false);
      };

      recognitionRef.current = recognition; // ✅ assign to ref here
    }
  }
}, []);


  // Re-apply language when switching
  useEffect(() => {
    if (recognitionRef.current) {
      (recognitionRef.current as any).lang = language;
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech Recognition not supported in your browser");
      return;
    }

    if (listening) {
      (recognitionRef.current as any).stop();
      setListening(false);
    } else {
     (recognitionRef.current as any).start();
      setListening(true);
    }
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en-US" ? "si-LK" : "en-US"));
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">🎤 Speech to Text</h1>

        <div className="mb-4 flex justify-between items-center">
          <span className="font-semibold">
            Current Language: {language === "en-US" ? "English 🇬🇧" : "Sinhala 🇱🇰"}
          </span>
          <button
            onClick={toggleLanguage}
            className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Globe className="mr-2" /> Switch
          </button>
        </div>

        <textarea
          className="w-full h-40 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Your speech will appear here..."
        />

        <button
          onClick={toggleListening}
          className={`mt-4 flex items-center justify-center w-full py-3 rounded-lg font-semibold text-white transition ${
            listening ? "bg-red-500" : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {listening ? <MicOff className="mr-2" /> : <Mic className="mr-2" />}
          {listening ? "Stop Listening" : "Start Speaking"}
        </button>
      </div>
    </main>
  );
}
