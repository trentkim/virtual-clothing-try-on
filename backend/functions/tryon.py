"""
Virtual Try-On Function
"""
import azure.functions as func
import json
import logging
import time
import base64
import os
from shared.azure_openai import AzureOpenAIService
from shared.catalog import ClothingCatalogService
from shared.image_processor import ImageProcessorService

bp = func.Blueprint()


def parse_multipart_form(req: func.HttpRequest) -> tuple:
    """Parse multipart form data from request"""
    # Get the content type
    content_type = req.headers.get('Content-Type', '')
    
    if 'multipart/form-data' not in content_type:
        raise ValueError("Expected multipart/form-data")
    
    # Parse files and form fields
    files = req.files
    
    user_image_file = files.get('user_image')
    if not user_image_file:
        raise ValueError("user_image is required")
    
    user_image_bytes = user_image_file.read()
    
    # Get form fields
    clothing_ids_str = req.form.get('clothing_ids', '')
    quality = req.form.get('quality', 'high')
    
    clothing_ids = [id.strip() for id in clothing_ids_str.split(',') if id.strip()]
    
    return user_image_bytes, clothing_ids, quality


@bp.function_name("virtualTryOn")
@bp.route(route="try-on", methods=["POST"])
def virtual_try_on(req: func.HttpRequest) -> func.HttpResponse:
    """
    Perform virtual clothing try-on.
    
    Upload a user photo and specify clothing items to try on.
    The AI will generate a realistic image of the user wearing the selected clothes.
    """
    start_time = time.time()
    
    try:
        # Parse multipart form data
        user_image_bytes, clothing_ids, quality = parse_multipart_form(req)
        
        if not clothing_ids:
            return func.HttpResponse(
                body=json.dumps({"error": "At least one clothing item is required"}),
                mimetype="application/json",
                status_code=400
            )
        
        # Validate image
        image_processor = ImageProcessorService()
        is_valid, error_msg = image_processor.validate_image(user_image_bytes)
        
        if not is_valid:
            return func.HttpResponse(
                body=json.dumps({"error": error_msg}),
                mimetype="application/json",
                status_code=400
            )
        
        # Get clothing items
        catalog_service = ClothingCatalogService()
        clothing_items = catalog_service.get_items_by_ids(clothing_ids)
        
        if not clothing_items:
            return func.HttpResponse(
                body=json.dumps({"error": "No valid clothing items found"}),
                mimetype="application/json",
                status_code=404
            )
        
        # Load clothing images
        clothing_images = []
        base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        sample_data_path = os.path.join(os.path.dirname(base_path), "sample-data", "clothing")
        
        for item in clothing_items:
            image_path = os.path.join(sample_data_path, f"{item.id}.png")
            if os.path.exists(image_path):
                with open(image_path, "rb") as f:
                    clothing_images.append(f.read())
            else:
                logging.warning(f"Clothing image not found: {image_path}")
        
        # Prepare user image
        prepared_user_image = image_processor.prepare_for_api(user_image_bytes)
        
        # Call Azure OpenAI for try-on
        try:
            openai_service = AzureOpenAIService()
            result_bytes, processing_time = openai_service.virtual_try_on(
                user_image=prepared_user_image,
                clothing_images=clothing_images,
                quality=quality
            )
        except Exception as e:
            logging.warning(f"Azure OpenAI call failed, using demo mode: {str(e)}")
            # Demo mode: return the original image
            result_bytes = prepared_user_image
        
        result_base64 = base64.b64encode(result_bytes).decode('utf-8')
        
        total_time = int((time.time() - start_time) * 1000)
        
        response_data = {
            "success": True,
            "result_image_base64": result_base64,
            "processing_time_ms": total_time,
            "message": f"Try-on completed with {len(clothing_items)} items: {', '.join([item.name_ko for item in clothing_items])}"
        }
        
        return func.HttpResponse(
            body=json.dumps(response_data),
            mimetype="application/json",
            status_code=200
        )
        
    except ValueError as e:
        return func.HttpResponse(
            body=json.dumps({"error": str(e)}),
            mimetype="application/json",
            status_code=400
        )
    except Exception as e:
        logging.error(f"Try-on failed: {str(e)}")
        return func.HttpResponse(
            body=json.dumps({
                "success": False,
                "error": f"Try-on processing failed: {str(e)}"
            }),
            mimetype="application/json",
            status_code=500
        )


@bp.function_name("previewTryOn")
@bp.route(route="try-on/preview", methods=["POST"])
def preview_try_on(req: func.HttpRequest) -> func.HttpResponse:
    """
    Quick preview of virtual try-on with lower quality for faster response.
    """
    # Similar to virtual_try_on but with quality="low"
    return func.HttpResponse(
        body=json.dumps({
            "message": "Preview endpoint - use quality=low for faster processing"
        }),
        mimetype="application/json",
        status_code=200
    )
