"""
reset_db.py — Wipe all tables from the SQLite DB.

Usage:
    python reset_db.py

This drops ALL tables managed by SQLAlchemy in the local database,
so that the application can start from a completely clean slate.

⚠️  WARNING: This deletes ALL data from the database. Only use for local development.
"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables if any
load_dotenv()

# Add the server directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from database import engine, Base
    import models  # This ensures all models are registered with Base.metadata
except ImportError as e:
    print(f"ERROR: Could not import database or models. Make sure you are running this script from the 'server' directory.")
    print(f"Exception: {e}")
    sys.exit(1)

print(f"Connecting to database at: {engine.url}...")

# 1. Ask for confirmation
confirm = input("\n⚠️  WARNING: This will delete ALL data. Are you sure you want to proceed? (y/N): ")
if confirm.lower() != 'y':
    print("Aborted. No changes were made.")
    sys.exit(0)

# 2. Find all tables from metadata
tables = list(Base.metadata.tables.keys())

# 3. Drop all tables
if tables:
    print(f"INFO: Found {len(tables)} table(s) to drop: {tables}")
    Base.metadata.drop_all(bind=engine)
    print(f"DONE: Dropped {len(tables)} table(s).")
else:
    print("INFO: No tables found - DB might already be clean.")

# 4. Recreate all tables
Base.metadata.create_all(bind=engine)
print("DONE: All tables recreated from current models.")

print("\nDONE: Database is fully reset. Now run: python main.py")
