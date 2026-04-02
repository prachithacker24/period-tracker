from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

import models
import schemas
from database import engine, get_db
from auth import get_password_hash, verify_password

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Period Tracker API",
    description="API for period tracking application (Simplified)",
    version="1.0.0"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/")
def root():
    return {"message": "Period Tracker API", "status": "running"}


# Authentication endpoints (Simplified - No JWT)
@app.post("/auth/signup", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        name=user.name
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


@app.post("/auth/login", response_model=schemas.UserResponse)
def login(credentials: schemas.UserCreate, db: Session = Depends(get_db)):
    """Login user (Simplified - returns user instead of token)."""
    user = db.query(models.User).filter(models.User.email == credentials.email).first()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    return user


@app.get("/auth/profile", response_model=schemas.UserResponse)
def get_profile(user_id: int = Query(...), db: Session = Depends(get_db)):
    """Get professional profile information for a user."""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


@app.post("/auth/logout")
def logout():
    """Logout user (Simplified)."""
    return {"message": "Successfully logged out"}


# Period Entry endpoints (Unprotected - use user_id query param)
@app.post("/periods", response_model=schemas.PeriodEntryResponse, status_code=status.HTTP_201_CREATED)
def create_period_entry(
    entry: schemas.PeriodEntryCreate,
    user_id: int = Query(...),
    db: Session = Depends(get_db)
):
    """Create a new period entry for a specific user."""
    # Verify user exists
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db_entry = models.PeriodEntry(
        user_id=user_id,
        start_date=entry.start_date,
        end_date=entry.end_date,
        flow_intensity=entry.flow_intensity,
        symptoms=entry.symptoms,
        notes=entry.notes
    )

    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)

    return db_entry


@app.get("/periods", response_model=List[schemas.PeriodEntryResponse])
def get_period_entries(
    user_id: int = Query(...),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """Get all period entries for a specific user."""
    entries = db.query(models.PeriodEntry).filter(
        models.PeriodEntry.user_id == user_id
    ).offset(skip).limit(limit).all()

    return entries


@app.get("/periods/{entry_id}", response_model=schemas.PeriodEntryResponse)
def get_period_entry(
    entry_id: int,
    user_id: int = Query(...),
    db: Session = Depends(get_db)
):
    """Get a specific period entry."""
    entry = db.query(models.PeriodEntry).filter(
        models.PeriodEntry.id == entry_id,
        models.PeriodEntry.user_id == user_id
    ).first()

    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Period entry not found"
        )

    return entry


@app.put("/periods/{entry_id}", response_model=schemas.PeriodEntryResponse)
def update_period_entry(
    entry_id: int,
    entry_update: schemas.PeriodEntryUpdate,
    user_id: int = Query(...),
    db: Session = Depends(get_db)
):
    """Update a period entry."""
    db_entry = db.query(models.PeriodEntry).filter(
        models.PeriodEntry.id == entry_id,
        models.PeriodEntry.user_id == user_id
    ).first()

    if not db_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Period entry not found"
        )

    # Update fields
    update_data = entry_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_entry, field, value)

    db.commit()
    db.refresh(db_entry)

    return db_entry


@app.delete("/periods/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_period_entry(
    entry_id: int,
    user_id: int = Query(...),
    db: Session = Depends(get_db)
):
    """Delete a period entry."""
    db_entry = db.query(models.PeriodEntry).filter(
        models.PeriodEntry.id == entry_id,
        models.PeriodEntry.user_id == user_id
    ).first()

    if not db_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Period entry not found"
        )

    db.delete(db_entry)
    db.commit()

    return None


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
