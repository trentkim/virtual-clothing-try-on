"""
Azure OpenAI Service for Virtual Try-On using gpt-image-1.5
Based on Azure documentation: https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/dall-e
Using multipart/form-data for image edit API
"""
import base64
import time
import logging
import os
import requests
from typing import List, Optional, Tuple

logger = logging.getLogger(__name__)


class AzureOpenAIService:
    """Service for interacting with Azure OpenAI gpt-image-1.5 model"""
    
    # Optimized prompt for virtual clothing try-on (from OpenAI Cookbook)
    TRYON_PROMPT = """Edit the image to dress the person using the provided clothing images. 
Do not change their face, facial features, skin tone, body shape, pose, or identity in any way. 
Preserve their exact likeness, expression, hairstyle, and proportions. 
Replace only the clothing, fitting the garments naturally to their existing pose and body geometry with realistic fabric behavior. 
Match lighting, shadows, and color temperature to the original photo so the outfit integrates photorealistically, without looking pasted on. 
Do not change the background, camera angle, framing, or image quality, and do not add accessories, text, logos, or watermarks."""

    def __init__(self):
        self.endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT", "").rstrip('/')
        self.api_key = os.environ.get("AZURE_OPENAI_API_KEY")
        self.api_version = os.environ.get("AZURE_OPENAI_API_VERSION", "2025-04-01-preview")
        self.deployment_name = os.environ.get("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-image-1.5")
        
        if not self.endpoint or not self.api_key:
            raise ValueError("Azure OpenAI credentials not configured")
    
    def virtual_try_on(
        self,
        user_image: bytes,
        clothing_images: List[bytes],
        quality: Optional[str] = None,
        custom_prompt: Optional[str] = None,
    ) -> Tuple[bytes, int]:
        """
        Perform virtual try-on using Azure OpenAI Image Edit API
        Based on Azure docs: multipart/form-data with image[] fields
        """
        start_time = time.time()
        
        logger.info(f"Calling Azure OpenAI images/edits: {self.deployment_name}")
        logger.info(f"Processing {len(clothing_images)} clothing items")
        
        # Use custom prompt or default
        prompt = custom_prompt or self.TRYON_PROMPT
        
        # Build the API URL for image edits
        url = f"{self.endpoint}/openai/deployments/{self.deployment_name}/images/edits?api-version={self.api_version}"
        
        # Headers (no Content-Type - requests will set it for multipart)
        headers = {
            "api-key": self.api_key
        }
        
        # Build multipart/form-data
        # Azure uses "image[]" for multiple images (array syntax)
        files = []
        
        # First image is the user photo (main image to edit)
        files.append(("image[]", ("user.png", user_image, "image/png")))
        
        # Add clothing images as additional images
        for i, clothing_bytes in enumerate(clothing_images):
            files.append(("image[]", (f"clothing_{i}.png", clothing_bytes, "image/png")))
        
        # Form data
        data = {
            "prompt": prompt,
            "model": self.deployment_name,
            "size": "1024x1024",
            "n": "1",
            "quality": quality or "high"
        }
        
        logger.info(f"Sending {len(files)} images to images/edits endpoint")
        logger.info(f"URL: {url}")
        
        # Make the API request
        response = requests.post(
            url,
            headers=headers,
            files=files,
            data=data,
            timeout=120  # Image generation can take time
        )
        
        logger.info(f"Response status: {response.status_code}")
        
        if response.status_code != 200:
            error_detail = response.text
            logger.error(f"API Error: {error_detail}")
            raise Exception(f"Azure OpenAI API error ({response.status_code}): {error_detail}")
        
        result = response.json()
        logger.info(f"Response received from Azure OpenAI")
        
        # Extract result image (always b64_json for gpt-image-1 series)
        if "data" in result and len(result["data"]) > 0:
            image_data = result["data"][0]
            if "b64_json" in image_data:
                result_bytes = base64.b64decode(image_data["b64_json"])
            elif "url" in image_data:
                img_response = requests.get(image_data["url"], timeout=30)
                result_bytes = img_response.content
            else:
                raise Exception(f"Unexpected response format: {result}")
        else:
            raise Exception(f"No image data in response: {result}")
        
        processing_time = int((time.time() - start_time) * 1000)
        logger.info(f"Virtual try-on completed in {processing_time}ms")
        
        return result_bytes, processing_time
    
    def generate_product_image(
        self,
        prompt: str,
        quality: str = "high",
    ) -> bytes:
        """
        Generate a product image from text prompt using Azure OpenAI API
        """
        url = f"{self.endpoint}/openai/deployments/{self.deployment_name}/images/generations?api-version={self.api_version}"
        
        headers = {
            "api-key": self.api_key,
            "Content-Type": "application/json"
        }
        
        payload = {
            "prompt": prompt,
            "model": self.deployment_name,
            "n": 1,
            "size": "1024x1024",
            "quality": quality
        }
        
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=120)
            
            if response.status_code != 200:
                raise Exception(f"API error ({response.status_code}): {response.text}")
            
            result = response.json()
            
            if "data" in result and len(result["data"]) > 0:
                image_data = result["data"][0]
                if "b64_json" in image_data:
                    return base64.b64decode(image_data["b64_json"])
                elif "url" in image_data:
                    img_response = requests.get(image_data["url"], timeout=30)
                    return img_response.content
            
            raise Exception(f"Unexpected response format: {result}")
            
        except Exception as e:
            logger.error(f"Image generation failed: {str(e)}")
            raise
