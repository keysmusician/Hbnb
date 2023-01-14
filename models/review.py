#!/usr/bin/python
"""
Defines the `Review` model.
"""
from models import Base, STORAGE_TYPE
from models.base_model import BaseModel
from sqlalchemy import Column, String, ForeignKey


class Review(BaseModel, Base):
    """
    A review of a room/place.
    """

    if STORAGE_TYPE == 'db':
        __tablename__ = 'reviews'
        place_id = Column(String(60), ForeignKey('places.id'), nullable=False)
        user_id = Column(String(60), ForeignKey('users.id'), nullable=False)
        text = Column(String(1024), nullable=False)
        # TODO: Add ratings to database
        # rating = Column(Integer, nullable=False,  default=0)
    else:
        place_id = ""
        user_id = ""
        text = ""
        # rating = 0

    def __init__(self, *args, place_id, user_id, text, **kwargs):
        """
        Initializes a Review.
        """
        super().__init__(
            *args,
            place_id=place_id,
            user_id=user_id,
            text=text,
            # rating=rating,
            **kwargs
        )
