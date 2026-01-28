import React, { useState, useRef, useEffect } from "react";
import { apiRequest } from "../services/api";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const ChatBot: React.FC<{ currentSkill?: string }> = ({ currentSkill }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Greetings, Player! I am Matrix AI. Need a hint?" },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Add User Message immediately
    const userMsg = input;
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      // 2. Call Backend
      // Ensure this route exists in your backend!
      const data = await apiRequest("/api/progresso/ai/chat", "POST", {
        message: userMsg,
        currentSkill: currentSkill || "General Dashboard",
      });

      // 3. Add AI Response
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Connection lost to the Matrix." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end">
      {/* CHAT WINDOW (Only visible when open) */}
      {isOpen && (
        <div className="mb-4 w-80 h-96 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header */}
          <div className="bg-purple-400 p-3 border-b-4 border-black flex justify-between items-center">
            <h3 className="font-black text-white uppercase tracking-wider text-sm">
              Matrix AI 🤖
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-black font-black hover:text-white px-2"
            >
              X
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg text-xs md:text-sm font-bold border-2 border-black max-w-[85%] ${
                  msg.sender === "user"
                    ? "bg-yellow-200 ml-auto text-right rounded-br-none shadow-[2px_2px_0px_0px_black]"
                    : "bg-white mr-auto text-left rounded-bl-none shadow-[2px_2px_0px_0px_black]"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="text-xs font-bold text-gray-400 animate-pulse pl-2">
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSend}
            className="p-2 border-t-4 border-black bg-white flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for a hint..."
              className="flex-1 bg-slate-100 border-2 border-black rounded-lg px-2 text-xs font-bold focus:outline-none focus:bg-yellow-50"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-400 px-3 py-2 border-2 border-black rounded-lg font-black text-xs hover:bg-green-300 disabled:opacity-50 hover:translate-y-[1px] transition-transform"
            >
              SEND
            </button>
          </form>
        </div>
      )}

      {/* TOGGLE BUTTON (Floating Robot Head) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 md:w-16 md:h-16 bg-purple-400 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_black] flex items-center justify-center text-3xl hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_black] transition-all active:translate-y-0 active:shadow-[2px_2px_0px_0px_black]"
      >
        {isOpen ? "❌" : "🤖"}
      </button>
    </div>
  );
};

export default ChatBot;
