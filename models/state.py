#!/usr/bin/python3
"""
Defines the `State` model.
"""
from models import DeclarativeBase, STORAGE_TYPE
from models.base_model import BaseModel
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship


class State(BaseModel, DeclarativeBase):
    """
    A US state.
    """

    def __init__(self, *args, name, **kwargs):
        """
        Initializes a State.
        """
        super().__init__(*args, name=name, **kwargs)

    if STORAGE_TYPE == "db":
        __tablename__ = 'states'
        name = Column(String(128), nullable=False)
        cities = relationship(
            "City", back_populates="state",
            cascade="all, delete, delete-orphan"
        )
    else:
        name = ""

        @property
        def cities(self):
            """
            Cities with places to stay at the State.
            """
            from models.city import City

            cities = self.storage_engine.all(City).values()

            return [city for city in cities if city.state_id == self.id]
