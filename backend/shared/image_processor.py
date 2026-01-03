"""
Image Processing Service
"""
import io
import base64
import logging
from typing import Tuple, Optional
from PIL import Image

logger = logging.getLogger(__name__)


class ImageProcessorService:
    """Service for image processing operations"""
    
    ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP"}
    MAX_DIMENSION = 4096
    TARGET_SIZE = (1024, 1024)
    
    @staticmethod
    def validate_image(image_bytes: bytes) -> Tuple[bool, Optional[str]]:
        """
        Validate image format and size
        
        Returns:
            Tuple of (is_valid, error_message)
        """
        try:
            image = Image.open(io.BytesIO(image_bytes))
            
            # Check format
            if image.format not in ImageProcessorService.ALLOWED_FORMATS:
                return False, f"Unsupported format: {image.format}. Allowed: JPEG, PNG, WEBP"
            
            # Check dimensions
            width, height = image.size
            if width > ImageProcessorService.MAX_DIMENSION or height > ImageProcessorService.MAX_DIMENSION:
                return False, f"Image too large: {width}x{height}. Max dimension: {ImageProcessorService.MAX_DIMENSION}"
            
            return True, None
            
        except Exception as e:
            return False, f"Invalid image: {str(e)}"
    
    @staticmethod
    def resize_image(
        image_bytes: bytes,
        max_size: Tuple[int, int] = (1024, 1024),
        maintain_aspect: bool = True,
    ) -> bytes:
        """Resize image while maintaining aspect ratio"""
        image = Image.open(io.BytesIO(image_bytes))
        original_format = image.format or "PNG"
        
        if maintain_aspect:
            image.thumbnail(max_size, Image.Resampling.LANCZOS)
        else:
            image = image.resize(max_size, Image.Resampling.LANCZOS)
        
        if original_format == "JPEG" and image.mode in ("RGBA", "P"):
            image = image.convert("RGB")
        
        output = io.BytesIO()
        image.save(output, format=original_format, quality=95)
        return output.getvalue()
    
    @staticmethod
    def to_base64(image_bytes: bytes) -> str:
        """Convert image bytes to base64 string"""
        return base64.b64encode(image_bytes).decode("utf-8")
    
    @staticmethod
    def from_base64(base64_string: str) -> bytes:
        """Convert base64 string to image bytes"""
        return base64.b64decode(base64_string)
    
    @staticmethod
    def get_image_info(image_bytes: bytes) -> dict:
        """Get image information"""
        image = Image.open(io.BytesIO(image_bytes))
        return {
            "format": image.format,
            "mode": image.mode,
            "width": image.size[0],
            "height": image.size[1],
            "size_bytes": len(image_bytes),
        }
    
    @staticmethod
    def prepare_for_api(image_bytes: bytes) -> bytes:
        """Prepare image for Azure OpenAI API"""
        image = Image.open(io.BytesIO(image_bytes))
        
        # Resize if too large
        if image.size[0] > 1024 or image.size[1] > 1024:
            image.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
        
        # Convert to RGB for consistency
        if image.mode in ("RGBA", "P"):
            background = Image.new("RGB", image.size, (255, 255, 255))
            if image.mode == "RGBA":
                background.paste(image, mask=image.split()[3])
            else:
                background.paste(image)
            image = background
        elif image.mode != "RGB":
            image = image.convert("RGB")
        
        output = io.BytesIO()
        image.save(output, format="PNG", optimize=True)
        return output.getvalue()
    
    @staticmethod
    def create_thumbnail(
        image_bytes: bytes,
        size: Tuple[int, int] = (200, 200),
    ) -> bytes:
        """Create a thumbnail from image"""
        image = Image.open(io.BytesIO(image_bytes))
        image.thumbnail(size, Image.Resampling.LANCZOS)
        
        output = io.BytesIO()
        image.save(output, format="PNG", optimize=True)
        return output.getvalue()
