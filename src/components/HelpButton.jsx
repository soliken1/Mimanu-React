import React, { useState, useRef, useEffect } from "react";
import { FaQuestion } from "react-icons/fa";
import { Link } from "react-router-dom";

const HelpButton = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [greeted, setGreeted] = useState(() => {
    return localStorage.getItem("chatGreeted") === "true";
  });
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Persist messages to localStorage
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setIsTyping(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch("https://mimanu-faq.vercel.app/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`Server responded with ${response.status}`);

      const data = await response.json();

      setTimeout(() => {
        setIsTyping(false);
        if (data.response) {
          setMessages((prev) => [
            ...prev,
            { text: data.response, sender: "bot" },
          ]);
        }
      }, 1500);
    } catch (error) {
      console.error("Chat error:", error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          text:
            error.name === "AbortError"
              ? "Request timed out. Please try again."
              : "An error occurred. Please try again.",
          sender: "bot",
        },
      ]);
    }
  };

  const handleChatOpen = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      if (!greeted) {
        setGreeted(true);
        localStorage.setItem("chatGreeted", "true");
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              text: "Hi, I'm MiManubot, your MiManuTMS AI-Assistant. How may I help you today?",
              sender: "bot",
            },
          ]);
        }, 1000);
      }
    }
  };

  return (
    <div className="fixed bottom-20 z-20 right-5">
      {/* Floating Chat Icon */}
      <button
        onClick={handleChatOpen}
        className={`bg-[#152852] text-white p-2 rounded-full shadow-lg ${
          isOpen ? "hidden" : "block"
        }`}
      >
        <FaQuestion />
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div
          ref={chatBoxRef}
          tabIndex={0}
          className="md:right-10 w-full max-w-[325px] mt-2 bg-white shadow-lg rounded-lg flex flex-col overflow-hidden"
        >
          {/* Chat Header */}
          <div className="bg-[#152852] text-white p-3 flex justify-between items-center">
            <span>MiManu FAQ Bot</span>
            <button onClick={() => setIsOpen(false)} className="text-xl">✖</button>
          </div>

          {/* Chat Messages */}
          <div className="h-64 md:h-80 p-3 overflow-y-auto flex flex-col">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg text-sm max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-[#152852] text-white self-start"
                    : "bg-gray-300 text-black self-end"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="self-end bg-gray-300 text-black p-2 rounded-lg text-sm max-w-[80%]">
                ...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Field */}
          <div className="flex py-2 px-1 w-full gap-2 justify-evenly border-t bg-white">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="p-2 border rounded-md outline-none flex-1"
            />
            <button
              onClick={sendMessage}
              className="bg-[#152852] text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpButton;
