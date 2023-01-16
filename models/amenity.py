#!/usr/bin/python
"""
Defines the `Amenity` model.
"""
from models import DeclarativeBase, STORAGE_TYPE
from models.base_model import BaseModel
from sqlalchemy import Column, String


class Amenity(BaseModel, DeclarativeBase):
    """
    A room/place amenity.
    """

    if STORAGE_TYPE == 'db':
        __tablename__ = 'amenities'
        name = Column(String(128), nullable=False)
    else:
        name = ""

    def __init__(self, *args, name, **kwargs):
        """
        Initializes an Amenity.
        """
        super().__init__(*args, name=name, **kwargs)
