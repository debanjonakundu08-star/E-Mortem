import React, { useState } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  HelpCircle,
  Wrench,
  BatteryCharging,
  Cpu,
  RefreshCcw,
  ShieldCheck,
  FileQuestion,
  Database
} from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import api from "../../services/api";

export default function EMortemAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { devices, kpis } = useProducts();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hi! I'm E-Mortem AI, your digital diagnostic assistant. Ask me why a device might be shutting down, what to ask a repair technician, or whether repair is worth investigating."
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  const suggestedQuestions = [
    {
      label: "Why is my phone shutting down?",
      icon: BatteryCharging,
      answer: "Sudden shutdowns at 30–40% battery usually indicate increased internal cell impedance rather than motherboard failure. When the CPU requests a quick surge of power (e.g. launching camera or 5G), a degraded battery voltage drops below the threshold, triggering an emergency safety cutoff."
    },
    {
      label: "What should I ask the technician?",
      icon: FileQuestion,
      answer: "Before approving any expensive fix, ask: 1) 'What specific component has actually failed?', 2) 'Can you show me the multimeter/diagnostic test result?', 3) 'Can the component be repaired rather than replaced?', 4) 'Are replacement parts OEM or aftermarket?', and 5) 'What warranty do you provide?'"
    },
    {
      label: "Should I repair or replace?",
      icon: Wrench,
      answer: "If the estimated repair cost is under 40% of the device's current market value and the issue is modular (like battery, port, or thermal repasting), repair is typically the smarter financial and environmental decision. For our demo Galaxy S23, a ₹1,500–₹3,000 service saves an ₹18,000 device."
    },
    {
      label: "What should I back up first?",
      icon: Database,
      answer: "Always back up your contacts, photos, 2FA authenticator codes, and chat histories immediately. Even minor battery swaps carry a small risk of data corruption or reset if the board must be disconnected."
    },
    {
      label: "Is my battery likely failing?",
      icon: Cpu,
      answer: "Top signs of battery degradation: 1) Device feels hot during light browsing, 2) Fast battery percentage drop from 100% to 80% within minutes, 3) Shutdowns while opening heavy apps, and 4) Screen or back cover slightly lifting due to pouch swelling."
    },
    {
      label: "What could have caused this problem?",
      icon: Sparkles,
      answer: "Our forensic database shows that 38% of consumer electronics issues originate from normal chemical battery cycle wear (typically 500–800 charge cycles), 21% from thermal interface dry-out, and 17% from micro-fractures in charging ports."
    }
  ];

  const handleSend = async (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    // Add user message
    const userMsg = { id: Date.now(), sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");

    try {
      const res = await api.askAssistant(query);
      if (res && res.response) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: "ai", text: res.response }
        ]);
        return;
      }
    } catch (e) {
      console.log("Backend assistant offline, using client fallback:", e.message);
    }

    // Client-side fallback
    setTimeout(() => {
      let reply = "";
      const lower = query.toLowerCase();

      if (lower.includes("shutdown") || lower.includes("shut down") || lower.includes("30%")) {
        reply = "Sudden shutdowns at 20–30% charge typically indicate battery cell voltage collapse: as Li-ion cells age, internal resistance surges, causing voltage to drop below the operating threshold under load.";
      } else if (lower.includes("technician") || lower.includes("shop") || lower.includes("ask")) {
        reply = "Before paying a technician, ask: 1) What exact multimeter or software test confirmed component failure? 2) Can the component be resoldered or cleaned rather than replaced? 3) Is the replacement part OEM with a 90-day warranty?";
      } else if (lower.includes("repair") || lower.includes("replace") || lower.includes("worth")) {
        reply = `In our E-Mortem database of ${kpis.devicesDiagnosed} devices, 71% are economically viable for repair. Check if the repair cost is less than 35% of the device's second-hand value.`;
      } else if (lower.includes("battery") || lower.includes("drain")) {
        reply = "Battery degradation accounts for 38% of reported device failures. A simple battery replacement typically yields 18–24 months of additional device life.";
      } else if (lower.includes("backup") || lower.includes("data")) {
        reply = "Back up user data immediately before taking your device to a shop. Secure your photos, documents, and authenticator keys to avoid permanent loss.";
      } else {
        reply = "E-Mortem provides a digital second opinion based on forensic failure patterns. Before spending on costly repairs or discarding your gadget, examine modular components and ask for proof of diagnosis.";
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "ai", text: reply }
      ]);
    }, 450);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all"
        >
          <Bot className="w-5 h-5" />
          <span>E-Mortem AI</span>
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
        </button>
      )}

      {/* Assistant Modal / Drawer */}
      {isOpen && (
        <div className="w-[360px] sm:w-[410px] h-[540px] bg-[#0C1016] border border-emerald-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-[#0C1016] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5 font-sans">
                  E-Mortem AI
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-semibold">
                    DIAGNOSTIC BOT
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Your digital diagnostic assistant
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: 1,
                      sender: "ai",
                      text: "Hi! I'm E-Mortem AI, your digital diagnostic assistant. Ask me why a device might be shutting down, what to ask a repair technician, or whether repair is worth investigating."
                    }
                  ])
                }
                title="Reset conversation"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "ai" && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3 rounded-xl leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-emerald-500 text-slate-950 font-medium rounded-tr-none shadow-md shadow-emerald-500/10"
                      : "bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Suggested Question Chips (visible if only initial message) */}
            {messages.length === 1 && (
              <div className="pt-2 space-y-1.5">
                <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 mb-1">
                  Suggested Questions
                </div>
                {suggestedQuestions.map((q, idx) => {
                  const Icon = q.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSend(q.label)}
                      className="w-full text-left p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/70 hover:border-emerald-500/30 text-[11px] text-slate-300 hover:text-white flex items-center gap-2 transition-all"
                    >
                      <Icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{q.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask E-Mortem AI..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 disabled:opacity-40 transition-all shrink-0 font-semibold"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
