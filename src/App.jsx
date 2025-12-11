import React, { useState, useEffect, useRef } from "react";
import { UserCircleIcon, SparklesIcon } from "@heroicons/react/24/solid";


function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [aiReady, setAiReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const checkReady = setInterval(() => {
      if (window.puter && window.puter.ai && typeof window.puter.ai.chat === "function") {
        setAiReady(true);
        clearInterval(checkReady);
      }
    }, 1000);

    return () => clearInterval(checkReady);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const addMessage = (content, isUser) => {
    setMessages((prev) => [
      ...prev,
      { content, isUser, id: Date.now() + Math.random() },
    ]);
  };

  const sendMessage = async () => {
    const message = inputValue.trim();
    if (!message) return;

    if (!aiReady) {
      addMessage("AI service is still loading. Please wait...", false);
      return;
    }

    addMessage(message, true);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await window.puter.ai.chat(message);
      const reply = typeof response === "string" ? response : response.message?.content || "No reply received";
      addMessage(reply, false);
    } catch (err) {
      addMessage(`Error: ${err.message || "Something went wrong"}`, false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-slate-950 to-emerald flex flex-col items-center justify-center p-4 gap-8">
      <h1 className="text-6xl sm:text-7xl font-light bg-gradient-to-r from-emerald-400 via-sky-300 to-blue-500 bg-clip-text text-transparent text-center h-20">
        AI Chat
      </h1>

      <div
        className={`px-4 py-2 rounded-full text-sm ${
          aiReady
            ? "bg-green-500/30 text-green-300 border border-green-500/20"
            : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
        }`}
      >
        {aiReady ? "AI Ready" : "Waiting for AI..."}
      </div>

      <div className="w-full max-w-2xl bg-gray-800/80 backdrop-blur-md border border-gray-600 rounded-3xl p-6 shadow-2xl flex flex-col">
        <div className="h-80 overflow-y-auto p-4 bg-gray-900/50 rounded-2xl flex flex-col gap-3">

          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-20">
              Start the conversation by typing a message below.
            </div>
          )}

          {/* Mesazhet */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.isUser ? "self-end flex-row-reverse" : "self-start"
              }`}
            >
              {/* IKONA */}
              {msg.isUser ? (
                <UserCircleIcon className="w-10 h-10 text-blue-300" />
              ) : (
                <SparklesIcon className="w-10 h-10 text-emerald-300" />
              )}

              {/* BUBBLE */}
              <div
                className={`p-3 max-w-xs rounded-2xl text-white break-words ${
                  msg.isUser
                    ? "bg-gradient-to-r from-blue-600 to-emerald-500 text-right"
                    : "bg-gradient-to-r from-emerald-600 to-indigo-600 text-left"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3 self-start">
              <SparklesIcon className="w-10 h-10 text-emerald-300" />
              <div className="p-3 max-w-xs rounded-2xl bg-gradient-to-r from-emerald-600 to-indigo-600 text-white">
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
                  Thinking...
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={aiReady ? "Type your message..." : "Waiting for AI to be ready"}
            disabled={!aiReady || isLoading}
            className="flex-1 px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={sendMessage}
            disabled={!aiReady || isLoading || !inputValue.trim()}
            className="px-6 py-3 bg-gradient-to-r from-sky-400 to-emerald-400 hover:opacity-80 text-white font-semibold rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
                Sending...
              </div>
            ) : (
              "Send"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;


