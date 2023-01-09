#!/usr/bin/python
"""
Defines the `City` model.
"""
from models import Base, STORAGE_TYPE
from models.base_model import BaseModel
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship


class City(BaseModel, Base):
    """
    A city.
    """

    if STORAGE_TYPE == "db":
        __tablename__ = 'cities'
        state_id = Column(String(60), ForeignKey('states.id'), nullable=False)
        name = Column(String(128), nullable=False)
        places = relationship(
            "Place", backref="cities", cascade="all, delete, delete-orphan")
    else:
        state_id = ""
        name = ""

    def __init__(self, *args, name, state_id, **kwargs):
        """
        Initializes a City.
        """
        super().__init__(*args, name=name, state_id=state_id, **kwargs)
