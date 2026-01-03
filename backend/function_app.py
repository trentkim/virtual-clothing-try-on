"""
Virtual Clothing Try-On - Azure Functions App
"""
import azure.functions as func
import logging
import json
import os

# Import function blueprints
from functions.health import bp as health_bp
from functions.clothing import bp as clothing_bp
from functions.tryon import bp as tryon_bp

# Create the Function App
app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

# Register blueprints
app.register_functions(health_bp)
app.register_functions(clothing_bp)
app.register_functions(tryon_bp)

logging.info("Virtual Clothing Try-On Azure Functions App initialized")
