"""
E-Mortem Analysis Engine
Transparent, rule-based diagnostic heuristic model for electronic failure postmortems.
Calculates dynamic health scores, repairability, component wear, ranked probable causes
with evidence ("Why we think this"), and actionable technician questions.
"""

from typing import Dict, Any, List
import uuid
from pricing_service import get_device_market_pricing

def analyze_device_telemetry(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main heuristic analysis pipeline.
    Accepts user-entered device details, symptoms, duration, history, and notes.
    Dynamically assesses the actual evidence provided.
    """
    # Extract device information
    device_info = data.get("device", {}) if isinstance(data.get("device"), dict) else {}
    brand = str(device_info.get("brand") or data.get("brand") or "").strip()
    model = str(device_info.get("model") or data.get("model") or "").strip()
    device_type = str(device_info.get("device_type") or data.get("device_type") or "Smartphone").capitalize()
    purchase_price = float(device_info.get("purchase_price") or data.get("purchase_price") or 0.0)
    current_value = float(device_info.get("current_value") or data.get("current_value") or 0.0)
    repair_cost = float(data.get("repair_cost") or 0.0)
    symptom_duration = str(data.get("symptom_duration") or "recent")
    raw_symptoms = data.get("symptoms", []) or []
    history = data.get("history", {}) or {}
    description = str(data.get("description") or "").lower()
    context_answers = data.get("context_answers", {}) or {}

    # Normalize symptoms into a standard set
    normalized_symptoms = set()
    for s in raw_symptoms:
        s_norm = str(s).lower().replace("-", "_").replace(" ", "_")
        if any(w in s_norm for w in ["shutdown", "random_shut", "turn_off"]):
            normalized_symptoms.add("shutdown")
        elif any(w in s_norm for w in ["battery", "drain", "discharge"]):
            normalized_symptoms.add("battery_drain")
        elif any(w in s_norm for w in ["heat", "hot", "thermal", "warm"]):
            normalized_symptoms.add("overheating")
        elif any(w in s_norm for w in ["slow", "sluggish", "lag", "freez", "unresponsive"]):
            normalized_symptoms.add("slow_performance")
        elif any(w in s_norm for w in ["charg", "plug", "cable", "port"]):
            normalized_symptoms.add("charging_problem")
        elif any(w in s_norm for w in ["screen", "display", "flicker", "crack", "black_screen"]):
            normalized_symptoms.add("screen_issue")
        elif any(w in s_norm for w in ["water", "liquid", "wet", "splash"]):
            normalized_symptoms.add("liquid_damage")
        elif any(w in s_norm for w in ["audio", "speaker", "mic", "sound"]):
            normalized_symptoms.add("audio_issue")
        else:
            normalized_symptoms.add(s_norm)

    is_dropped = bool(history.get("dropped") or "drop" in description or "fell" in description)
    is_water_damaged = bool(history.get("water_damage") or "liquid_damage" in normalized_symptoms or "water" in description or "liquid" in description or "wet" in description)
    had_software_update = bool(history.get("software_update") or "update" in description)
    had_charging_problem = bool(history.get("charging_problem") or "charging_problem" in normalized_symptoms)

    # -------------------------------------------------------------
    # 1. DYNAMIC COMPONENT HEALTH CALCULATION (0–100)
    # -------------------------------------------------------------
    c_battery = 92
    c_thermal = 90
    c_storage = 95
    c_display = 96
    c_charging = 92
    c_software = 88
    c_motherboard = 94

    # Earbuds / Headphones specific adjustments
    if "earbud" in device_type.lower() or "headphone" in device_type.lower():
        c_storage = 99
        c_display = 99

    if "battery_drain" in normalized_symptoms:
        c_battery -= 42
        c_software -= 12
    if "shutdown" in normalized_symptoms:
        c_battery -= 25
        c_thermal -= 20
        c_motherboard -= 15
    if "overheating" in normalized_symptoms:
        c_thermal -= 38
        c_battery -= 18
        c_software -= 15
    if "charging_problem" in normalized_symptoms or had_charging_problem:
        c_charging -= 45
        c_battery -= 15
    if "slow_performance" in normalized_symptoms:
        c_software -= 28
        c_storage -= 15
        c_thermal -= 10
    if "screen_issue" in normalized_symptoms:
        c_display -= 58
    if is_dropped:
        c_display -= 15
        c_charging -= 10
        c_motherboard -= 15
    if is_water_damaged:
        c_motherboard -= 45
        c_charging -= 35
        c_battery -= 30
        c_storage -= 25
        c_thermal -= 20
        c_software -= 20
    if had_software_update:
        c_software -= 18

    # Apply clamp
    c_battery = max(12, min(100, c_battery))
    c_thermal = max(15, min(100, c_thermal))
    c_storage = max(20, min(100, c_storage))
    c_display = max(10, min(100, c_display))
    c_charging = max(15, min(100, c_charging))
    c_software = max(20, min(100, c_software))
    c_motherboard = max(10, min(100, c_motherboard))

    component_health_map = {
        "Battery": c_battery,
        "Thermal System": c_thermal,
        "Storage": c_storage,
        "Display": c_display,
        "Charging System": c_charging,
        "Software": c_software,
        "Motherboard": c_motherboard,
        # Lowercase mirrors for resilient frontend consumers
        "battery": c_battery,
        "thermal": c_thermal,
        "storage": c_storage,
        "display": c_display,
        "charging": c_charging,
        "software": c_software,
        "motherboard": c_motherboard
    }

    # -------------------------------------------------------------
    # 2. DYNAMIC HEALTH SCORE (0–100) & STATUS
    # -------------------------------------------------------------
    if is_water_damaged:
        weight_mb = 0.35
        base_health = int(
            c_battery * 0.15 + c_thermal * 0.10 + c_charging * 0.15 +
            c_display * 0.10 + c_storage * 0.10 + c_software * 0.05 + c_motherboard * weight_mb
        )
    else:
        base_health = int(
            c_battery * 0.25 + c_thermal * 0.20 + c_charging * 0.18 +
            c_display * 0.14 + c_storage * 0.12 + c_software * 0.11
        )

    if is_water_damaged:
        base_health -= 12
    if is_dropped and "screen_issue" in normalized_symptoms:
        base_health -= 8

    health_score = max(12, min(95, base_health))

    if health_score >= 80:
        health_status = "Healthy / Low Concern"
    elif health_score >= 60:
        health_status = "Attention Required"
    elif health_score >= 40:
        health_status = "High Risk"
    else:
        health_status = "Critical / Physical Inspection Recommended"

    # -------------------------------------------------------------
    # 3. DYNAMIC PROBABLE CAUSES WITH EVIDENCE ("Why we think this")
    # -------------------------------------------------------------
    causes_pool = []

    # Liquid damage takes precedence if present
    if is_water_damaged:
        evidence = ["Liquid contact or exposure indicated in history"]
        if "charging_problem" in normalized_symptoms or had_charging_problem:
            evidence.append("Charging rail shows short-circuit or connectivity disruption")
        if "shutdown" in normalized_symptoms:
            evidence.append("Sudden shutdowns typical of voltage rail galvanic bridging")
        evidence.append("Corrosion risks accelerate with continuous electrical current")

        causes_pool.append({
            "name": "Sub-Board Moisture Residue / Galvanic Corrosion",
            "score": 82,
            "probability": 82,
            "severity": "Critical",
            "description": "Liquid ingress introduces ionic conductive residue that bridges power rails. Immediate ultrasonic cleaning and inspection is vital.",
            "why_we_think_this": evidence
        })

    # Thermal / Laptop overheating
    if "overheating" in normalized_symptoms or ("laptop" in device_type.lower() and "shutdown" in normalized_symptoms):
        prob = 76 if "overheating" in normalized_symptoms else 58
        evidence = []
        if "overheating" in normalized_symptoms:
            evidence.append("Device runs noticeably hot under load")
        if "shutdown" in normalized_symptoms:
            evidence.append("Emergency thermal trip triggered by processor thermal limits")
        if "laptop" in device_type.lower():
            evidence.append("Laptops accumulate dust in fin stacks and thermal paste dries over 18+ months")
        else:
            evidence.append("Thermal graphite pad or vapor chamber dissipation efficiency degraded")

        causes_pool.append({
            "name": "Thermal Throttling / Degraded Heat Dissipation",
            "score": prob,
            "probability": prob,
            "severity": "High" if prob > 65 else "Medium",
            "description": "Thermal interface saturation or restricted cooling airflow forces defensive processor downclocking and protective thermal shutdown.",
            "why_we_think_this": evidence
        })

    # Battery Degradation
    if "battery_drain" in normalized_symptoms or ("shutdown" in normalized_symptoms and not is_water_damaged):
        prob = 74 if ("battery_drain" in normalized_symptoms and "shutdown" in normalized_symptoms) else 62
        evidence = []
        if "battery_drain" in normalized_symptoms:
            evidence.append("Rapid battery capacity discharge during active usage")
        if "shutdown" in normalized_symptoms:
            evidence.append("Sudden shutdown occurs when battery drops below ~20–30% charge")
        if "smartphone" in device_type.lower():
            evidence.append("Li-ion cell impedance rises after 500+ standard recharge cycles")
        else:
            evidence.append("Chemical aging limits instant peak current delivery")

        causes_pool.append({
            "name": "Battery Voltage Drop / Cell Degradation",
            "score": prob,
            "probability": prob,
            "severity": "High" if prob > 65 else "Medium",
            "description": "Chemical aging increases internal battery resistance. When peak current is requested, voltage drops below operating levels, causing sudden power cutoff.",
            "why_we_think_this": evidence
        })

    # Charging Subsystem
    if "charging_problem" in normalized_symptoms or had_charging_problem:
        prob = 68 if "charging_problem" in normalized_symptoms else 45
        evidence = ["Intermittent or slow charge accumulation reported"]
        if is_dropped:
            evidence.append("Mechanical shock can stress solder pads on the USB-C / lightning connector")
        evidence.append("Lint compaction or pin oxidation frequently causes power delivery handshake dropouts")

        causes_pool.append({
            "name": "Charging Subsystem / Port Pin Fatigue",
            "score": prob,
            "probability": prob,
            "severity": "Medium",
            "description": "Possible pin oxidation, debris obstruction in charge receptacle, or solder joint fatigue along the charging sub-board.",
            "why_we_think_this": evidence
        })

    # Screen / Display
    if "screen_issue" in normalized_symptoms or (is_dropped and c_display < 80):
        prob = 72 if "screen_issue" in normalized_symptoms else 48
        evidence = ["Display visual artifacts, flickering, or touch anomalies observed"]
        if is_dropped:
            evidence.append("Prior drop incident points to digitizer flex cable displacement or panel hairline fracture")
        evidence.append("Display controller power line stability needs bench verification")

        causes_pool.append({
            "name": "Display Digitizer or Flex Cable Micro-Fracture",
            "score": prob,
            "probability": prob,
            "severity": "High" if prob > 60 else "Medium",
            "description": "Mechanical impact or flex connector looseness causing intermittent visual artifacts or unresponsive touch zones.",
            "why_we_think_this": evidence
        })

    # Background Software Load
    if "slow_performance" in normalized_symptoms or had_software_update:
        prob = 54 if had_software_update else 42
        evidence = ["Sluggish operation or UI stuttering under routine load"]
        if had_software_update:
            evidence.append("Symptoms followed recent OS/firmware upgrade (indexing daemon overhead)")
        evidence.append("Corrupted application cache or storage fragmentation placing sustained CPU load")

        causes_pool.append({
            "name": "Background Software Load / Firmware Indexing Conflict",
            "score": prob,
            "probability": prob,
            "severity": "Low",
            "description": "Background processes, orphaned services, or post-update media re-indexing causing CPU core saturation and thermal buildup.",
            "why_we_think_this": evidence
        })

    # Default fallback cause if none triggered
    if not causes_pool:
        causes_pool.append({
            "name": "General Operating Wear & Storage Cache Fragmentation",
            "score": 45,
            "probability": 45,
            "severity": "Low",
            "description": "Preliminary pattern indicates normal hardware aging. Software cache clearance and preventive maintenance recommended.",
            "why_we_think_this": ["Normal component life-cycle wear", "No catastrophic hardware failure triggers detected"]
        })

    # Sort causes by probability descending
    probable_causes = sorted(causes_pool, key=lambda x: x["probability"], reverse=True)[:4]
    for idx, c in enumerate(probable_causes):
        c["rank"] = idx + 1
        c["likelihood"] = c["probability"]
        c["reason"] = c["description"]

    # -------------------------------------------------------------
    # 4. DYNAMIC MARKET PRICING & REPAIRABILITY SCORE
    # -------------------------------------------------------------
    import re
    age_years = 2.0
    try:
        if data.get("age") or device_info.get("age"):
            age_years = float(data.get("age") or device_info.get("age") or 2.0)
        else:
            p_date = str(data.get("purchase_date") or device_info.get("purchase_date") or "")
            year_match = re.search(r'\b(20\d\d)\b', p_date)
            if year_match:
                age_years = max(0.5, 2026.0 - float(year_match.group(1)))
    except Exception:
        age_years = 2.0

    pricing_data = get_device_market_pricing(
        brand=brand,
        model=model,
        device_type=device_type,
        age_years=age_years,
        condition=str(data.get("current_condition") or "working_with_problems"),
        symptoms=list(normalized_symptoms),
        purchase_price=purchase_price,
        is_water_damaged=is_water_damaged
    )

    if current_value <= 0:
        current_value = float(pricing_data["used_market_value"])

    min_repair = pricing_data["repair_estimate_min"]
    max_repair = pricing_data["repair_estimate_max"]

    if repair_cost > 0:
        actual_repair_cost = repair_cost
        min_repair = int(repair_cost * 0.8)
        max_repair = int(repair_cost * 1.2)
    else:
        actual_repair_cost = float(pricing_data["repair_estimate_avg"])

    cost_ratio = actual_repair_cost / max(1.0, current_value)
    rep_base = 86 - int(cost_ratio * 70)
    if is_water_damaged:
        rep_base -= 28
    if health_score < 40:
        rep_base -= 15
    repairability_score = max(15, min(95, rep_base))

    recommendation = pricing_data["verdict_badge"]
    recommendation_reason = pricing_data["verdict_reason"]

    # -------------------------------------------------------------
    # 5. HUMAN-READABLE "WHAT PROBABLY HAPPENED?" EXPLANATION
    # -------------------------------------------------------------
    primary_cause = probable_causes[0]["name"]
    explanation_parts = [
        f"Based on reported telemetry, your {brand} {model or device_type}'s symptoms are most consistent with {primary_cause}."
    ]

    if "battery_drain" in normalized_symptoms and "shutdown" in normalized_symptoms:
        explanation_parts.append(
            "When the processor demands quick peak voltage, the aged battery cell suffers an instant voltage collapse, triggering emergency shutdown."
        )
    elif "overheating" in normalized_symptoms:
        explanation_parts.append(
            "Excessive heat buildup indicates degraded thermal interface material or blocked cooling channels, forcing protective shutdowns."
        )
    elif "charging_problem" in normalized_symptoms:
        explanation_parts.append(
            "Power delivery disruptions point to contact resistance in the charge port or cable handshake rather than total power-board failure."
        )

    if is_dropped:
        explanation_parts.append("The recent physical impact may have loosened an internal flex connector or stressed solder joints.")
    if is_water_damaged:
        explanation_parts.append("Liquid exposure creates corrosive oxidation that requires prompt physical ultrasonic cleaning.")

    explanation_parts.append("These findings represent a preliminary pattern-based second opinion and should be verified on a physical test bench.")
    what_probably_happened = " ".join(explanation_parts)

    # -------------------------------------------------------------
    # 6. DYNAMIC RECOVERY OPTIONS
    # -------------------------------------------------------------
    replaceable = []
    if c_battery < 65:
        replaceable.append("Battery")
    if c_thermal < 65:
        replaceable.append("Thermal Paste / Heat Pad")
    if c_charging < 65:
        replaceable.append("Charging Port Sub-Board")
    if c_display < 65:
        replaceable.append("Display Assembly")

    reusable = []
    if c_display >= 65:
        reusable.append("Display Panel")
    if c_storage >= 60:
        reusable.append("Storage Module")
    if "laptop" in device_type.lower():
        reusable.extend(["RAM Modules", "Keyboard", "Power Brick"])
    else:
        reusable.extend(["Camera Sensors", "Chassis", "Speakers"])

    recovery_options = {
        "replaceable_components": replaceable or ["Modular Sub-Board"],
        "recoverable_data": c_storage > 35 and not (is_water_damaged and health_score < 30),
        "recoverable_components": reusable,
        "physical_inspection_required": is_water_damaged or is_dropped or health_score < 50
    }

    # -------------------------------------------------------------
    # 7. PRIORITIZED ACTION PLAN
    # -------------------------------------------------------------
    action_plan = [
        {
            "step": 1,
            "title": "Immediate Data Safeguard",
            "detail": "Perform an offline or cloud backup immediately before taking the device to any repair counter.",
            "description": "Perform an offline or cloud backup immediately before taking the device to any repair counter.",
            "priority": "HIGH"
        },
        {
            "step": 2,
            "title": "Diagnostic Bench Test",
            "detail": "Request an inline USB-C power meter or battery impedance test to measure exact electrical draw.",
            "description": "Request an inline USB-C power meter or battery impedance test to measure exact electrical draw.",
            "priority": "HIGH"
        },
        {
            "step": 3,
            "title": "Component Inspection",
            "detail": f"Verify {probable_causes[0]['name']} before consenting to complete motherboard replacement.",
            "description": f"Verify {probable_causes[0]['name']} before consenting to complete motherboard replacement.",
            "priority": "MEDIUM"
        },
        {
            "step": 4,
            "title": "Firmware & Cache Wipe",
            "detail": "If hardware tests pass, perform a clean cache partition wipe to eliminate software runaway.",
            "description": "If hardware tests pass, perform a clean cache partition wipe to eliminate software runaway.",
            "priority": "LOW"
        }
    ]

    # -------------------------------------------------------------
    # 8. TECHNICIAN QUESTIONS (Formatted for safe rendering)
    # -------------------------------------------------------------
    tech_questions_data = [
        {
            "id": 1,
            "question": "What exact hardware component has failed, and what meter reading confirms that?",
            "why_it_matters": "Prevents broad 'motherboard replacement' claims when only an inexpensive power IC or connector is loose."
        },
        {
            "id": 2,
            "question": "Can you show me the diagnostic power draw (amperage) or battery health test result?",
            "why_it_matters": "A legitimate shop uses an inline USB multimeter or diagnostic tester and can verify current draw."
        },
        {
            "id": 3,
            "question": "Is full module replacement required, or can the existing component be cleaned or resoldered?",
            "why_it_matters": "Component-level micro-soldering (e.g. charging port or pin reflow) is 70% cheaper than replacing full boards."
        },
        {
            "id": 4,
            "question": "What is the itemized breakdown between labor and the replacement part?",
            "why_it_matters": "Helps detect inflated hardware markups and ensures transparency on genuine vs compatible parts."
        },
        {
            "id": 5,
            "question": "Is the replacement part an Original Equipment Manufacturer (OEM) unit or third-party compatible?",
            "why_it_matters": "Third-party batteries often lack certified temperature management and degrade within 3 months."
        },
        {
            "id": 6,
            "question": "What written warranty do you provide on both the replacement part and your workmanship?",
            "why_it_matters": "Standard reputable repair facilities offer at least 90 days warranty on components."
        },
        {
            "id": 7,
            "question": "If the repair does not fix the issue, what is your diagnostic fee policy?",
            "why_it_matters": "Ensures you are not billed for speculative part swaps that fail to address the root problem."
        }
    ]

    diagnosis_id = str(data.get("id") or f"EM-2026-{uuid.uuid4().hex[:4].upper()}")

    return {
        "success": True,
        "diagnosis_id": diagnosis_id,
        "id": diagnosis_id,
        "device": f"{brand} {model}".strip() or f"{device_type} Device",
        "device_name": f"{brand} {model}".strip() or f"{device_type} Device",
        "device_type": device_type,
        "brand": brand,
        "model": model,
        "purchase_date": str(data.get("purchase_date") or ""),
        "purchase_price": purchase_price,
        "current_value": current_value,
        "health_score": health_score,
        "healthScore": health_score,
        "health_status": health_status,
        "healthStatus": health_status,
        "status": health_status,
        "repairability_score": repairability_score,
        "repairabilityScore": repairability_score,
        "repairabilityStatus": f"🟢 {recommendation_reason[:45]}...",
        "recommendation": recommendation,
        "recommendation_reason": recommendation_reason,
        "what_probably_happened": what_probably_happened,
        "whatProbablyHappened": what_probably_happened,
        "probable_causes": probable_causes,
        "probableCauses": probable_causes,
        "component_health": component_health_map,
        "componentHealth": component_health_map,
        "recovery": recovery_options,
        "recovery_options": recovery_options,
        "recoveryAnalysis": recovery_options,
        "repair_estimate": {
            "min": min_repair,
            "max": max_repair,
            "component": pricing_data["repair_component"],
            "category": pricing_data["repair_category"]
        },
        "repairVsReplace": {
            "estimatedRepairCost": f"₹{min_repair:,.0f} – ₹{max_repair:,.0f}",
            "estimatedDeviceValue": f"₹{current_value:,.0f}",
            "newMarketPrice": f"₹{pricing_data['new_market_price']:,.0f}",
            "replacementCostAvoided": f"₹{pricing_data['replacement_cost_avoided']:,.0f}",
            "equityRetainedPct": pricing_data["equity_retained_pct"],
            "costToValueRatioPct": pricing_data["cost_to_value_ratio_pct"],
            "repairComponent": pricing_data["repair_component"],
            "verdictText": f"🟢 {pricing_data['recommendation']}",
            "recommendation": pricing_data["recommendation"],
            "explanation": recommendation_reason,
            "decisionConfidence": 90,
            "sources": pricing_data["sources"],
            "lastChecked": pricing_data["last_checked"],
            "confidence": pricing_data["confidence"]
        },
        "pricing_data": pricing_data,
        "action_plan": action_plan,
        "actionPlan": action_plan,
        "technician_questions": tech_questions_data,
        "technicianQuestions": tech_questions_data
    }
