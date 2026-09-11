from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import shutil

# Determine database path: in serverless environments (e.g. Vercel, AWS Lambda),
# the deployment filesystem is read-only. /tmp is the only writable scratch space.
is_serverless = bool(
    os.environ.get("VERCEL") or 
    os.environ.get("AWS_LAMBDA_FUNCTION_NAME") or 
    os.environ.get("NOW_REGION")
)

if is_serverless:
    DB_PATH = "/tmp/e_mortem.db"
    source_db = os.path.join(os.path.dirname(os.path.abspath(__file__)), "e_mortem.db")
    if os.path.exists(source_db) and not os.path.exists(DB_PATH):
        try:
            shutil.copy2(source_db, DB_PATH)
        except Exception:
            pass
else:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DB_PATH = os.path.join(BASE_DIR, "e_mortem.db")

SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
