"""
Pydantic models for data validation
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class ClothingCategory(str, Enum):
    """Clothing categories"""
    TOP = "top"
    BOTTOM = "bottom"
    DRESS = "dress"
    OUTERWEAR = "outerwear"
    ACCESSORY = "accessory"


class ClothingItem(BaseModel):
    """Clothing item model"""
    id: str = Field(..., description="Unique identifier")
    name: str = Field(..., description="Item name")
    name_ko: str = Field(..., description="Item name in Korean")
    category: ClothingCategory = Field(..., description="Item category")
    image_url: str = Field(..., description="Image URL")
    thumbnail_url: Optional[str] = Field(None, description="Thumbnail URL")
    price: Optional[float] = Field(None, description="Price in KRW")
    brand: Optional[str] = Field(None, description="Brand name")
    sizes: List[str] = Field(default_factory=list, description="Available sizes")
    colors: List[str] = Field(default_factory=list, description="Available colors")
    description: Optional[str] = Field(None, description="Item description")


class TryOnRequest(BaseModel):
    """Request model for virtual try-on"""
    clothing_ids: List[str] = Field(..., description="List of clothing item IDs")
    quality: Optional[str] = Field("high", description="Image quality")


class TryOnResponse(BaseModel):
    """Response model for virtual try-on"""
    success: bool
    result_image_url: Optional[str] = None
    result_image_base64: Optional[str] = None
    processing_time_ms: int
    message: Optional[str] = None
