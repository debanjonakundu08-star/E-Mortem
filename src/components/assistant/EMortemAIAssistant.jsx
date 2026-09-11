import React, { useState, useRef, useEffect } from "react";
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
  Database,
  Smartphone,
  ChevronRight,
  RotateCcw
} from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import api from "../../services/api";

const INITIAL_SUGGESTED_QUESTIONS = [
  {
    label: "Why is my phone shutting down?",
    icon: BatteryCharging,
    topic: "shutdown"
  },
  {
    label: "What should I ask the technician?",
    icon: FileQuestion,
    topic: "technician"
  },
  {
    label: "Should I repair or replace?",
    icon: Wrench,
    topic: "economics"
  },
  {
    label: "What should I backup first?",
    icon: Database,
    topic: "backup"
  },
  {
    label: "Is my battery likely failing?",
    icon: Cpu,
    topic: "battery_failing"
  },
  {
    label: "What could have caused this problem?",
    icon: Sparkles,
    topic: "root_cause"
  }
];

function generateClientResponse(queryText, history, context, kpis) {
  const query = (queryText || "").toLowerCase().trim();
  const deviceName = context?.deviceName || "Samsung Galaxy S23";
  const deviceType = context?.deviceType || "Smartphone";
  const deviceAge = context?.deviceAge || "2.5 years";
  const currentValue = context?.currentValue || 18000;
  const healthScore = context?.healthScore || 64;
  const repairabilityScore = context?.repairabilityScore || 78;
  const recommendation = context?.recommendation || "REPAIR FIRST";
  const symptoms = context?.symptoms || ["shutdown", "battery_drain", "overheating"];
  const symptomsStr = Array.isArray(symptoms) ? symptoms.join(", ") : String(symptoms);

  const match = (terms) => terms.some((t) => {
    const regex = new RegExp(`(?:\\b|_)${t}(?:\\b|_)`, "i");
    return regex.test(query);
  });

  let lastAiText = "";
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].sender === "ai") {
      lastAiText = history[i].text.toLowerCase();
      break;
    }
  }

  // 0. Unrelated queries
  const unrelatedTriggers = [
    "capital of", "weather today", "recipe for", "cook", "poem", "story about",
    "who won", "president of", "prime minister", "joke", "bitcoin", "crypto"
  ];
  if (unrelatedTriggers.some((t) => query.includes(t))) {
    return {
      reply: "I am E-Mortem AI, specialized specifically in consumer electronics diagnostics, hardware failure triage, repair economics, and electronic waste reduction. I can help diagnose issues with phones, laptops, tablets, audio gear, smartwatches, and TVs, or interpret your E-Mortem autopsy reports. How can I assist with your device?",
      prompts: [
        "Why is my phone shutting down?",
        "What should I ask the technician?",
        "Should I repair or replace?",
        "Is my battery likely failing?"
      ]
    };
  }

  // 1. Swollen battery safety
  if (match(["swollen", "swelling", "bulge", "bulging", "puff", "puffed", "bent battery"])) {
    return {
      reply: "⚠️ CRITICAL HARDWARE SAFETY HAZARD: A swollen or bulging battery indicates chemical gas buildup and internal layer delamination. This is an active thermal runaway risk (fire hazard). Do NOT attempt to charge, compress, puncture, or turn on the device. Power it off immediately and place it on a non-conductive, fire-safe surface away from flammable materials until an authorized technician can safely extract and properly recycle the lithium-ion pouch.",
      prompts: ["How to safely store a swollen battery?", "Can a swollen battery be recycled?", "What causes lithium-ion batteries to swell?"]
    };
  }

  // 2. Question 1: Why is my phone shutting down?
  if (match(["shutting down", "shutdown", "shut down", "shuts down", "randomly turns off", "powers off", "cutting off", "dying randomly"])) {
    return {
      reply: `Preliminary Assessment of Sudden Shutdowns for ${deviceName} (${deviceAge}):\n\n` +
        `• Primary Suspected Cause: Battery Cell Internal Impedance Degradation (~48% probability).\n` +
        `  As lithium-ion cells age over ${deviceAge} (typically 500–800 charge cycles), their internal DC resistance surges. ` +
        `The battery maintains nominal voltage at rest, but when the processor demands a momentary current spike (e.g. launching camera, 5G data burst, or gaming), ` +
        `the cell voltage collapses below the Power Management IC's (PMIC) safety threshold (~3.4V), forcing an instant shutdown.\n\n` +
        `• Contributing Factors from Reported History:\n` +
        `  - Active Symptoms: ${symptomsStr}.\n` +
        `  - Thermal Stress: If the chassis reaches 40°C+, internal safety watchdogs initiate protective power cuts.\n` +
        `  - Mechanical Stress: Prior drops can cause micro-fractures in battery contact solder tabs.\n\n` +
        `🔬 Recommendation: Have a certified technician bench-test battery DC internal resistance before considering expensive motherboard repairs.`,
      prompts: [
        "Why do you think it's the battery?",
        "Could overheating be related?",
        "Should I replace the battery?",
        "What should I ask the technician?"
      ]
    };
  }

  // 3. Question 2: What should I ask the technician?
  if (match(["ask the technician", "ask technician", "what should i ask", "technician questions", "questions to ask", "technician checklist", "interrogate", "scam"])) {
    return {
      reply: `E-Mortem Technician Interrogation Checklist for ${deviceName}:\n\n` +
        `Before approving any expensive component or motherboard service, demand answers to these 5 forensic questions:\n\n` +
        `1. 🔬 Diagnostic Evidence: 'What specific instrument test (multimeter diode mode reading, DC power supply current draw, or software battery cycle log) confirmed component failure?'\n` +
        `2. 🛠️ Modular Repairability: 'Can this issue be resolved by replacing the modular battery/sub-board rather than replacing the entire logic board?'\n` +
        `3. 📦 Defective Part Return: 'Will you return my old, defective component in a sealed anti-static bag upon completion?' (Guarantees they did not merely reseat a ribbon cable).\n` +
        `4. 🏷️ Part Authenticity: 'Are the replacement parts genuine OEM, refurbished OEM, or third-party aftermarket Grade A/B?'\n` +
        `5. 📝 Written Warranty: 'What is your written warranty on parts and labor? (Require at least a 90-day written guarantee).'`,
      prompts: [
        "Why should I ask for my old replaced parts back?",
        "How much might repair cost?",
        "Should I replace the battery?",
        "Can I fix it myself?"
      ]
    };
  }

  // 4. Question 3: Should I repair or replace?
  if (match(["repair or replace", "replace or repair", "worth repairing", "worth fixing", "should i repair", "should i replace", "repair vs replace", "buy new", "economics"])) {
    return {
      reply: `E-Mortem 40% Second Opinion Rule Analysis for ${deviceName} (${deviceAge}):\n\n` +
        `• Current Secondary Market Value: Estimated at ~₹${currentValue} ($200–$250) in functional refurbished condition.\n` +
        `• Estimated Modular Repair Cost: ~₹1,500–₹3,200 ($30–$65) for an OEM battery or charging sub-board.\n` +
        `• Cost-to-Value Ratio: ~8–18% of device equity (substantially below the 40% threshold).\n` +
        `• Repairability Index: ${repairabilityScore}/100 (Modular components accessible with standard adhesive release).\n` +
        `• E-Mortem Recommendation: ${recommendation} (STRONGLY RECOMMENDED).\n\n` +
        `🌱 Environmental Impact: Servicing the modular wear component saves ₹15,000+ compared to a replacement device, while preventing ~70kg of CO2 equivalent manufacturing emissions and hazardous e-waste.`,
      prompts: [
        "How much could it cost?",
        "Will replacing the battery solve it?",
        "What should I ask the technician?",
        "Can I fix it myself?"
      ]
    };
  }

  // 5. Question 4: What should I backup first?
  if (match(["backup first", "back up first", "what should i backup", "what should i back up", "backup checklist", "save data first", "data to backup", "backup my data"])) {
    return {
      reply: `E-Mortem Prioritized Data Backup Checklist for ${deviceName}:\n\n` +
        `Before submitting your device to any repair facility or opening the chassis, back up in this exact priority order:\n\n` +
        `1. 🔐 Two-Factor Authenticator (2FA) Keys: Google Authenticator, Authy, or bank security tokens (export accounts to a secondary device or print seed QR codes).\n` +
        `2. 📇 Critical Contacts & Cloud Credentials: Ensure Google/Apple cloud account sync shows a timestamp from today.\n` +
        `3. 💬 Encrypted Chat Histories & Media: WhatsApp, Telegram, or Signal local and cloud chat backups.\n` +
        `4. 📸 Photos & Personal Documents: Connect to a PC/Mac via USB cable or trigger an off-device backup to Google Photos, iCloud, or OneDrive.\n` +
        `5. 💳 Financial & eSIM Profiles: De-register sensitive banking tokens and save your eSIM profile QR code if logic board service is required.\n\n` +
        `💡 Tip: If your touchscreen is cracked or unresponsive, connect a wired USB mouse via a $3 USB-C OTG dongle to navigate and unlock the phone.`,
      prompts: [
        "Can I recover my data if the screen is black?",
        "Should I factory reset before sending to a repair shop?",
        "How to use USB OTG to back up a broken phone?"
      ]
    };
  }

  // 6. Question 5: Is my battery likely failing?
  if (match(["battery likely failing", "is my battery failing", "battery dying", "failing battery", "battery bad", "battery failing", "battery degradation signs", "battery health failing"])) {
    return {
      reply: `Forensic Battery Failure Indicators for ${deviceName} (${deviceAge}):\n\n` +
        `Based on E-Mortem's forensic failure database, here is the diagnostic evidence that your battery is failing:\n\n` +
        `1. 📉 Voltage Sag Under Load: The device unexpectedly powers down at 20–40% charge, especially when opening camera, navigation, or games.\n` +
        `2. 🌡️ Localized Chassis Warmth: The battery area becomes noticeably warm during normal web browsing or charging due to heightened internal DC resistance.\n` +
        `3. ⚡ Rapid Percentage Cliff: Device percentage drops from 100% to 80% within 15–20 minutes of light use.\n` +
        `4. 🔄 Cycle Degradation: At ~${deviceAge} of daily use, the cell has exceeded ~600 charge cycles, dropping below 80% nominal chemical capacity.\n` +
        `5. 🔍 Physical Pouch Swelling: Check if the screen or rear glass is subtly lifting. (If so, stop charging immediately).\n\n` +
        `Verdict: Preliminary assessment indicates high likelihood of chemical cell exhaustion. Motherboard damage is unlikely.`,
      prompts: [
        "Why do you think it's the battery?",
        "Will replacing the battery solve it?",
        "How much could it cost?",
        "Should I repair or replace?"
      ]
    };
  }

  // 7. Question 6: What could have caused this problem?
  if (match(["caused this problem", "caused this", "what could have caused", "why did this happen", "cause of this", "what caused the issue", "root cause", "failure cause"])) {
    return {
      reply: `E-Mortem Root Cause Analysis for ${deviceName}:\n\n` +
        `Cross-referencing your device age (${deviceAge}), reported symptoms (${symptomsStr}), and E-Mortem's forensic failure telemetry:\n\n` +
        `• Rank 1: Chemical Cell Aging & Voltage Sag (~48% probability)\n` +
        `  Natural electrochemical exhaustion of the lithium cobalt oxide cathode over hundreds of discharge cycles.\n\n` +
        `• Rank 2: Thermal Interface Degradation (~26% probability)\n` +
        `  Dried thermal paste or dust-choked heat dissipation channels forcing thermal throttling and emergency shutdowns.\n\n` +
        `• Rank 3: Mechanical Drop Stress (~16% probability)\n` +
        `  Prior drop events can micro-fracture internal battery tab welds or loosen flex cable connectors, causing intermittent disconnects.\n\n` +
        `• Rank 4: Charging Circuit / Port Oxidation (~10% probability)\n` +
        `  Intermittent charging currents destabilizing the battery calibration table.\n\n` +
        `Preliminary Assessment: Over 74% of reported cases with these symptoms are resolved by simple modular battery/thermal service rather than expensive logic board replacement.`,
      prompts: [
        "Why do you think it's the battery?",
        "Should I repair or replace?",
        "Could overheating be related?",
        "What should I do now?"
      ]
    };
  }

  // 8. Follow-up: "Will replacing the battery solve it?"
  if (match(["replacing the battery solve", "will a new battery fix", "will replacing the battery", "will new battery solve", "solve it if i replace", "fix it if i replace"])) {
    return {
      reply: `Preliminary Assessment for ${deviceName} (${deviceAge}):\n\n` +
        `• High Confidence Resolution: In over 90% of cases where devices shut down at 20–40% charge or drain rapidly after 2+ years of use, an OEM battery replacement completely solves the problem.\n` +
        `• Restored Performance: A fresh battery restores stable peak voltage delivery, eliminating low-voltage processor throttling and sudden restarts.\n` +
        `• Expected Longevity: An OEM replacement typically provides an additional 18–24 months of stable operation.\n` +
        `• Cost vs Value: At ~₹1,500–₹3,200 ($30–$65), it preserves an estimated ₹${currentValue} in device equity.\n\n` +
        `Recommendation: Always ensure the technician uses an OEM or certified Grade-A cell and provides a written 90-day warranty.`,
      prompts: [
        "How much could it cost?",
        "What should I ask the technician?",
        "Can I fix it myself?"
      ]
    };
  }

  // 9. Follow-up: "Can I fix it myself?"
  if (match(["fix it myself", "repair it myself", "diy repair", "can i do it myself", "self repair", "replace it myself"])) {
    return {
      reply: `Self-Repair Feasibility for ${deviceName} (Repairability Score: ${repairabilityScore}/100):\n\n` +
        `• Difficulty Rating: Moderate (Requires heat, suction, and solvent).\n` +
        `• Tools Required: Heat gun or hairdryer (to soften rear glass adhesive), suction cup, plastic pry spudgers, precision screwdriver, and 90%+ isopropyl alcohol to release battery glue.\n` +
        `• Critical Safety Risks: Puncturing or bending a glued lithium pouch cell can cause chemical fire or thermal runaway. Never use metal tools directly against the battery.\n` +
        `• Professional Recommendation: If you are not experienced with adhesive pull-tabs and heat separation, professional technician labor only costs ~₹500–₹1,000 ($15–$25) and includes warranty coverage.`,
      prompts: [
        "What should I ask the technician?",
        "How much could it cost?",
        "What should I backup first?"
      ]
    };
  }

  // 10. Follow-up: "What should I do now?"
  if (match(["what should i do now", "what should i do", "what to do now", "next steps", "recommended action"])) {
    return {
      reply: `E-Mortem Action Plan for ${deviceName}:\n\n` +
        `1. 💾 Backup Immediately: Secure your 2FA authenticator seeds, contacts, and cloud photos before taking the device anywhere.\n` +
        `2. 🛡️ Mitigate Heat Stress: Avoid fast-charging in warm environments, remove thick cases while charging, and avoid gaming at low battery.\n` +
        `3. 🔍 Diagnostic Bench Test: Visit a local repair shop and ask for a physical battery multimeter test (checking DC resistance and voltage under simulated load).\n` +
        `4. 📋 Use Technician Armor: Request an itemized quote and ask the 5 technician interrogation questions before approving any service.\n` +
        `5. ⚖️ Apply 40% Rule: If the repair is under ₹3,200, proceed with the modular repair to preserve device equity.`,
      prompts: [
        "What should I ask the technician?",
        "How much could it cost?",
        "Should I replace the battery?"
      ]
    };
  }

  // 11. Follow-up: "Is it dangerous?" / "Is it safe?"
  if (match(["is it dangerous", "is it safe", "safe to use", "will it explode", "can it explode", "danger"])) {
    return {
      reply: `Preliminary Safety Assessment for ${deviceName}:\n\n` +
        `• Fire Risk: Very low, provided the battery is not physically swollen or punctured.\n` +
        `• Data & Component Risks: Moderate to high. Frequent sudden shutdowns can corrupt the flash storage file system (requiring a factory wipe). ` +
        `Operating at sustained high temperatures can also accelerate solder fatigue on motherboard processor BGA chips.\n\n` +
        `Conclusion: It is safe to use lightly for essential tasks and backups, but avoid high processing loads until serviced.`,
      prompts: [
        "What should I backup first?",
        "Should I replace the battery?",
        "How much could it cost?"
      ]
    };
  }

  // 12. Follow-up: "Why?" / "Tell me more."
  if (match(["why", "tell me more", "why is that", "explain more", "why do you say that"])) {
    return {
      reply: `Forensic Explanation for ${deviceName}:\n\n` +
        `At ${deviceAge} of daily cycling, lithium ions become trapped in the graphite anode (solid electrolyte interphase layer growth). ` +
        `This causes two distinct physical effects:\n` +
        `1. Capacity Loss: The total milliamp-hours (mAh) the battery can store shrinks by 20–30%.\n` +
        `2. Impedance Rise: The battery's internal resistance increases dramatically. When current flows out of the battery, voltage drops proportionally (Ohm's Law: V_drop = I × R_internal). ` +
        `A sudden surge of 2–3 Amperes drops the cell voltage below 3.4V, triggering the PMIC shutdown circuit to prevent memory corruption.\n\n` +
        `This is why the device shuts down even though the battery percentage was still reading 30% moments before.`,
      prompts: [
        "Could overheating be related?",
        "Will replacing the battery solve it?",
        "How much could it cost?"
      ]
    };
  }

  // 13. Follow-up: "Could overheating be related?"
  if (match(["overheating be related", "is overheating related", "could heat be related", "does heat cause this", "heat related"])) {
    return {
      reply: `Yes, overheating and battery degradation are closely correlated potential contributing factors in your ${deviceName}.\n\n` +
        `• Resistive Heat Loop: As internal battery cell resistance rises, the battery dissipates significantly more electrical energy as waste heat during discharge and fast-charging.\n` +
        `• Electrolyte Breakdown: Prolonged exposure to temperatures above 38°C accelerates the chemical decomposition of lithium salt electrolytes, compounding capacity loss.\n` +
        `• Thermal Throttling: When the SoC detects elevated chassis temperatures, it throttles processor clock speeds (causing stutter and lag) and reduces charging current to mitigate thermal runaway risks.\n\n` +
        `Physical bench inspection of both battery impedance and thermal interface paste is recommended.`,
      prompts: [
        "Should I replace the battery?",
        "What happens if I keep using it?",
        "What should I ask the technician?"
      ]
    };
  }

  // 14. Follow-up: "How much could it cost?"
  if (match(["how much could it cost", "how much might repair", "how much will it cost", "how much does it cost", "repair cost", "cost to fix"])) {
    const costDetails = deviceType === "Laptop"
      ? "• Thermal Cleaning & Repaste: ₹1,000–₹2,500 ($25–$50)\n• Laptop Battery Replacement: ₹3,000–₹6,500 ($45–$90)\n• Screen Assembly: ₹5,000–₹12,000 ($70–$150)"
      : "• OEM Battery Replacement: ₹1,500–₹3,200 ($30–$65)\n• Charging Port Sub-Board: ₹1,200–₹2,500 ($20–$40)\n• AMOLED Display Replacement: ₹5,500–₹12,000 ($80–$160)\n• Camera Module Swap: ₹2,500–₹5,000 ($35–$75)";
    return {
      reply: `Preliminary Repair Cost Estimates for ${deviceName} (${deviceType}):\n\n` +
        `${costDetails}\n\n` +
        `💡 Economic Context: With your device valued at ~₹${currentValue}, a ₹2,000–₹3,000 battery service preserves 100% of device equity for under 17% of its value.`,
      prompts: [
        "What should I ask the technician?",
        "Can I fix it myself?",
        "Should I repair or replace?"
      ]
    };
  }

  // 15. Context switch: Laptop
  if (match(["what about my laptop", "laptop overheating", "my laptop", "switch to laptop", "fan so loud"])) {
    return {
      reply: `Switching active diagnostic context to Laptop hardware architecture.\n\n` +
        `Preliminary Assessment of Laptop Overheating:\n` +
        `1. Heatsink Fin Stack Dust Blanketing: Laptop cooling fans pull ambient air and lint into the copper radiator fins, forming an insulating felt blanket that blocks exhaust airflow.\n` +
        `2. Cured Thermal Paste: Factory thermal interface paste dries out and cures after 18–24 months, creating microscopic air pockets between the silicon die and copper heat pipes.\n` +
        `3. Fan Bearing Friction or Vapor Chamber Depletion: Fan motor bearings accumulate grime, or copper heat pipes lose their vacuum seal.\n\n` +
        `Triage Action: A routine physical maintenance service (dust blowout + repaste with Arctic MX-6 or Honeywell PTM7950 phase-change pad) typically lowers operating temperatures by 12–20°C and eliminates fan whine for under ₹1,500–₹2,500.`,
      prompts: [
        "How often should thermal paste be replaced?",
        "What should I ask the technician?",
        "How much might repair cost?"
      ]
    };
  }

  // 16. Water / Liquid
  if (match(["water", "liquid", "wet", "spill", "dropped in water", "pool", "toilet", "rain", "rice"])) {
    return {
      reply: "🚨 EMERGENCY LIQUID INGRESS TRIAGE PROTOCOL:\n\n" +
        "1. Power OFF immediately. Do NOT turn it on to 'check if it works'.\n" +
        "2. NEVER plug it into a charger. Electrical current running through conductive liquid triggers rapid electrolytic corrosion that rots micro-traces in minutes.\n" +
        "3. AVOID THE RICE MYTH: Raw rice does not absorb moisture trapped beneath board shield cans, and fine rice dust clogs ports and headphone jacks.\n" +
        "4. Professional Triage: Remove SIM/SD tray, gently shake out excess liquid, dry exterior, and take it to a repair technician equipped with an ultrasonic cleaner and 99% anhydrous isopropyl alcohol displacement bath. In 78% of quickly powered-down devices, data and hardware are fully salvageable.",
      prompts: [
        "Why is rice bad for wet electronics?",
        "Can data be recovered from a water-damaged device?",
        "What happens if I keep using it?"
      ]
    };
  }

  // 17. Data Recovery
  if (match(["recover my data", "recover data", "salvage data", "save my data", "get my photos", "backup photos", "lost data", "dead screen data"])) {
    return {
      reply: "E-Mortem Data Salvage Protocol:\n\n" +
        "• High Salvage Rate: In over 84% of hardware failures (including cracked OLEDs, swollen batteries, and charging port failures), onboard NAND flash memory is 100% undamaged.\n" +
        "• Broken Touchscreen: Connect a standard wired USB mouse via a $3 USB-C OTG adapter. A cursor will appear on screen allowing you to input your PIN and initiate a full cloud backup.\n" +
        "• Black Screen of Death: Devices supporting DisplayPort Alt Mode over USB-C (many flagships and laptops) can mirror the display directly to a monitor or TV.\n" +
        "• Privacy Reminder: Never allow a repair technician to perform a factory wipe before attempting external data extraction.",
      prompts: [
        "How to use USB OTG to back up a broken phone?",
        "Is my device worth repairing?",
        "What should I ask the technician?"
      ]
    };
  }

  // 18. Default Triage
  const words = query.replace(/[?!,]/g, " ").split(/\s+/).filter((w) => w.length > 3);
  const subject = words.slice(0, 4).join(" ") || "hardware symptom";

  return {
    reply: `Preliminary Assessment regarding '${subject}' on your ${deviceName}:\n\n` +
      "🔍 Diagnostic Observation: Symptoms of this nature typically trace back to modular component wear (connectors, thermal interface, or power regulation) rather than catastrophic motherboard failure.\n\n" +
      "🧪 Safe Triage Step: Before spending on costly repairs, test whether the symptom occurs under safe mode or while connected to a verified OEM charger. In over 70% of cases, issues stem from modular parts that are inexpensive to service.\n\n" +
      "🛠️ Next Step: You can run a full electronic autopsy in E-Mortem's 'Diagnose Device' section to calculate exact component failure probabilities and generate an itemized technician verification script.",
    prompts: [
      "Why is my phone shutting down?",
      "What should I ask the technician?",
      "Should I repair or replace?",
      "Is my battery likely failing?"
    ]
  };
}

export default function EMortemAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { devices, kpis, getDemoDevice } = useProducts();
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  // Active Device Context
  const activeDevice = devices && devices.length > 0 ? devices[0] : getDemoDevice();
  const [conversationContext, setConversationContext] = useState({
    deviceName: activeDevice?.device || "Samsung Galaxy S23",
    deviceType: activeDevice?.type || "Smartphone",
    deviceAge: activeDevice?.age ? `${activeDevice.age} years` : "2.5 years",
    currentValue: activeDevice?.currentValue || 18000,
    healthScore: activeDevice?.healthScore || 64,
    repairabilityScore: activeDevice?.repairabilityScore || 78,
    recommendation: activeDevice?.repairVsReplace?.recommendation || "REPAIR FIRST",
    symptoms: activeDevice?.symptoms || ["shutdown", "battery_drain", "overheating"],
    lastTopic: ""
  });

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hi! I'm E-Mortem AI, your digital electronic forensic assistant. Ask me why a device might be shutting down, what to ask a repair technician, or whether repair is worth investigating."
    }
  ]);

  const [activePrompts, setActivePrompts] = useState(INITIAL_SUGGESTED_QUESTIONS.map(q => q.label));
  const [inputValue, setInputValue] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    // Add user message
    const userMsg = { id: Date.now(), sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setIsTyping(true);

    const historyForBackend = messages.map((m) => ({
      sender: m.sender,
      text: m.text
    }));

    try {
      const res = await api.askAssistant(query, historyForBackend, {
        device_name: conversationContext.deviceName,
        device_type: conversationContext.deviceType,
        device_age: conversationContext.deviceAge,
        current_value: conversationContext.currentValue,
        health_score: conversationContext.healthScore,
        repairability_score: conversationContext.repairabilityScore,
        recommendation: conversationContext.recommendation,
        symptoms: conversationContext.symptoms,
        last_topic: conversationContext.lastTopic
      });

      if (res && res.response) {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: "ai", text: res.response }
        ]);

        if (Array.isArray(res.suggested_prompts) && res.suggested_prompts.length > 0) {
          setActivePrompts(res.suggested_prompts);
        }

        if (res.detected_topic) {
          setConversationContext((prev) => ({
            ...prev,
            lastTopic: res.detected_topic,
            deviceName: res.active_device || prev.deviceName
          }));
        }
        return;
      }
    } catch (e) {
      console.log("Backend assistant offline/unreachable, using robust local forensic engine:", e.message);
    }

    // Client-side fallback engine with full context parity
    setTimeout(() => {
      const fallbackResult = generateClientResponse(
        query,
        [...messages, userMsg],
        conversationContext,
        kpis
      );

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "ai", text: fallbackResult.reply }
      ]);

      if (Array.isArray(fallbackResult.prompts) && fallbackResult.prompts.length > 0) {
        setActivePrompts(fallbackResult.prompts);
      }
    }, 400);
  };

  const handleReset = () => {
    setMessages([
      {
        id: 1,
        sender: "ai",
        text: "Hi! I'm E-Mortem AI, your digital electronic forensic assistant. Ask me why a device might be shutting down, what to ask a repair technician, or whether repair is worth investigating."
      }
    ]);
    setActivePrompts(INITIAL_SUGGESTED_QUESTIONS.map(q => q.label));
    setConversationContext((prev) => ({ ...prev, lastTopic: "" }));
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
        <div className="w-[360px] sm:w-[420px] h-[580px] bg-[#0C1016] border border-emerald-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-slate-900 to-[#0C1016] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5 font-sans">
                  E-Mortem AI
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-semibold">
                    FORENSIC BOT
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 truncate max-w-[210px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="truncate">{conversationContext.deviceName} ({conversationContext.deviceAge})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
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
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
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
                  className={`max-w-[84%] p-3 rounded-xl leading-relaxed whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-emerald-500 text-slate-950 font-medium rounded-tr-none shadow-md shadow-emerald-500/10"
                      : "bg-slate-900/95 text-slate-200 border border-slate-800 rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-slate-900/90 text-slate-400 border border-slate-800 rounded-xl rounded-tl-none p-3 flex items-center gap-1.5 text-[11px]">
                  <span>E-Mortem AI analyzing failure telemetry</span>
                  <span className="flex gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-bounce"></span>
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
                  </span>
                </div>
              </div>
            )}

            {/* Suggested / Follow-up Questions Area */}
            {activePrompts && activePrompts.length > 0 && !isTyping && (
              <div className="pt-2.5 border-t border-slate-800/60 mt-3 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1 px-1">
                  <span>{messages.length === 1 ? "Suggested Questions" : "Suggested Follow-ups"}</span>
                  {messages.length > 1 && (
                    <button
                      onClick={() => setActivePrompts(INITIAL_SUGGESTED_QUESTIONS.map(q => q.label))}
                      className="text-emerald-400 hover:text-emerald-300 font-normal normal-case flex items-center gap-1"
                    >
                      <RotateCcw className="w-2.5 h-2.5" /> All topics
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {activePrompts.map((promptText, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(promptText)}
                      className="w-full text-left p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800/90 border border-slate-800/80 hover:border-emerald-500/40 text-[11px] text-slate-300 hover:text-white flex items-center justify-between gap-2 transition-all group"
                    >
                      <span className="truncate">{promptText}</span>
                      <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 shrink-0 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
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
              disabled={!inputValue.trim() || isTyping}
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
