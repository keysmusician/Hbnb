#!/usr/bin/python
"""
Defines the `Place` model.
"""
from models import DeclarativeBase, STORAGE_TYPE
from models.base_model import BaseModel
from sqlalchemy import Column, String, ForeignKey, Table
from random import choice


if STORAGE_TYPE == 'db':
    place_amenity = Table(
        'place_amenity',
        DeclarativeBase.metadata,
        Column(
            'place_id',
            String(60),
            ForeignKey('places.id', onupdate='CASCADE', ondelete='CASCADE'),
            primary_key=True
        ),
        Column(
            'amenity_id',
            String(60),
            ForeignKey('amenities.id', onupdate='CASCADE', ondelete='CASCADE'),
            primary_key=True
        )
    )


class Place(BaseModel, DeclarativeBase):
    """
    A place to stay.
    """

    def __init__(
            self,
            *args,
            city_id,
            user_id,
            category_id=None,
            description,
            number_rooms,
            number_bathrooms,
            max_guest,
            price_by_night,
            latitude,
            longitude,
            **kwargs
    ):
        """
        Initializes a Place.
        """
        for property in ('reviews', 'amenities', 'user', 'city', 'category'):
            try:
                kwargs.pop(property)
            except KeyError:
                pass

        # Temporary solution: randomly assign a category if none is provided.
        if category_id is None:
            from models.category import Category
            category_id = choice([
                category.id for category in
                self.storage_engine.all(Category).values()
            ])

        super().__init__(
            *args,
            city_id=city_id,
            user_id=user_id,
            category_id=category_id,
            description=description,
            number_rooms=number_rooms,
            number_bathrooms=number_bathrooms,
            max_guest=max_guest,
            price_by_night=price_by_night,
            latitude=latitude,
            longitude=longitude,
            **kwargs
        )

    if STORAGE_TYPE == 'db':
        __tablename__ = 'places'
        city_id = Column(String(60), ForeignKey('cities.id'), nullable=False)
        user_id = Column(String(60), ForeignKey('users.id'), nullable=False)
        category_id = Column(String(60), ForeignKey(
            'categories.id'), nullable=True)
        name = Column(String(128), nullable=False)
        description = Column(String(1024), nullable=True)
        number_rooms = Column(Integer, nullable=False, default=0)
        number_bathrooms = Column(Integer, nullable=False, default=0)
        max_guest = Column(Integer, nullable=False, default=0)
        price_by_night = Column(Integer, nullable=False, default=0)
        latitude = Column(Float, nullable=True)
        longitude = Column(Float, nullable=True)
        amenities = relationship(
            "Amenity", secondary=place_amenity, viewonly=False)
        city = relationship("City", back_populates="places")
        reviews = relationship(
            "Review", backref="place", cascade="all, delete, delete-orphan")
    else:
        city_id = ""
        user_id = ""
        category_id = ""
        name = ""
        description = ""
        number_rooms = 0
        number_bathrooms = 0
        max_guest = 0
        price_by_night = 0
        latitude = 0.0
        longitude = 0.0
        amenity_ids = []

        @property
        def amenities(self):
            """
            Amenities available at the Place.
            """
            from models.amenity import Amenity

            return [
                self.storage_engine.get(Amenity, amenity_id)
                for amenity_id in self.amenity_ids
            ]

        @property
        def category(self):
            """
            The Category the Place is in.
            """
            from models.category import Category

            return self.storage_engine.get(Category, self.category_id)

        @property
        def city(self):
            """
            The City the Place is located in.
            """
            from models.city import City

            return self.storage_engine.get(City, self.city_id)

        @property
        def reviews(self):
            """
            Review instances.
            """
            from models.review import Review

            reviews = self.storage_engine.all(Review).values()

            return [review for review in reviews if review.place_id == self.id]

        @property
        def user(self):
            """
            The user hosting the place.
            """
            from models.user import User

            return self.storage_engine.get(User, self.user_id)
