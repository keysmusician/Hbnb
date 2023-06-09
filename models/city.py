#!/usr/bin/python
"""
Defines the `City` model.
"""
from models import DeclarativeBase, STORAGE_TYPE
from models.base_model import BaseModel
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship


class City(BaseModel, DeclarativeBase):
    """
    A city.
    """

    def __init__(self, *args, name, state_id, **kwargs):
        """
        Initializes a City.
        """
        super().__init__(*args, name=name, state_id=state_id, **kwargs)

    if STORAGE_TYPE == "db":
        __tablename__ = 'cities'
        state_id = Column(String(60), ForeignKey('states.id'), nullable=False)
        name = Column(String(128), nullable=False)
        places = relationship(
            'Place', back_populates='city',
            cascade='all, delete, delete-orphan'
        )
        state = relationship('State', back_populates='cities')
    else:
        state_id = ""
        name = ""

        @property
        def places(self):
            """
            Lists all Places in the City.
            """
            from models.place import Place

            return [
                place for place in self.storage_engine.all(Place).values()
                if place.city_id == self.id
            ]

        @property
        def state(self):
            """
            The State the City is located in.
            """
            from models.state import State

            return self.storage_engine.get(State, self.state_id)
