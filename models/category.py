#!/usr/bin/python
"""
Defines the `Category` model.
"""
from models import DeclarativeBase, STORAGE_TYPE
from models.base_model import BaseModel
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship


class Category(BaseModel, DeclarativeBase):
    """
    A listing category.
    """

    def __init__(self, *args, name, **kwargs):
        """
        Initializes a Category.
        """
        super().__init__(*args, name=name, **kwargs)

    if STORAGE_TYPE == "db":
        __tablename__ = 'categories'
        name = Column(String(128), nullable=False)
        places = relationship(
            'Place', back_populates='category',
            cascade='all, delete, delete-orphan'
        )
    else:
        name = ""

        @property
        def places(self):
            """
            Lists all Places in the Category.
            """
            from models.place import Place

            return [
                place for place in self.storage_engine.all(Place).values()
                if place.category_id == self.id
            ]
