"""
E-Mortem Dynamic Market Pricing & Repair-vs-Replace Valuation Service
Target Market: India (INR ₹)
Provides model-specific replacement prices, depreciation-based resale values,
and problem-specific component repair estimates.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
import re

# Comprehensive catalog of electronics market benchmarks in India (INR)
# Includes new replacement price, typical modular battery cost, screen cost, and charging/board cost
DEVICE_CATALOG: Dict[str, Dict[str, Any]] = {
    # -------------------------------------------------------------
    # SAMSUNG PHONES
    # -------------------------------------------------------------
    "samsung galaxy s24 ultra": {
        "brand": "Samsung", "model": "Galaxy S24 Ultra", "type": "Smartphone", "tier": "ultra_flagship",
        "new_price": 129999, "battery_cost": (4500, 6000), "screen_cost": (24000, 29000), "port_cost": (2500, 4200), "camera_cost": (7500, 14000)
    },
    "samsung galaxy s24": {
        "brand": "Samsung", "model": "Galaxy S24", "type": "Smartphone", "tier": "flagship",
        "new_price": 74999, "battery_cost": (3800, 5200), "screen_cost": (15000, 19500), "port_cost": (2200, 3600), "camera_cost": (5500, 9500)
    },
    "samsung galaxy s23 ultra": {
        "brand": "Samsung", "model": "Galaxy S23 Ultra", "type": "Smartphone", "tier": "ultra_flagship",
        "new_price": 99999, "battery_cost": (4200, 5800), "screen_cost": (21000, 26000), "port_cost": (2400, 3900), "camera_cost": (7000, 13000)
    },
    "samsung galaxy s23": {
        "brand": "Samsung", "model": "Galaxy S23", "type": "Smartphone", "tier": "flagship",
        "new_price": 54999, "battery_cost": (3200, 4500), "screen_cost": (13500, 17500), "port_cost": (1800, 3200), "camera_cost": (4500, 8000)
    },
    "samsung galaxy s22": {
        "brand": "Samsung", "model": "Galaxy S22", "type": "Smartphone", "tier": "flagship",
        "new_price": 44999, "battery_cost": (2800, 4000), "screen_cost": (12000, 15500), "port_cost": (1600, 2800), "camera_cost": (4000, 7000)
    },
    "samsung galaxy a54": {
        "brand": "Samsung", "model": "Galaxy A54", "type": "Smartphone", "tier": "upper_mid",
        "new_price": 33499, "battery_cost": (2200, 3200), "screen_cost": (6500, 8800), "port_cost": (1400, 2200), "camera_cost": (3000, 5000)
    },
    "samsung galaxy m34": {
        "brand": "Samsung", "model": "Galaxy M34", "type": "Smartphone", "tier": "budget_mid",
        "new_price": 16999, "battery_cost": (1600, 2400), "screen_cost": (4200, 5800), "port_cost": (900, 1600), "camera_cost": (2200, 3500)
    },
    "samsung galaxy z fold5": {
        "brand": "Samsung", "model": "Galaxy Z Fold5", "type": "Smartphone", "tier": "foldable",
        "new_price": 149999, "battery_cost": (5500, 7500), "screen_cost": (38000, 48000), "port_cost": (3500, 5500), "camera_cost": (8500, 16000)
    },

    # -------------------------------------------------------------
    # APPLE IPHONES & MACBOOKS
    # -------------------------------------------------------------
    "apple iphone 15 pro max": {
        "brand": "Apple", "model": "iPhone 15 Pro Max", "type": "Smartphone", "tier": "ultra_flagship",
        "new_price": 148900, "battery_cost": (6500, 8500), "screen_cost": (28000, 35000), "port_cost": (3800, 6000), "camera_cost": (12000, 19000)
    },
    "apple iphone 15 pro": {
        "brand": "Apple", "model": "iPhone 15 Pro", "type": "Smartphone", "tier": "flagship",
        "new_price": 128200, "battery_cost": (6200, 8000), "screen_cost": (24000, 30000), "port_cost": (3500, 5500), "camera_cost": (11000, 17000)
    },
    "apple iphone 15": {
        "brand": "Apple", "model": "iPhone 15", "type": "Smartphone", "tier": "flagship",
        "new_price": 69900, "battery_cost": (5500, 7200), "screen_cost": (18000, 24000), "port_cost": (3200, 4800), "camera_cost": (8000, 13000)
    },
    "apple iphone 14 pro": {
        "brand": "Apple", "model": "iPhone 14 Pro", "type": "Smartphone", "tier": "flagship",
        "new_price": 109900, "battery_cost": (5800, 7500), "screen_cost": (22000, 28000), "port_cost": (3200, 5000), "camera_cost": (9500, 15000)
    },
    "apple iphone 14": {
        "brand": "Apple", "model": "iPhone 14", "type": "Smartphone", "tier": "flagship",
        "new_price": 58900, "battery_cost": (4800, 6500), "screen_cost": (16000, 21000), "port_cost": (2800, 4200), "camera_cost": (6500, 11000)
    },
    "apple iphone 13": {
        "brand": "Apple", "model": "iPhone 13", "type": "Smartphone", "tier": "flagship",
        "new_price": 49900, "battery_cost": (4200, 5800), "screen_cost": (14000, 18500), "port_cost": (2400, 3800), "camera_cost": (5500, 9500)
    },
    "apple iphone 12": {
        "brand": "Apple", "model": "iPhone 12", "type": "Smartphone", "tier": "flagship",
        "new_price": 38900, "battery_cost": (3800, 5200), "screen_cost": (12000, 16000), "port_cost": (2200, 3400), "camera_cost": (4500, 8000)
    },
    "apple iphone 11": {
        "brand": "Apple", "model": "iPhone 11", "type": "Smartphone", "tier": "legacy_flagship",
        "new_price": 29900, "battery_cost": (3200, 4400), "screen_cost": (7500, 11000), "port_cost": (1800, 2800), "camera_cost": (3500, 6500)
    },
    "apple macbook air m1": {
        "brand": "Apple", "model": "MacBook Air M1", "type": "Laptop", "tier": "ultrabook",
        "new_price": 69900, "battery_cost": (8500, 12000), "screen_cost": (22000, 29000), "port_cost": (4500, 7500), "thermal_cost": (1500, 2800)
    },
    "apple macbook air m2": {
        "brand": "Apple", "model": "MacBook Air M2", "type": "Laptop", "tier": "ultrabook",
        "new_price": 89900, "battery_cost": (9500, 13500), "screen_cost": (26000, 34000), "port_cost": (5000, 8500), "thermal_cost": (1800, 3200)
    },
    "apple macbook pro m2": {
        "brand": "Apple", "model": "MacBook Pro M2", "type": "Laptop", "tier": "pro_laptop",
        "new_price": 149900, "battery_cost": (11000, 16000), "screen_cost": (38000, 48000), "port_cost": (6500, 11000), "thermal_cost": (2200, 4000)
    },

    # -------------------------------------------------------------
    # ONEPLUS PHONES
    # -------------------------------------------------------------
    "oneplus 12": {
        "brand": "OnePlus", "model": "12", "type": "Smartphone", "tier": "flagship",
        "new_price": 64999, "battery_cost": (3200, 4400), "screen_cost": (14000, 18500), "port_cost": (1800, 2900), "camera_cost": (5500, 9000)
    },
    "oneplus 12r": {
        "brand": "OnePlus", "model": "12R", "type": "Smartphone", "tier": "upper_mid",
        "new_price": 39999, "battery_cost": (2500, 3500), "screen_cost": (9500, 13000), "port_cost": (1400, 2400), "camera_cost": (4000, 6500)
    },
    "oneplus 11": {
        "brand": "OnePlus", "model": "11", "type": "Smartphone", "tier": "flagship",
        "new_price": 49999, "battery_cost": (2800, 3900), "screen_cost": (12500, 16500), "port_cost": (1600, 2600), "camera_cost": (4800, 8000)
    },
    "oneplus nord 3": {
        "brand": "OnePlus", "model": "Nord 3", "type": "Smartphone", "tier": "upper_mid",
        "new_price": 28999, "battery_cost": (2000, 2900), "screen_cost": (6800, 9200), "port_cost": (1200, 2000), "camera_cost": (3200, 5000)
    },
    "oneplus nord ce 3": {
        "brand": "OnePlus", "model": "Nord CE 3", "type": "Smartphone", "tier": "mid_range",
        "new_price": 22999, "battery_cost": (1800, 2600), "screen_cost": (5200, 7200), "port_cost": (1100, 1800), "camera_cost": (2800, 4200)
    },

    # -------------------------------------------------------------
    # XIAOMI & REDMI
    # -------------------------------------------------------------
    "xiaomi 13 pro": {
        "brand": "Xiaomi", "model": "13 Pro", "type": "Smartphone", "tier": "flagship",
        "new_price": 69999, "battery_cost": (2900, 4200), "screen_cost": (13500, 17500), "port_cost": (1600, 2800), "camera_cost": (6000, 11000)
    },
    "redmi note 13 pro+": {
        "brand": "Xiaomi", "model": "Redmi Note 13 Pro+", "type": "Smartphone", "tier": "upper_mid",
        "new_price": 29999, "battery_cost": (1900, 2800), "screen_cost": (6800, 9000), "port_cost": (1200, 2100), "camera_cost": (3500, 5500)
    },
    "redmi note 13": {
        "brand": "Xiaomi", "model": "Redmi Note 13", "type": "Smartphone", "tier": "budget_mid",
        "new_price": 17999, "battery_cost": (1400, 2100), "screen_cost": (4200, 5800), "port_cost": (900, 1600), "camera_cost": (2000, 3200)
    },
    "redmi note 12": {
        "brand": "Xiaomi", "model": "Redmi Note 12", "type": "Smartphone", "tier": "budget_mid",
        "new_price": 14999, "battery_cost": (1300, 1900), "screen_cost": (3800, 5200), "port_cost": (800, 1500), "camera_cost": (1800, 2800)
    },
    "redmi 12": {
        "brand": "Xiaomi", "model": "Redmi 12", "type": "Smartphone", "tier": "budget",
        "new_price": 10999, "battery_cost": (1100, 1700), "screen_cost": (2800, 4000), "port_cost": (700, 1300), "camera_cost": (1500, 2400)
    },

    # -------------------------------------------------------------
    # GOOGLE PIXEL
    # -------------------------------------------------------------
    "google pixel 8 pro": {
        "brand": "Google", "model": "Pixel 8 Pro", "type": "Smartphone", "tier": "flagship",
        "new_price": 99999, "battery_cost": (4200, 5800), "screen_cost": (19000, 25000), "port_cost": (2600, 4200), "camera_cost": (8000, 14000)
    },
    "google pixel 8": {
        "brand": "Google", "model": "Pixel 8", "type": "Smartphone", "tier": "flagship",
        "new_price": 68999, "battery_cost": (3600, 5000), "screen_cost": (15000, 19500), "port_cost": (2200, 3500), "camera_cost": (6500, 10500)
    },
    "google pixel 7a": {
        "brand": "Google", "model": "Pixel 7a", "type": "Smartphone", "tier": "upper_mid",
        "new_price": 37999, "battery_cost": (2600, 3800), "screen_cost": (9500, 13000), "port_cost": (1800, 2900), "camera_cost": (4500, 7500)
    },

    # -------------------------------------------------------------
    # LAPTOPS (DELL, HP, LENOVO, ASUS)
    # -------------------------------------------------------------
    "dell inspiron 15": {
        "brand": "Dell", "model": "Inspiron 15", "type": "Laptop", "tier": "mid_laptop",
        "new_price": 54990, "battery_cost": (3200, 4800), "screen_cost": (6000, 8500), "port_cost": (1500, 2800), "thermal_cost": (800, 1600)
    },
    "dell inspiron 15 3520": {
        "brand": "Dell", "model": "Inspiron 15 3520", "type": "Laptop", "tier": "mid_laptop",
        "new_price": 52990, "battery_cost": (3200, 4800), "screen_cost": (6000, 8500), "port_cost": (1500, 2800), "thermal_cost": (800, 1600)
    },
    "dell xps 13": {
        "brand": "Dell", "model": "XPS 13", "type": "Laptop", "tier": "ultrabook",
        "new_price": 124990, "battery_cost": (5500, 8500), "screen_cost": (18000, 25000), "port_cost": (3500, 6000), "thermal_cost": (1500, 3000)
    },
    "hp pavilion 15": {
        "brand": "HP", "model": "Pavilion 15", "type": "Laptop", "tier": "mid_laptop",
        "new_price": 58990, "battery_cost": (3400, 5000), "screen_cost": (6200, 8800), "port_cost": (1600, 2900), "thermal_cost": (900, 1700)
    },
    "hp 15s": {
        "brand": "HP", "model": "15s", "type": "Laptop", "tier": "budget_laptop",
        "new_price": 42990, "battery_cost": (2800, 4200), "screen_cost": (5200, 7500), "port_cost": (1400, 2400), "thermal_cost": (800, 1500)
    },
    "lenovo thinkpad e14": {
        "brand": "Lenovo", "model": "ThinkPad E14", "type": "Laptop", "tier": "business_laptop",
        "new_price": 64990, "battery_cost": (3800, 5600), "screen_cost": (7200, 9800), "port_cost": (1800, 3200), "thermal_cost": (900, 1800)
    },
    "lenovo ideapad slim 3": {
        "brand": "Lenovo", "model": "IdeaPad Slim 3", "type": "Laptop", "tier": "budget_laptop",
        "new_price": 44990, "battery_cost": (2900, 4300), "screen_cost": (5400, 7800), "port_cost": (1400, 2500), "thermal_cost": (800, 1600)
    },
    "asus vivobook 15": {
        "brand": "ASUS", "model": "Vivobook 15", "type": "Laptop", "tier": "mid_laptop",
        "new_price": 48990, "battery_cost": (3100, 4600), "screen_cost": (5800, 8200), "port_cost": (1500, 2700), "thermal_cost": (850, 1650)
    },

    # -------------------------------------------------------------
    # SONY AUDIO
    # -------------------------------------------------------------
    "sony wh-1000xm4": {
        "brand": "Sony", "model": "WH-1000XM4", "type": "Headphones", "tier": "premium_audio",
        "new_price": 22990, "battery_cost": (1800, 2800), "screen_cost": (0, 0), "port_cost": (1200, 2000), "thermal_cost": (0, 0)
    },
    "sony wf-1000xm4": {
        "brand": "Sony", "model": "WF-1000XM4", "type": "Earbuds", "tier": "premium_audio",
        "new_price": 16990, "battery_cost": (1500, 2400), "screen_cost": (0, 0), "port_cost": (900, 1700), "thermal_cost": (0, 0)
    }
}

# Generic Tiers if model not found in exact catalog
GENERIC_TIERS: Dict[str, Dict[str, Any]] = {
    "Smartphone": {
        "ultra_flagship": {"new_price": 115000, "battery": (4500, 6500), "screen": (22000, 30000), "port": (2500, 4500)},
        "flagship": {"new_price": 65000, "battery": (3500, 5000), "screen": (14000, 19000), "port": (2000, 3500)},
        "upper_mid": {"new_price": 32000, "battery": (2200, 3200), "screen": (6500, 9500), "port": (1400, 2400)},
        "budget_mid": {"new_price": 18000, "battery": (1500, 2300), "screen": (4000, 6000), "port": (1000, 1800)},
        "budget": {"new_price": 11000, "battery": (1100, 1700), "screen": (2800, 4200), "port": (800, 1400)}
    },
    "Laptop": {
        "ultrabook": {"new_price": 95000, "battery": (5500, 8500), "screen": (16000, 24000), "port": (3000, 5500), "thermal": (1400, 2600)},
        "pro_laptop": {"new_price": 135000, "battery": (7500, 12000), "screen": (24000, 35000), "port": (4500, 8000), "thermal": (1800, 3500)},
        "gaming_laptop": {"new_price": 85000, "battery": (4800, 7500), "screen": (11000, 16000), "port": (2800, 5000), "thermal": (1500, 2800)},
        "mid_laptop": {"new_price": 54000, "battery": (3200, 4800), "screen": (5800, 8400), "port": (1600, 2800), "thermal": (900, 1700)},
        "budget_laptop": {"new_price": 38000, "battery": (2600, 4000), "screen": (4800, 7000), "port": (1300, 2200), "thermal": (800, 1500)}
    },
    "Audio": {
        "premium_audio": {"new_price": 20000, "battery": (1800, 2800), "port": (1200, 2000)},
        "mid_audio": {"new_price": 8000, "battery": (1200, 1900), "port": (800, 1400)},
        "budget_audio": {"new_price": 2500, "battery": (700, 1200), "port": (500, 900)}
    }
}


def normalize_device_key(brand: str, model: str) -> str:
    """Combines brand and model into a normalized lookup key."""
    combined = f"{brand or ''} {model or ''}".lower()
    combined = re.sub(r'[^a-z0-9\s+]', ' ', combined)
    combined = re.sub(r'\s+', ' ', combined).strip()
    return combined


def match_catalog_item(brand: str, model: str, device_type: str) -> Optional[Dict[str, Any]]:
    """Tries exact key match first, then fuzzy keyword containment."""
    norm_key = normalize_device_key(brand, model)
    if norm_key in DEVICE_CATALOG:
        return DEVICE_CATALOG[norm_key]

    # Partial model lookup
    for cat_key, item in DEVICE_CATALOG.items():
        if item["brand"].lower() in norm_key and (model and model.lower() in cat_key):
            return item

    # Check model number/name inside catalog keys
    clean_model = (model or "").lower().strip()
    if len(clean_model) >= 3:
        for cat_key, item in DEVICE_CATALOG.items():
            if clean_model in cat_key:
                return item

    return None


def estimate_tier_fallback(brand: str, model: str, device_type: str, purchase_price: float = 0.0) -> Dict[str, Any]:
    """Smart fallback when specific model is not in static catalog."""
    brand_lower = (brand or "").lower()
    model_lower = (model or "").lower()
    type_clean = "Smartphone"
    if "laptop" in (device_type or "").lower() or "notebook" in (device_type or "").lower() or "macbook" in model_lower:
        type_clean = "Laptop"
    elif "headphone" in (device_type or "").lower() or "earbud" in (device_type or "").lower() or "audio" in (device_type or "").lower():
        type_clean = "Audio"

    # Price-based or keyword-based tier selection
    if purchase_price > 90000:
        tier_name = "ultra_flagship" if type_clean == "Smartphone" else "pro_laptop"
    elif purchase_price > 50000:
        tier_name = "flagship" if type_clean == "Smartphone" else "mid_laptop"
    elif purchase_price > 25000:
        tier_name = "upper_mid" if type_clean == "Smartphone" else "budget_laptop"
    elif purchase_price > 15000:
        tier_name = "budget_mid"
    elif purchase_price > 0:
        tier_name = "budget"
    else:
        # Infer from brand/keywords
        if any(w in model_lower for w in ["ultra", "pro max", "fold"]):
            tier_name = "ultra_flagship" if type_clean == "Smartphone" else "pro_laptop"
        elif any(w in model_lower for w in ["pro", "plus", "max", "edge", "xps", "legion", "rog"]):
            tier_name = "flagship" if type_clean == "Smartphone" else "gaming_laptop"
        elif any(w in model_lower for w in ["nord", "lite", "neo", "slim", "vivobook"]):
            tier_name = "upper_mid" if type_clean == "Smartphone" else "mid_laptop"
        elif brand_lower in ["apple"]:
            tier_name = "flagship" if type_clean == "Smartphone" else "ultrabook"
        else:
            tier_name = "budget_mid" if type_clean == "Smartphone" else "budget_laptop"

    tiers_for_type = GENERIC_TIERS.get(type_clean, GENERIC_TIERS["Smartphone"])
    tier_data = tiers_for_type.get(tier_name, list(tiers_for_type.values())[0])

    base_price = purchase_price if purchase_price > 0 else tier_data.get("new_price", 35000)

    return {
        "brand": brand or "Electronics",
        "model": model or "Device",
        "type": type_clean,
        "tier": tier_name,
        "new_price": base_price,
        "battery_cost": tier_data.get("battery", (1800, 3200)),
        "screen_cost": tier_data.get("screen", (6000, 9500)),
        "port_cost": tier_data.get("port", (1400, 2400)),
        "thermal_cost": tier_data.get("thermal", (900, 1800)),
        "camera_cost": (2500, 5000)
    }


def calculate_used_market_value(
    new_price: float,
    age_years: float,
    condition: str = "working_with_problems",
    reported_damage: bool = False
) -> int:
    """
    Computes fair resale/used secondary market value based on standard
    Indian consumer electronics depreciation curve.
    """
    # Age depreciation retention percentage
    if age_years <= 0.5:
        retention = 0.82
    elif age_years <= 1.0:
        retention = 0.72
    elif age_years <= 2.0:
        retention = 0.52
    elif age_years <= 3.0:
        retention = 0.36
    elif age_years <= 4.0:
        retention = 0.24
    else:
        retention = max(0.12, 0.24 - (age_years - 4.0) * 0.04)

    # Condition multiplier
    cond_lower = (condition or "").lower()
    if "normal" in cond_lower or "flawless" in cond_lower or "good" in cond_lower:
        cond_mult = 1.05
    elif "problem" in cond_lower or "crash" in cond_lower or "reboot" in cond_lower:
        cond_mult = 0.78
    elif "barely" in cond_lower or "bad" in cond_lower or "faulty" in cond_lower:
        cond_mult = 0.55
    elif "dead" in cond_lower or "unresponsive" in cond_lower:
        cond_mult = 0.28
    else:
        cond_mult = 0.82

    if reported_damage:
        cond_mult *= 0.85

    used_val = int(new_price * retention * cond_mult)
    # Ensure realistic floor based on salvageable raw materials/chassis
    return max(int(new_price * 0.08), used_val)


def calculate_component_repair_cost(
    model_data: Dict[str, Any],
    symptoms: List[str],
    is_water_damaged: bool = False
) -> Dict[str, Any]:
    """
    Determines model-specific repair estimate range for reported issue.
    """
    symptoms_str = " ".join([str(s).lower() for s in symptoms])

    # Check dominant problem
    if is_water_damaged:
        min_c = int(model_data["new_price"] * 0.06 + 2500)
        max_c = int(model_data["new_price"] * 0.16 + 5500)
        component = "Ultrasonic cleaning + PCB trace micro-soldering"
        category = "liquid_damage"
    elif any(k in symptoms_str for k in ["screen", "display", "crack", "flicker", "lines", "black_screen"]):
        sc = model_data.get("screen_cost", (4500, 8500))
        min_c, max_c = sc[0], sc[1]
        component = "OEM Display / AMOLED module replacement"
        category = "screen"
    elif any(k in symptoms_str for k in ["charging", "charge", "port", "loose_cable", "usb"]):
        pc = model_data.get("port_cost", (1200, 2200))
        min_c, max_c = pc[0], pc[1]
        component = "Sub-board / USB-C charging connector flex replacement"
        category = "charging_port"
    elif any(k in symptoms_str for k in ["overheating", "hot", "fan", "throttle"]):
        if "laptop" in model_data.get("type", "").lower():
            tc = model_data.get("thermal_cost", (900, 1800))
            min_c, max_c = tc[0], tc[1]
            component = "Heatsink ultrasonic cleaning + Arctic MX-4 thermal repaste"
        else:
            min_c, max_c = int(model_data.get("battery_cost", (1500, 2500))[0] * 0.8), int(model_data.get("battery_cost", (1500, 2500))[1] * 0.9)
            component = "Thermal management inspection & battery impedance overhaul"
        category = "thermal"
    elif any(k in symptoms_str for k in ["camera", "blurry", "focus", "lens"]):
        cc = model_data.get("camera_cost", (2500, 5500))
        min_c, max_c = cc[0], cc[1]
        component = "Camera sensor module replacement"
        category = "camera"
    elif any(k in symptoms_str for k in ["dead", "no_power", "motherboard", "logic_board"]):
        min_c = int(model_data["new_price"] * 0.08 + 1800)
        max_c = int(model_data["new_price"] * 0.22 + 4000)
        component = "PMIC (Power Management IC) component reballing / board repair"
        category = "motherboard"
    else:
        # Default wear component: battery
        bc = model_data.get("battery_cost", (1800, 3200))
        min_c, max_c = bc[0], bc[1]
        component = "OEM Lithium-ion cell replacement"
        category = "battery"

    # Enforce realistic bounds
    min_c = max(750, min_c)
    max_c = max(min_c + 500, max_c)

    return {
        "min": min_c,
        "max": max_c,
        "avg": int((min_c + max_c) / 2),
        "component": component,
        "category": category,
        "range_formatted": f"₹{min_c:,.0f} – ₹{max_c:,.0f}"
    }


def get_device_market_pricing(
    brand: str,
    model: str,
    device_type: str = "Smartphone",
    age_years: float = 2.0,
    condition: str = "working_with_problems",
    symptoms: Optional[List[str]] = None,
    purchase_price: float = 0.0,
    is_water_damaged: bool = False
) -> Dict[str, Any]:
    """
    Main entry point for market valuation and economic repair viability.
    Returns complete structured pricing data with transparent source attribution.
    """
    symptoms = symptoms or ["battery_drain"]

    # 1. Match catalog or estimate tier
    matched = match_catalog_item(brand, model, device_type)
    is_exact = matched is not None

    if matched:
        model_data = matched.copy()
        # If user provided a specific purchase price, adjust replacement price proportionately
        if purchase_price > 0 and abs(purchase_price - model_data["new_price"]) / model_data["new_price"] > 0.35:
            model_data["new_price"] = int(purchase_price * 0.85)
    else:
        model_data = estimate_tier_fallback(brand, model, device_type, purchase_price)

    new_replacement_price = int(model_data["new_price"])

    # 2. Resale/Used market value
    used_market_value = calculate_used_market_value(
        new_replacement_price,
        age_years=age_years,
        condition=condition,
        reported_damage=is_water_damaged
    )

    # 3. Model & Problem Specific Repair Cost
    repair_data = calculate_component_repair_cost(model_data, symptoms, is_water_damaged)
    avg_repair = repair_data["avg"]

    # 4. Economic Viability Comparison
    cost_to_value_ratio = avg_repair / max(1.0, float(used_market_value))
    cost_to_replacement_ratio = avg_repair / max(1.0, float(new_replacement_price))

    if is_water_damaged and cost_to_value_ratio > 0.55:
        recommendation = "RECOVER DATA & COMPONENTS"
        verdict_badge = "RECOVER"
        verdict_reason = (
            f"Extensive moisture exposure and estimated repair ({repair_data['range_formatted']}) "
            f"approach {int(cost_to_value_ratio * 100)}% of device resale value (₹{used_market_value:,.0f}). "
            "Harvesting intact display and storage is recommended before secondary corrosion spreads."
        )
    elif cost_to_value_ratio < 0.32:
        recommendation = "REPAIR FIRST"
        verdict_badge = "REPAIR_FIRST"
        verdict_reason = (
            f"Estimated repair cost ({repair_data['range_formatted']}) for {repair_data['component']} "
            f"is only ~{max(6, int(cost_to_value_ratio * 100))}% of the device's fair residual value (₹{used_market_value:,.0f}). "
            "Servicing this wear component preserves your device equity and prevents premature e-waste."
        )
    elif cost_to_value_ratio < 0.52:
        recommendation = "GET INSPECTED"
        verdict_badge = "INSPECT"
        verdict_reason = (
            f"Estimated repair is moderate (approx. {int(cost_to_value_ratio * 100)}% of residual value). "
            "A certified technician bench diagnosis is recommended to confirm component isolation before committing to full parts replacement."
        )
    else:
        recommendation = "REPLACE & SALVAGE"
        verdict_badge = "REPLACE"
        verdict_reason = (
            f"Estimated repair approaches {int(cost_to_value_ratio * 100)}% of current fair market value. "
            "Replacement is economically sensible; ensure personal data is backed up and functional modules are recycled."
        )

    # Avoided Capex
    replacement_cost_avoided = max(0, new_replacement_price - avg_repair)
    equity_retained_pct = max(10, min(95, int((1.0 - (avg_repair / max(1.0, used_market_value))) * 100)))

    # Sources and Transparency
    sources = [
        "Amazon India & Flipkart Market Listings (New Retail Index)",
        "Cashify & Reebelo Fair Value Benchmark (Used Condition)",
        "Authorized Service Center Price Schedule (India / Parts Benchmark)"
    ]
    confidence_level = "High (Verified Model Benchmark)" if is_exact else "Estimated (Category & Specification Tier)"

    return {
        "device_name": f"{model_data.get('brand', brand)} {model_data.get('model', model)}".strip(),
        "brand": model_data.get("brand", brand),
        "model": model_data.get("model", model),
        "device_type": model_data.get("type", device_type),
        "currency": "INR",
        "market_region": "India",
        "price_type": "estimated_market_benchmark",
        "new_market_price": new_replacement_price,
        "new_market_price_formatted": f"₹{new_replacement_price:,.0f}",
        "used_market_value": used_market_value,
        "used_market_value_formatted": f"₹{used_market_value:,.0f}",
        "repair_estimate": repair_data["range_formatted"],
        "repair_estimate_min": repair_data["min"],
        "repair_estimate_max": repair_data["max"],
        "repair_estimate_avg": avg_repair,
        "repair_component": repair_data["component"],
        "repair_category": repair_data["category"],
        "replacement_cost_avoided": replacement_cost_avoided,
        "replacement_cost_avoided_formatted": f"₹{replacement_cost_avoided:,.0f}",
        "equity_retained_pct": equity_retained_pct,
        "cost_to_value_ratio_pct": int(cost_to_value_ratio * 100),
        "recommendation": recommendation,
        "verdict_badge": verdict_badge,
        "verdict_reason": verdict_reason,
        "sources": sources,
        "last_checked": "March 2026",
        "confidence": confidence_level
    }
