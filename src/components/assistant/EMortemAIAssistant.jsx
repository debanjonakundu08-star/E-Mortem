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
  RotateCcw,
  Edit3,
  Plus,
  Laptop,
  Tablet,
  Headphones,
  Watch,
  Monitor,
  Tv,
  Plug,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { analyzeDevice } from "../../utils/analysisEngine";
import api from "../../services/api";

export function getDeviceIcon(type) {
  const t = (type || "").toLowerCase();
  if (t.includes("laptop") || t.includes("macbook") || t.includes("pc")) return Laptop;
  if (t.includes("tablet") || t.includes("ipad")) return Tablet;
  if (t.includes("headphone") || t.includes("audio")) return Headphones;
  if (t.includes("earbud") || t.includes("buds") || t.includes("airpods")) return Headphones;
  if (t.includes("watch") || t.includes("wearable")) return Watch;
  if (t.includes("tv") || t.includes("television")) return Tv;
  if (t.includes("monitor") || t.includes("display")) return Monitor;
  if (t.includes("plug") || t.includes("other")) return Plug;
  return Smartphone;
}

export function getDeviceShutdownPrompt(type) {
  const t = (type || "phone").toLowerCase();
  if (t.includes("earbud") || t.includes("headphone")) {
    return `Why are my ${t} shutting down?`;
  }
  return `Why is my ${t === "smartphone" ? "phone" : t} shutting down?`;
}

export function getDevicePrompts(type, symptoms = []) {
  const shutdownLabel = getDeviceShutdownPrompt(type);
  const prompts = [
    shutdownLabel,
    "What should I ask the technician?",
    "Should I repair or replace?",
    "What should I backup first?",
    "Is my battery likely failing?",
    "What could have caused this problem?"
  ];
  return prompts;
}

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
  const brand = context?.brand || "";
  const model = context?.model || "";
  const deviceType = context?.deviceType || "Device";
  const deviceName = context?.deviceName || (brand || model ? `${brand} ${model}`.trim() : (context?.deviceType ? `Your ${context.deviceType}` : "Your device"));
  const deviceAge = context?.deviceAge || (context?.purchaseDate ? `purchased ${context.purchaseDate}` : "recently reported");
  const currentValue = context?.currentValue || 15000;
  const healthScore = context?.healthScore || 68;
  const repairabilityScore = context?.repairabilityScore || 75;
  const recommendation = context?.recommendation || "REPAIR FIRST";
  const symptoms = context?.symptoms || ["battery_drain", "shutdown"];
  const symptomsStr = Array.isArray(symptoms) ? symptoms.join(", ") : String(symptoms);
  const priorEvent = context?.priorEvent || "No obvious event";

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

const DEVICE_TYPE_OPTIONS = [
  "Phone",
  "Laptop",
  "Tablet",
  "Earbuds",
  "Headphones",
  "Smartwatch",
  "TV",
  "Monitor",
  "Other"
];

const COMPACT_SYMPTOMS = [
  { id: "battery_drain", label: "Battery drains quickly" },
  { id: "shutdown", label: "Random shutdowns" },
  { id: "overheating", label: "Device overheating" },
  { id: "charging", label: "Charging problems" },
  { id: "sluggish", label: "Slow / sluggish" },
  { id: "screen", label: "Screen / display issue" },
  { id: "restart", label: "Unexpected restarts" },
  { id: "audio", label: "Speaker / mic issue" },
  { id: "physical", label: "Physical / drop damage" },
  { id: "other", label: "Other symptoms" }
];

const TIMELINE_OPTIONS = [
  "Today / Just started",
  "A few days ago",
  "1–2 weeks ago",
  "Over a month ago",
  "Gradual deterioration"
];

const PREVIOUS_REPAIRS_OPTIONS = [
  "No previous repairs",
  "Screen was previously replaced",
  "Battery was previously replaced",
  "Third-party repair attempted",
  "Prior liquid / water exposure",
  "Prior chassis / drop impact"
];

const PRIOR_EVENTS_OPTIONS = [
  "No obvious event",
  "Device was dropped",
  "Device got wet or exposed to liquid",
  "Recent software / OS update",
  "Installed new application",
  "Used third-party charger / cable",
  "Device became unusually hot",
  "Other"
];

export default function EMortemAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { devices, kpis } = useProducts();
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  // Active Device State (retrieved from localStorage or set via setup/select)
  const [activeDevice, setActiveDevice] = useState(() => {
    try {
      const saved = localStorage.getItem("e_mortem_active_chatbot_device");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  // View Modes: "chat" | "setup" | "select"
  const [viewMode, setViewMode] = useState(() => {
    try {
      const saved = localStorage.getItem("e_mortem_active_chatbot_device");
      if (saved) return "chat";
    } catch (e) {}
    return devices && devices.length > 0 ? "select" : "setup";
  });

  // Form State for compact device setup
  const [formData, setFormData] = useState({
    type: "Phone",
    brand: "",
    model: "",
    purchaseDate: "",
    purchasePrice: "",
    symptoms: ["battery_drain"],
    problemStarted: "A few days ago",
    previousRepairs: "No previous repairs",
    whatHappenedBefore: "No obvious event"
  });
  const [formError, setFormError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Conversation Context
  const [conversationContext, setConversationContext] = useState(() => {
    try {
      const saved = localStorage.getItem("e_mortem_active_chatbot_device");
      if (saved) {
        const d = JSON.parse(saved);
        const name = `${d.brand || ''} ${d.model || d.device || ''}`.trim() || "Your device";
        const age = d.age ? `${d.age} years` : d.purchaseDate ? `purchased ${d.purchaseDate}` : "recently reported";
        return {
          deviceName: name,
          deviceType: d.type || "Phone",
          brand: d.brand || "",
          model: d.model || "",
          deviceAge: age,
          purchaseDate: d.purchaseDate || "",
          currentValue: d.currentValue || 18000,
          healthScore: d.healthScore || 64,
          repairabilityScore: d.repairabilityScore || 78,
          recommendation: d.repairVsReplace?.recommendation || "REPAIR FIRST",
          symptoms: d.symptoms || ["battery_drain", "shutdown"],
          priorEvent: d.priorEvent || "No obvious event",
          problemStarted: d.userStory || "A few days ago",
          previousRepairs: d.previousRepairs || "No previous repairs",
          lastTopic: ""
        };
      }
    } catch (e) {}

    return {
      deviceName: "",
      deviceType: "Phone",
      brand: "",
      model: "",
      deviceAge: "",
      purchaseDate: "",
      currentValue: 15000,
      healthScore: 68,
      repairabilityScore: 75,
      recommendation: "REPAIR FIRST",
      symptoms: ["battery_drain"],
      priorEvent: "No obvious event",
      problemStarted: "A few days ago",
      previousRepairs: "No previous repairs",
      lastTopic: ""
    };
  });

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("e_mortem_active_chatbot_device");
      if (saved) {
        const d = JSON.parse(saved);
        const name = `${d.brand || ''} ${d.model || d.device || ''}`.trim();
        return [
          {
            id: 1,
            sender: "ai",
            text: `Forensic telemetry profile active for ${name}.\nHow can I help you investigate this device today?`
          }
        ];
      }
    } catch (e) {}

    return [
      {
        id: 1,
        sender: "ai",
        text: "Hi! I'm E-Mortem AI, your digital electronic forensic assistant. Ask me why a device might be shutting down, what to ask a repair technician, or whether repair is worth investigating."
      }
    ];
  });

  const [activePrompts, setActivePrompts] = useState(() => {
    return getDevicePrompts(conversationContext.deviceType, conversationContext.symptoms);
  });
  const [inputValue, setInputValue] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && viewMode === "chat") {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen, viewMode]);

  const toggleSymptom = (symId) => {
    setFormData((prev) => {
      const exists = prev.symptoms.includes(symId);
      const next = exists
        ? prev.symptoms.filter((s) => s !== symId)
        : [...prev.symptoms, symId];
      return {
        ...prev,
        symptoms: next.length > 0 ? next : [symId]
      };
    });
  };

  const handleOpenEditProfile = () => {
    const active = activeDevice;
    setFormData({
      type: conversationContext.deviceType === "Smartphone" ? "Phone" : (conversationContext.deviceType || "Phone"),
      brand: conversationContext.brand || active?.brand || "",
      model: conversationContext.model || active?.model || "",
      purchaseDate: conversationContext.purchaseDate || active?.purchaseDate || "",
      purchasePrice: active?.purchasePrice ? String(active.purchasePrice) : "",
      symptoms: Array.isArray(conversationContext.symptoms) && conversationContext.symptoms.length > 0
        ? conversationContext.symptoms
        : ["battery_drain"],
      problemStarted: conversationContext.problemStarted || "A few days ago",
      previousRepairs: conversationContext.previousRepairs || "No previous repairs",
      whatHappenedBefore: conversationContext.priorEvent || "No obvious event"
    });
    setFormError("");
    setIsEditing(true);
    setViewMode("setup");
  };

  const handleOpenChangeDevice = () => {
    setViewMode("select");
  };

  const handleOpenNewProfile = () => {
    setFormData({
      type: "Phone",
      brand: "",
      model: "",
      purchaseDate: "",
      purchasePrice: "",
      symptoms: ["battery_drain"],
      problemStarted: "A few days ago",
      previousRepairs: "No previous repairs",
      whatHappenedBefore: "No obvious event"
    });
    setFormError("");
    setIsEditing(false);
    setViewMode("setup");
  };

  const handleSelectSavedDevice = (dev) => {
    setActiveDevice(dev);
    try {
      localStorage.setItem("e_mortem_active_chatbot_device", JSON.stringify(dev));
    } catch (err) {}

    const devName = `${dev.brand || ''} ${dev.model || dev.device || ''}`.trim() || dev.device || "Your device";
    const devAge = dev.age ? `${dev.age} years` : dev.purchaseDate ? `purchased ${dev.purchaseDate}` : "2 years";
    const devSymptoms = dev.symptoms || ["battery_drain", "shutdown"];

    setConversationContext({
      deviceName: devName,
      deviceType: dev.type || "Smartphone",
      brand: dev.brand || "",
      model: dev.model || "",
      deviceAge: devAge,
      purchaseDate: dev.purchaseDate || "",
      currentValue: dev.currentValue || 18000,
      healthScore: dev.healthScore || 64,
      repairabilityScore: dev.repairabilityScore || 78,
      recommendation: dev.repairVsReplace?.recommendation || "REPAIR FIRST",
      symptoms: devSymptoms,
      priorEvent: dev.priorEvent || "No obvious event",
      problemStarted: dev.userStory || "",
      previousRepairs: dev.previousRepairs || "No",
      lastTopic: ""
    });

    setActivePrompts(getDevicePrompts(dev.type, devSymptoms));

    setMessages([
      {
        id: Date.now(),
        sender: "ai",
        text: `Device profile loaded ✓\nForensic investigation active for ${devName} (${devAge}). How can I assist with your triage?`
      }
    ]);

    setViewMode("chat");
  };

  const handleSubmitProfile = (e) => {
    if (e) e.preventDefault();
    if (!formData.brand.trim() || !formData.model.trim()) {
      setFormError("Please enter both Brand and Model.");
      return;
    }
    setFormError("");

    const formattedType = formData.type === "Phone" ? "Smartphone" : formData.type;
    const deviceId = isEditing && activeDevice?.id
      ? activeDevice.id
      : `EM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newDeviceData = {
      id: deviceId,
      type: formattedType,
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      purchaseDate: formData.purchaseDate.trim() || String(new Date().getFullYear()),
      purchasePrice: Number(formData.purchasePrice) || 0,
      currentCondition: "Working with problems",
      symptoms: formData.symptoms.length > 0 ? formData.symptoms : ["battery_drain"],
      userStory: `Problem started ${formData.problemStarted}. Immediately before: ${formData.whatHappenedBefore}. Previous repairs: ${formData.previousRepairs}.`,
      priorEvent: formData.whatHappenedBefore,
      previousRepairs: formData.previousRepairs
    };

    const analyzed = analyzeDevice(newDeviceData);
    setActiveDevice(analyzed);
    try {
      localStorage.setItem("e_mortem_active_chatbot_device", JSON.stringify(analyzed));
    } catch (err) {}

    const devName = `${newDeviceData.brand} ${newDeviceData.model}`.trim();
    const devAge = newDeviceData.purchaseDate ? `purchased ${newDeviceData.purchaseDate}` : "recently reported";

    setConversationContext({
      deviceName: devName,
      deviceType: newDeviceData.type,
      brand: newDeviceData.brand,
      model: newDeviceData.model,
      deviceAge: devAge,
      purchaseDate: newDeviceData.purchaseDate,
      currentValue: analyzed.currentValue || 18000,
      healthScore: analyzed.healthScore || 68,
      repairabilityScore: analyzed.repairabilityScore || 75,
      recommendation: analyzed.repairVsReplace?.recommendation || "REPAIR FIRST",
      symptoms: newDeviceData.symptoms,
      priorEvent: newDeviceData.priorEvent,
      problemStarted: formData.problemStarted,
      previousRepairs: formData.previousRepairs,
      lastTopic: ""
    });

    const dynamicPrompts = getDevicePrompts(newDeviceData.type, newDeviceData.symptoms);
    setActivePrompts(dynamicPrompts);

    if (isEditing) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "ai",
          text: `Device profile updated ✓\nUpdated forensic telemetry for ${devName} (${devAge}).\nActive symptoms: ${newDeviceData.symptoms.join(", ")}.`
        }
      ]);
    } else {
      setMessages([
        {
          id: Date.now(),
          sender: "ai",
          text: "Device profile created ✓"
        },
        {
          id: Date.now() + 1,
          sender: "ai",
          text: `Forensic telemetry profile active for ${devName} (${devAge}).\n\n` +
            `• Reported Symptoms: ${newDeviceData.symptoms.join(", ")}\n` +
            `• Preceding Event: ${newDeviceData.priorEvent}\n` +
            `• Preliminary Health Index: ${analyzed.healthScore}/100 • Verdict: ${analyzed.repairVsReplace?.recommendation || 'REPAIR FIRST'}\n\n` +
            `How can I help you investigate your ${devName}?`
        }
      ]);
    }

    setIsEditing(false);
    setViewMode("chat");
  };

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
        brand: conversationContext.brand,
        model: conversationContext.model,
        device_age: conversationContext.deviceAge,
        purchase_date: conversationContext.purchaseDate,
        current_value: conversationContext.currentValue,
        health_score: conversationContext.healthScore,
        repairability_score: conversationContext.repairabilityScore,
        recommendation: conversationContext.recommendation,
        symptoms: conversationContext.symptoms,
        prior_event: conversationContext.priorEvent,
        problem_started: conversationContext.problemStarted,
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
    const devName = conversationContext.deviceName || "your device";
    setMessages([
      {
        id: 1,
        sender: "ai",
        text: `Hi! I'm E-Mortem AI. Ready to investigate ${devName}. Ask me why it might be shutting down, what to ask a repair technician, or whether repair is worth investigating.`
      }
    ]);
    setActivePrompts(getDevicePrompts(conversationContext.deviceType, conversationContext.symptoms));
    setConversationContext((prev) => ({ ...prev, lastTopic: "" }));
  };

  const ActiveDeviceIcon = getDeviceIcon(conversationContext.deviceType);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-glow-teal hover:scale-105 active:scale-95 transition-all"
        >
          <Bot className="w-5 h-5" />
          <span>E-Mortem AI</span>
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
        </button>
      )}

      {/* Assistant Modal / Drawer */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[580px] bg-charcoal-950/95 border border-teal-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-charcoal-900 to-charcoal-950 border-b border-charcoal-800 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-2 rounded-xl bg-teal-500/15 text-teal-300 border border-teal-500/30 shrink-0 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white flex items-center gap-1.5 font-sans">
                  <span>E-Mortem AI</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono font-semibold">
                    FORENSIC ASSISTANT
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1 truncate max-w-[200px]">
                  {conversationContext.deviceName ? (
                    <>
                      <ActiveDeviceIcon className="w-3 h-3 text-teal-400 shrink-0" />
                      <span className="truncate text-slate-300 font-medium">{conversationContext.deviceName} ({conversationContext.deviceAge})</span>
                    </>
                  ) : (
                    <span className="text-amber-400/90 font-mono">No active device profile</span>
                  )}
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {viewMode === "chat" && conversationContext.deviceName && (
                <>
                  <button
                    onClick={handleOpenEditProfile}
                    title="Edit Device Profile"
                    className="px-2 py-1 text-[10px] font-semibold text-teal-300 hover:text-white rounded-lg hover:bg-teal-500/10 border border-teal-500/30 flex items-center gap-1 transition-all"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    onClick={handleOpenChangeDevice}
                    title="Change Device"
                    className="px-2 py-1 text-[10px] font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-charcoal-800 border border-charcoal-700 flex items-center gap-1 transition-all"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span className="hidden sm:inline">Change</span>
                  </button>
                </>
              )}

              {viewMode !== "chat" && activeDevice && (
                <button
                  onClick={() => setViewMode("chat")}
                  className="px-2 py-1 text-[10px] font-semibold text-slate-300 hover:text-white rounded-lg bg-charcoal-800 border border-charcoal-700 transition-all"
                >
                  Chat
                </button>
              )}

              {viewMode === "chat" && (
                <button
                  onClick={handleReset}
                  title="Reset conversation"
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-charcoal-800 transition-colors"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-charcoal-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* VIEW 1: COMPACT DEVICE PROFILE SETUP */}
          {viewMode === "setup" && (
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs bg-charcoal-950">
              <div className="pb-2 border-b border-charcoal-800">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  {isEditing ? "Edit Device Profile" : "Set Up Device Profile"}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isEditing
                    ? "Update hardware specifications and reported symptoms."
                    : "Enter your device information so E-Mortem AI can run custom postmortem triage."}
                </p>
              </div>

              <form onSubmit={handleSubmitProfile} className="space-y-2.5">
                {/* Device Type */}
                <div>
                  <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                    Device Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-charcoal-900 border border-charcoal-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-teal-400"
                  >
                    {DEVICE_TYPE_OPTIONS.map((t) => (
                      <option key={t} value={t} className="bg-charcoal-900 text-white">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand & Model */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                      Brand *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. OnePlus, Apple"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full bg-charcoal-900 border border-charcoal-800 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                      Model *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 12, MacBook M2"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="w-full bg-charcoal-900 border border-charcoal-800 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                {/* Purchase Date/Year & Purchase Price */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                      Date / Year of Purchase
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2025 or Mar 2024"
                      value={formData.purchaseDate}
                      onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                      className="w-full bg-charcoal-900 border border-charcoal-800 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                      Purchase Price (optional)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 64999"
                      value={formData.purchasePrice}
                      onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                      className="w-full bg-charcoal-900 border border-charcoal-800 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                {/* Current problem / symptoms */}
                <div>
                  <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                    Current Problem / Symptoms *
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {COMPACT_SYMPTOMS.map((s) => {
                      const isSelected = formData.symptoms.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => toggleSymptom(s.id)}
                          className={`text-left p-2 rounded-xl border text-[10px] transition-all flex items-center justify-between ${
                            isSelected
                              ? "bg-teal-500/20 border-teal-500 text-teal-300 font-semibold"
                              : "bg-charcoal-900 border-charcoal-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <span className="truncate">{s.label}</span>
                          {isSelected && <CheckCircle2 className="w-3 h-3 text-teal-400 shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* When the problem started */}
                <div>
                  <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                    When the problem started
                  </label>
                  <select
                    value={formData.problemStarted}
                    onChange={(e) => setFormData({ ...formData, problemStarted: e.target.value })}
                    className="w-full bg-charcoal-900 border border-charcoal-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-teal-400"
                  >
                    {TIMELINE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-charcoal-900 text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Previous repairs / damage */}
                <div>
                  <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                    Previous repairs / damage (optional)
                  </label>
                  <select
                    value={formData.previousRepairs}
                    onChange={(e) => setFormData({ ...formData, previousRepairs: e.target.value })}
                    className="w-full bg-charcoal-900 border border-charcoal-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-teal-400"
                  >
                    {PREVIOUS_REPAIRS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-charcoal-900 text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* What happened immediately before the problem */}
                <div>
                  <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                    What happened immediately before the problem
                  </label>
                  <select
                    value={formData.whatHappenedBefore}
                    onChange={(e) => setFormData({ ...formData, whatHappenedBefore: e.target.value })}
                    className="w-full bg-charcoal-900 border border-charcoal-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-teal-400"
                  >
                    {PRIOR_EVENTS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-charcoal-900 text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {formError && (
                  <div className="text-[11px] text-rose-300 flex items-center gap-1.5 bg-rose-500/15 border border-rose-500/30 rounded-xl p-2.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-bold text-xs shadow-glow-teal hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isEditing ? "Save & Update Profile" : "Save Profile & Investigate"}</span>
                  </button>

                  {devices && devices.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setViewMode("select")}
                      className="w-full py-2 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 border border-charcoal-800 text-slate-400 hover:text-white text-xs transition-colors text-center"
                    >
                      Choose from Saved Devices
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* VIEW 2: SELECT SAVED DEVICE */}
          {viewMode === "select" && (
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs bg-charcoal-950">
              <div className="pb-2 border-b border-charcoal-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Select a device to investigate
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Choose a saved hardware record to begin or switch autopsy triage.
                  </p>
                </div>
              </div>

              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {devices && devices.length > 0 ? (
                  devices.map((dev) => {
                    const Icon = getDeviceIcon(dev.type);
                    const isCurrent = activeDevice?.id === dev.id;
                    const dName = `${dev.brand || ''} ${dev.model || dev.device || ''}`.trim() || dev.device;
                    return (
                      <div
                        key={dev.id}
                        onClick={() => handleSelectSavedDevice(dev)}
                        className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                          isCurrent
                            ? "bg-teal-500/15 border-teal-500/60 shadow-sm shadow-teal-500/10"
                            : "bg-charcoal-900 border-charcoal-800 hover:border-teal-500/40 hover:bg-charcoal-800/80"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-charcoal-800 flex items-center justify-center text-teal-400 shrink-0 border border-charcoal-700">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                              <span className="truncate">{dName}</span>
                              {isCurrent && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate mt-0.5">
                              {dev.type} • {dev.age ? `${dev.age} yrs` : dev.purchaseDate || "Registered"} • Health: {dev.healthScore || 64}/100
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No saved devices found in registry.
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-charcoal-800">
                <button
                  type="button"
                  onClick={handleOpenNewProfile}
                  className="w-full py-2.5 rounded-xl border border-dashed border-teal-500/40 hover:border-teal-400 text-teal-300 hover:text-teal-200 bg-teal-500/5 hover:bg-teal-500/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Set Up New Device Profile</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW 3: CHAT CONVERSATION */}
          {viewMode === "chat" && (
            <>
              {/* Messages Area */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs bg-charcoal-950">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.sender === "ai" && (
                      <div className="w-7 h-7 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[84%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-medium rounded-tr-none shadow-glow-teal"
                          : "bg-charcoal-900/90 text-slate-200 border border-charcoal-800 rounded-tl-none shadow-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-2.5 justify-start">
                    <div className="w-7 h-7 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Bot className="w-3.5 h-3.5 animate-spin" />
                    </div>
                    <div className="bg-charcoal-900/90 text-slate-400 border border-charcoal-800 rounded-2xl rounded-tl-none p-3 flex items-center gap-1.5 text-[11px]">
                      <span>E-Mortem AI analyzing failure telemetry</span>
                      <span className="flex gap-0.5">
                        <span className="w-1 h-1 rounded-full bg-teal-400 animate-bounce"></span>
                        <span className="w-1 h-1 rounded-full bg-teal-400 animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1 h-1 rounded-full bg-teal-400 animate-bounce [animation-delay:0.4s]"></span>
                      </span>
                    </div>
                  </div>
                )}

                {/* Suggested / Follow-up Questions Area */}
                {activePrompts && activePrompts.length > 0 && !isTyping && (
                  <div className="pt-2 border-t border-charcoal-800 mt-2.5 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1 px-1">
                      <span>{messages.length <= 2 ? "Suggested Questions" : "Suggested Follow-ups"}</span>
                      {messages.length > 2 && (
                        <button
                          onClick={() => setActivePrompts(getDevicePrompts(conversationContext.deviceType, conversationContext.symptoms))}
                          className="text-teal-400 hover:text-teal-300 font-normal normal-case flex items-center gap-1"
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
                          className="w-full text-left p-2.5 rounded-xl bg-charcoal-900/80 hover:bg-charcoal-850 border border-charcoal-800 hover:border-teal-500/40 text-[11px] text-slate-300 hover:text-white flex items-center justify-between gap-2 transition-all group"
                        >
                          <span className="truncate">{promptText}</span>
                          <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-teal-400 shrink-0 transition-colors" />
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
                className="p-3 bg-charcoal-950 border-t border-charcoal-800 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Ask E-Mortem AI about ${conversationContext.deviceName || 'your device'}...`}
                  className="flex-1 bg-charcoal-900 border border-charcoal-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 hover:opacity-90 disabled:opacity-40 transition-all shrink-0 font-semibold shadow-glow-teal"
                >
                  <Send className="w-3.5 h-3.5 text-slate-950" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
