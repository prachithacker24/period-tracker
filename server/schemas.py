from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional, List


# User schemas
class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# Period Entry schemas
class PeriodEntryBase(BaseModel):
    start_date: date
    end_date: Optional[date] = None
    flow_intensity: Optional[int] = None
    symptoms: Optional[str] = None
    notes: Optional[str] = None


class PeriodEntryCreate(PeriodEntryBase):
    pass


class PeriodEntryUpdate(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    flow_intensity: Optional[int] = None
    symptoms: Optional[str] = None
    notes: Optional[str] = None


class PeriodEntryResponse(PeriodEntryBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PeriodEntryList(BaseModel):
    entries: List[PeriodEntryResponse]
