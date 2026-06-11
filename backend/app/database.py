import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

#Cargar variables de entorno desde el archivo .env
load_dotenv()

USER = os.getenv("DB_USER")
PASSWORD = os.getenv("DB_PASSWORD")
HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")

#Estructura: mysql+mysqlconnector://user:password@host/db_name
SQLALCHEMY_DATABASE_URL = f"mysql+mysqlconnector://{USER}:{PASSWORD}@{HOST}/{DB_NAME}"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()