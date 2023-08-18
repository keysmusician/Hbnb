#!/usr/bin/python3
"""
Categories routes.
"""
from api.v1.views import app_views
from models import storage_engine
from models.category import Category


@app_views.route('/categories', methods=['GET'], strict_slashes=False)
def get_categories():
    """
    Lists all categories.
    """
    all_categories = storage_engine.all(Category).values()

    return [category.to_dict() for category in all_categories]
