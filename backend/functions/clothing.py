"""
Clothing Catalog Functions
"""
import azure.functions as func
import json
import logging
from typing import Optional
from shared.catalog import ClothingCatalogService

bp = func.Blueprint()
catalog_service = ClothingCatalogService()


@bp.function_name("getClothingItems")
@bp.route(route="clothing", methods=["GET"])
def get_clothing_items(req: func.HttpRequest) -> func.HttpResponse:
    """Get all clothing items, optionally filtered by category"""
    try:
        category = req.params.get('category')
        
        if category:
            items = catalog_service.get_items_by_category(category)
        else:
            items = catalog_service.get_all_items()
        
        response_data = {
            "items": [item.model_dump() for item in items],
            "total": len(items),
            "category": category
        }
        
        return func.HttpResponse(
            body=json.dumps(response_data),
            mimetype="application/json",
            status_code=200
        )
    except Exception as e:
        logging.error(f"Error getting clothing items: {str(e)}")
        return func.HttpResponse(
            body=json.dumps({"error": str(e)}),
            mimetype="application/json",
            status_code=500
        )


@bp.function_name("getClothingCategories")
@bp.route(route="clothing/categories", methods=["GET"])
def get_categories(req: func.HttpRequest) -> func.HttpResponse:
    """Get all available clothing categories"""
    try:
        categories = catalog_service.get_categories()
        
        return func.HttpResponse(
            body=json.dumps(categories),
            mimetype="application/json",
            status_code=200
        )
    except Exception as e:
        logging.error(f"Error getting categories: {str(e)}")
        return func.HttpResponse(
            body=json.dumps({"error": str(e)}),
            mimetype="application/json",
            status_code=500
        )


@bp.function_name("getClothingItem")
@bp.route(route="clothing/{item_id}", methods=["GET"])
def get_clothing_item(req: func.HttpRequest) -> func.HttpResponse:
    """Get a specific clothing item by ID"""
    try:
        item_id = req.route_params.get('item_id')
        item = catalog_service.get_item_by_id(item_id)
        
        if not item:
            return func.HttpResponse(
                body=json.dumps({"error": f"Clothing item not found: {item_id}"}),
                mimetype="application/json",
                status_code=404
            )
        
        return func.HttpResponse(
            body=json.dumps(item.model_dump()),
            mimetype="application/json",
            status_code=200
        )
    except Exception as e:
        logging.error(f"Error getting clothing item: {str(e)}")
        return func.HttpResponse(
            body=json.dumps({"error": str(e)}),
            mimetype="application/json",
            status_code=500
        )


@bp.function_name("searchClothing")
@bp.route(route="clothing/search/{query}", methods=["GET"])
def search_clothing(req: func.HttpRequest) -> func.HttpResponse:
    """Search clothing items"""
    try:
        query = req.route_params.get('query', '')
        items = catalog_service.search_items(query)
        
        response_data = {
            "items": [item.model_dump() for item in items],
            "total": len(items),
            "query": query
        }
        
        return func.HttpResponse(
            body=json.dumps(response_data),
            mimetype="application/json",
            status_code=200
        )
    except Exception as e:
        logging.error(f"Error searching clothing: {str(e)}")
        return func.HttpResponse(
            body=json.dumps({"error": str(e)}),
            mimetype="application/json",
            status_code=500
        )
