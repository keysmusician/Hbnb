#!/usr/bin/python3
"""
Defines the `User` model.
"""
from hashlib import md5
from models import DeclarativeBase, STORAGE_TYPE
from models.base_model import BaseModel
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship


class User(BaseModel, DeclarativeBase):
    """
    A user.
    """

    if STORAGE_TYPE == 'db':
        __tablename__ = 'users'
        email = Column(String(128), nullable=False)
        password = Column(String(128), nullable=False)
        first_name = Column(String(128), nullable=True)
        last_name = Column(String(128), nullable=True)
        places = relationship("Place", backref="user")
        reviews = relationship("Review", backref="user")
    else:
        email = ""
        password = ""
        first_name = ""
        last_name = ""

    def __init__(
            self, *args, email, password, first_name, last_name, **kwargs):
        """
        Initializes a User.
        """
        # This function isn't essential, but it enforces initialization with
        # appropriate arguments.
        super().__init__(
            *args,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            **kwargs
        )

    def __setattr__(self, name, value):
        """
        Sets the attribute "password" with MD5 encryption.
        """
        if name == "password":
            value = md5(value.encode()).hexdigest()
        super().__setattr__(name, value)
