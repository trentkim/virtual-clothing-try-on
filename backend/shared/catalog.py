"""
Clothing Catalog Service
"""
import logging
from typing import List, Optional
from .models import ClothingItem, ClothingCategory

logger = logging.getLogger(__name__)


# Sample clothing catalog data
SAMPLE_CATALOG: List[dict] = [
    {
        "id": "top-001",
        "name": "Classic White T-Shirt",
        "name_ko": "클래식 화이트 티셔츠",
        "category": ClothingCategory.TOP,
        "image_url": "/images/clothing/top-001.png",
        "thumbnail_url": "/images/clothing/thumbnails/top-001.png",
        "price": 29000,
        "brand": "Essential",
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["White"],
        "description": "편안한 착용감의 기본 화이트 티셔츠"
    },
    {
        "id": "top-002",
        "name": "Navy Blue Polo Shirt",
        "name_ko": "네이비 블루 폴로셔츠",
        "category": ClothingCategory.TOP,
        "image_url": "/images/clothing/top-002.png",
        "thumbnail_url": "/images/clothing/thumbnails/top-002.png",
        "price": 49000,
        "brand": "Essential",
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["Navy"],
        "description": "세미 캐주얼 스타일의 네이비 폴로셔츠"
    },
    {
        "id": "top-003",
        "name": "Striped Casual Shirt",
        "name_ko": "스트라이프 캐주얼 셔츠",
        "category": ClothingCategory.TOP,
        "image_url": "/images/clothing/top-003.png",
        "thumbnail_url": "/images/clothing/thumbnails/top-003.png",
        "price": 59000,
        "brand": "Urban Style",
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["Blue/White"],
        "description": "시원한 느낌의 스트라이프 캐주얼 셔츠"
    },
    {
        "id": "bottom-001",
        "name": "Classic Blue Jeans",
        "name_ko": "클래식 블루 진",
        "category": ClothingCategory.BOTTOM,
        "image_url": "/images/clothing/bottom-001.png",
        "thumbnail_url": "/images/clothing/thumbnails/bottom-001.png",
        "price": 79000,
        "brand": "Denim Co",
        "sizes": ["28", "30", "32", "34", "36"],
        "colors": ["Blue"],
        "description": "편안한 스트레이트 핏 블루 데님"
    },
    {
        "id": "bottom-002",
        "name": "Black Chino Pants",
        "name_ko": "블랙 치노 팬츠",
        "category": ClothingCategory.BOTTOM,
        "image_url": "/images/clothing/bottom-002.png",
        "thumbnail_url": "/images/clothing/thumbnails/bottom-002.png",
        "price": 69000,
        "brand": "Urban Style",
        "sizes": ["28", "30", "32", "34", "36"],
        "colors": ["Black"],
        "description": "다용도로 활용 가능한 블랙 치노 팬츠"
    },
    {
        "id": "dress-001",
        "name": "Floral Summer Dress",
        "name_ko": "플로럴 서머 드레스",
        "category": ClothingCategory.DRESS,
        "image_url": "/images/clothing/dress-001.png",
        "thumbnail_url": "/images/clothing/thumbnails/dress-001.png",
        "price": 89000,
        "brand": "Bloom",
        "sizes": ["XS", "S", "M", "L"],
        "colors": ["Floral Print"],
        "description": "화사한 플로럴 패턴의 여름 원피스"
    },
    {
        "id": "dress-002",
        "name": "Elegant Black Dress",
        "name_ko": "엘레강스 블랙 드레스",
        "category": ClothingCategory.DRESS,
        "image_url": "/images/clothing/dress-002.png",
        "thumbnail_url": "/images/clothing/thumbnails/dress-002.png",
        "price": 129000,
        "brand": "Elegance",
        "sizes": ["XS", "S", "M", "L"],
        "colors": ["Black"],
        "description": "포멀한 자리에 어울리는 블랙 드레스"
    },
    {
        "id": "outerwear-001",
        "name": "Denim Jacket",
        "name_ko": "데님 재킷",
        "category": ClothingCategory.OUTERWEAR,
        "image_url": "/images/clothing/outerwear-001.png",
        "thumbnail_url": "/images/clothing/thumbnails/outerwear-001.png",
        "price": 99000,
        "brand": "Denim Co",
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["Blue"],
        "description": "캐주얼한 데님 재킷"
    },
    {
        "id": "outerwear-002",
        "name": "Beige Trench Coat",
        "name_ko": "베이지 트렌치코트",
        "category": ClothingCategory.OUTERWEAR,
        "image_url": "/images/clothing/outerwear-002.png",
        "thumbnail_url": "/images/clothing/thumbnails/outerwear-002.png",
        "price": 189000,
        "brand": "Classic",
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["Beige"],
        "description": "클래식한 베이지 트렌치코트"
    },
    {
        "id": "top-004",
        "name": "Black Tank Top",
        "name_ko": "블랙 탱크탑",
        "category": ClothingCategory.TOP,
        "image_url": "/images/clothing/top-004.png",
        "thumbnail_url": "/images/clothing/thumbnails/top-004.png",
        "price": 19000,
        "brand": "Essential",
        "sizes": ["XS", "S", "M", "L"],
        "colors": ["Black"],
        "description": "기본 블랙 탱크탑"
    },
]


class ClothingCatalogService:
    """Service for managing clothing catalog"""
    
    def __init__(self):
        self._catalog = [ClothingItem(**item) for item in SAMPLE_CATALOG]
    
    def get_all_items(self) -> List[ClothingItem]:
        """Get all clothing items"""
        return self._catalog
    
    def get_items_by_category(self, category: str) -> List[ClothingItem]:
        """Get clothing items by category"""
        return [item for item in self._catalog if item.category.value == category]
    
    def get_item_by_id(self, item_id: str) -> Optional[ClothingItem]:
        """Get a single clothing item by ID"""
        for item in self._catalog:
            if item.id == item_id:
                return item
        return None
    
    def get_items_by_ids(self, item_ids: List[str]) -> List[ClothingItem]:
        """Get multiple clothing items by their IDs"""
        return [item for item in self._catalog if item.id in item_ids]
    
    def search_items(self, query: str) -> List[ClothingItem]:
        """Search clothing items by name or description"""
        query_lower = query.lower()
        results = []
        for item in self._catalog:
            if (query_lower in item.name.lower() or 
                query_lower in item.name_ko or
                (item.description and query_lower in item.description.lower())):
                results.append(item)
        return results
    
    def get_categories(self) -> List[dict]:
        """Get all available categories with counts"""
        category_counts = {}
        for item in self._catalog:
            cat = item.category.value
            category_counts[cat] = category_counts.get(cat, 0) + 1
        
        category_names_ko = {
            "top": "상의",
            "bottom": "하의",
            "dress": "원피스",
            "outerwear": "아우터",
            "accessory": "액세서리",
        }
        
        return [
            {"category": cat, "count": count, "name_ko": category_names_ko.get(cat, cat)}
            for cat, count in category_counts.items()
        ]
