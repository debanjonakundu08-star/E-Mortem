import { analyzeDevice } from "../utils/analysisEngine";

export const INITIAL_DEVICES = [
  // 01. The Primary Demo Device: Samsung Galaxy S23
  analyzeDevice({
    id: "EM-2026-1024",
    type: "Smartphone",
    brand: "Samsung",
    model: "Galaxy S23",
    purchaseDate: "March 2024",
    age: 2.5,
    purchasePrice: 74999,
    currentValue: 18000,
    currentCondition: "Frequently crashing",
    symptoms: ["shutdown", "battery_drain", "overheating", "sluggish"],
    userStory: "Problems started five days ago. The device was lightly dropped two weeks ago but continued functioning normally afterward. It heats during regular use and shuts down randomly at 40% battery.",
    priorEvent: "Device was dropped",
    priorEventDetails: "Light drop two weeks ago, screen intact."
  }),

  // 02. Dell Inspiron 15
  analyzeDevice({
    id: "EM-2026-1025",
    type: "Laptop",
    brand: "Dell",
    model: "Inspiron 15 3501",
    purchaseDate: "September 2023",
    age: 3.0,
    purchasePrice: 58000,
    currentValue: 20000,
    currentCondition: "Working with problems",
    symptoms: ["overheating", "sluggish"],
    userStory: "Laptop runs loud fan noises and thermal throttles during video calls. Cooling vents accumulated dust.",
    priorEvent: "Battery gradually degraded"
  }),

  // 03. Sony WH-1000XM4
  analyzeDevice({
    id: "EM-2026-1026",
    type: "Headphones",
    brand: "Sony",
    model: "WH-1000XM4",
    purchaseDate: "August 2023",
    age: 3.1,
    purchasePrice: 24990,
    currentValue: 8000,
    currentCondition: "Barely usable",
    symptoms: ["battery_drain"],
    userStory: "ANC works on auxiliary cable, but internal Bluetooth battery discharges from 100% to zero in 15 minutes.",
    priorEvent: "Battery gradually degraded"
  }),

  // 04. OnePlus 11R
  analyzeDevice({
    id: "EM-2026-1027",
    type: "Smartphone",
    brand: "OnePlus",
    model: "11R 5G",
    purchaseDate: "January 2024",
    age: 2.2,
    purchasePrice: 39999,
    currentValue: 16000,
    currentCondition: "Working with problems",
    symptoms: ["charging", "sluggish"],
    userStory: "SuperVOOC 100W fast charging connects and disconnects intermittently. USB-C port has slight wiggle.",
    priorEvent: "Charging problem"
  }),

  // 05. Apple MacBook Air M1
  analyzeDevice({
    id: "EM-2026-1028",
    type: "Laptop",
    brand: "Apple",
    model: "MacBook Air (M1, 2020)",
    purchaseDate: "June 2023",
    age: 3.2,
    purchasePrice: 88900,
    currentValue: 42000,
    currentCondition: "Partially working",
    symptoms: ["screen"],
    userStory: "Closed lid with pen resting on palmrest; front glass shows hairline crack. Retina LCD underneath displays fine.",
    priorEvent: "Device was dropped"
  }),

  // 06. HP LaserJet 1020 Plus
  analyzeDevice({
    id: "EM-2026-1029",
    type: "Printer",
    brand: "HP",
    model: "LaserJet 1020 Plus",
    purchaseDate: "February 2022",
    age: 4.5,
    purchasePrice: 14500,
    currentValue: 5000,
    currentCondition: "Partially working",
    symptoms: ["sluggish", "physical"],
    userStory: "Rubber pickup roller dried out; frequently reports false paper jam notifications.",
    priorEvent: "No obvious event"
  }),

  // 07. Apple iPad 9th Gen
  analyzeDevice({
    id: "EM-2026-1030",
    type: "Tablet",
    brand: "Apple",
    model: "iPad (9th Gen) 64GB",
    purchaseDate: "November 2023",
    age: 2.8,
    purchasePrice: 30900,
    currentValue: 14000,
    currentCondition: "Partially working",
    symptoms: ["screen"],
    userStory: "Cracked non-laminated front glass digitizer from corner impact. Internal LCD panel is completely intact.",
    priorEvent: "Device was dropped"
  }),

  // 08. LG UltraGear 27"
  analyzeDevice({
    id: "EM-2026-1031",
    type: "Monitor",
    brand: "LG",
    model: "27GL850 UltraGear",
    purchaseDate: "March 2022",
    age: 4.2,
    purchasePrice: 36000,
    currentValue: 12000,
    currentCondition: "Not working",
    symptoms: ["shutdown"],
    userStory: "Monitor power LED blinks once and powers off. Internal 16V capacitors on power rail require replacement.",
    priorEvent: "No obvious event"
  }),

  // 09. boAt Rockerz 550
  analyzeDevice({
    id: "EM-2026-1032",
    type: "Headphones",
    brand: "boAt",
    model: "Rockerz 550",
    purchaseDate: "May 2024",
    age: 2.0,
    purchasePrice: 1999,
    currentValue: 400,
    currentCondition: "Not working",
    symptoms: ["physical"],
    userStory: "Plastic folding hinge snapped during daily commute, severing delicate copper audio leads.",
    priorEvent: "Device was dropped"
  })
];
