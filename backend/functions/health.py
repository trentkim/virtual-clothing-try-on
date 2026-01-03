"""
Health Check Function
"""
import azure.functions as func
import json
from datetime import datetime

bp = func.Blueprint()


@bp.function_name("health")
@bp.route(route="health", methods=["GET"])
def health_check(req: func.HttpRequest) -> func.HttpResponse:
    """Health check endpoint"""
    response_data = {
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "service": "Virtual Clothing Try-On API (Azure Functions)"
    }
    
    return func.HttpResponse(
        body=json.dumps(response_data),
        mimetype="application/json",
        status_code=200
    )
