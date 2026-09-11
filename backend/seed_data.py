"""
Database initialization and seed script for E-Mortem.
Seeds users, realistic devices, diagnoses, and full reports into SQLite.
"""

import json
from datetime import datetime, timedelta
from database import SessionLocal, engine, Base
import models
from analysis_engine import analyze_device_telemetry

def seed_database():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        existing_device = db.query(models.Device).first()
        if existing_device:
            print("Database already contains records. Skipping seed.")
            return

        print("Seeding E-Mortem SQLite database...")

        # 1. Create Default Demo User
        demo_user = models.User(
            name="Alex Morgan",
            email="alex.morgan@e-mortem.local",
            created_at=datetime.utcnow() - timedelta(days=60)
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)

        # 2. Seed Baseline Devices Telemetry
        devices_data = [
            {
                "diagnosis_id": "EM-2026-1024",
                "device_type": "Smartphone",
                "brand": "Samsung",
                "model": "Galaxy S23",
                "purchase_date": "2024-03-15",
                "purchase_price": 65000.0,
                "current_value": 18000.0,
                "symptoms": ["random_shutdown", "battery_drain", "overheating", "slow_performance"],
                "history": {"dropped": True, "water_damage": False, "software_update": True, "charging_problem": True},
                "description": "Phone started shutting down randomly after becoming hot. Shuts down around 15% charge.",
                "repair_cost": 2500.0,
                "days_ago": 5
            },
            {
                "diagnosis_id": "EM-2026-1025",
                "device_type": "Laptop",
                "brand": "Dell",
                "model": "Inspiron 15 3520",
                "purchase_date": "2022-11-10",
                "purchase_price": 55000.0,
                "current_value": 14000.0,
                "symptoms": ["battery_drain", "slow_performance"],
                "history": {"dropped": False, "water_damage": False, "software_update": True, "charging_problem": False},
                "description": "Battery only lasts 25 minutes unplugged. Thermal fans run loudly during video calls.",
                "repair_cost": 2200.0,
                "days_ago": 12
            },
            {
                "diagnosis_id": "EM-2026-1026",
                "device_type": "Smartphone",
                "brand": "Apple",
                "model": "iPhone 13",
                "purchase_date": "2022-09-20",
                "purchase_price": 69900.0,
                "current_value": 26000.0,
                "symptoms": ["battery_drain"],
                "history": {"dropped": False, "water_damage": False, "software_update": False, "charging_problem": False},
                "description": "Maximum battery capacity dropped to 74%. Device throttles in direct sunlight.",
                "repair_cost": 3800.0,
                "days_ago": 18
            },
            {
                "diagnosis_id": "EM-2026-1027",
                "device_type": "Laptop",
                "brand": "HP",
                "model": "Pavilion Gaming 15",
                "purchase_date": "2021-06-15",
                "purchase_price": 64000.0,
                "current_value": 11000.0,
                "symptoms": ["overheating", "random_shutdown"],
                "history": {"dropped": False, "water_damage": False, "software_update": False, "charging_problem": False},
                "description": "GPU hits 94 degrees Celsius and shuts down within 10 minutes of heavy rendering.",
                "repair_cost": 1500.0,
                "days_ago": 25
            },
            {
                "diagnosis_id": "EM-2026-1028",
                "device_type": "Smartphone",
                "brand": "OnePlus",
                "model": "11 5G",
                "purchase_date": "2023-04-10",
                "purchase_price": 56999.0,
                "current_value": 24000.0,
                "symptoms": ["charging_problem"],
                "history": {"dropped": True, "water_damage": False, "software_update": False, "charging_problem": True},
                "description": "Warp charge cable must be held at an angle to charge. Fast charging disconnects intermittently.",
                "repair_cost": 1800.0,
                "days_ago": 30
            },
            {
                "diagnosis_id": "EM-2026-1029",
                "device_type": "Headphones",
                "brand": "Sony",
                "model": "WH-1000XM4",
                "purchase_date": "2022-01-18",
                "purchase_price": 24990.0,
                "current_value": 9000.0,
                "symptoms": ["battery_drain"],
                "history": {"dropped": False, "water_damage": False, "software_update": False, "charging_problem": False},
                "description": "Right earcup drains in 45 minutes while left earcup remains at 80%.",
                "repair_cost": 1600.0,
                "days_ago": 40
            },
            {
                "diagnosis_id": "EM-2026-1030",
                "device_type": "Tablet",
                "brand": "Apple",
                "model": "iPad Air 4",
                "purchase_date": "2021-12-05",
                "purchase_price": 54900.0,
                "current_value": 19000.0,
                "symptoms": ["screen_issue"],
                "history": {"dropped": True, "water_damage": False, "software_update": False, "charging_problem": False},
                "description": "Faint horizontal lines appeared near top edge following a backpack squeeze.",
                "repair_cost": 7500.0,
                "days_ago": 48
            },
            {
                "diagnosis_id": "EM-2026-1031",
                "device_type": "Laptop",
                "brand": "Lenovo",
                "model": "IdeaPad 3",
                "purchase_date": "2020-08-15",
                "purchase_price": 42000.0,
                "current_value": 8500.0,
                "symptoms": ["random_shutdown", "overheating", "liquid_damage"],
                "history": {"dropped": False, "water_damage": True, "software_update": False, "charging_problem": True},
                "description": "Coffee splash on keyboard 2 months ago. Motherboard corroded around charge rail.",
                "repair_cost": 14000.0,
                "days_ago": 55
            }
        ]

        for item in devices_data:
            # Create Device record
            device = models.Device(
                user_id=demo_user.id,
                device_type=item["device_type"],
                brand=item["brand"],
                model=item["model"],
                purchase_date=item["purchase_date"],
                purchase_price=item["purchase_price"],
                current_value=item["current_value"],
                created_at=datetime.utcnow() - timedelta(days=item["days_ago"])
            )
            db.add(device)
            db.commit()
            db.refresh(device)

            # Analyze using engine
            analysis_input = {
                "brand": item["brand"],
                "model": item["model"],
                "device_type": item["device_type"],
                "purchase_date": item["purchase_date"],
                "purchase_price": item["purchase_price"],
                "current_value": item["current_value"],
                "repair_cost": item["repair_cost"],
                "symptoms": item["symptoms"],
                "history": item["history"],
                "description": item["description"]
            }
            analysis_result = analyze_device_telemetry(analysis_input)

            # Force specific diagnosis ID for consistency
            diag_id = item["diagnosis_id"]

            diagnosis = models.Diagnosis(
                device_id=device.id,
                diagnosis_id=diag_id,
                symptoms=json.dumps(item["symptoms"]),
                history=json.dumps(item["history"]),
                description=item["description"],
                health_score=analysis_result["health_score"],
                repairability_score=analysis_result["repairability_score"],
                recommendation=analysis_result["recommendation"],
                created_at=datetime.utcnow() - timedelta(days=item["days_ago"])
            )
            db.add(diagnosis)
            db.commit()
            db.refresh(diagnosis)

            report = models.Report(
                diagnosis_id=diag_id,
                probable_causes=json.dumps(analysis_result["probable_causes"]),
                component_health=json.dumps(analysis_result["component_health"]),
                recovery_options=json.dumps(analysis_result["recovery_options"]),
                action_plan=json.dumps(analysis_result["action_plan"]),
                technician_questions=json.dumps(analysis_result["technician_questions"]),
                created_at=datetime.utcnow() - timedelta(days=item["days_ago"])
            )
            db.add(report)
            db.commit()

        print("Successfully seeded 8 demo devices, diagnoses, and reports.")

    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
