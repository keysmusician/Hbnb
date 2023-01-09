#!/usr/bin/python3
"""
Defines the `BaseModel` class.
"""
from datetime import datetime
from models import storage_engine, STORAGE_TYPE
from sqlalchemy import Column, String, DateTime
import uuid


time = "%Y-%m-%dT%H:%M:%S.%f"


class BaseModel:
    """
    Common model attributes.
    """

    storage_engine = storage_engine

    if STORAGE_TYPE == "db":
        id = Column(String(60), primary_key=True)
        created_at = Column(DateTime, default=datetime.utcnow)
        updated_at = Column(DateTime, default=datetime.utcnow)

    def __init__(self, *args, **kwargs):
        """
        Initializes a BaseModel.
        """
        if kwargs:
            for key, value in kwargs.items():
                if key != "__class__" and key != 'key':
                    setattr(self, key, value)
            if kwargs.get("created_at", None) and type(self.created_at) is str:
                self.created_at = datetime.strptime(kwargs["created_at"], time)
            else:
                self.created_at = datetime.utcnow()
            if kwargs.get("updated_at", None) and type(self.updated_at) is str:
                self.updated_at = datetime.strptime(kwargs["updated_at"], time)
            else:
                self.updated_at = datetime.utcnow()
            if kwargs.get("id", None) is None:
                self.id = str(uuid.uuid4())
        else:
            self.id = str(uuid.uuid4())
            self.created_at = datetime.utcnow()
            self.updated_at = self.created_at

    def __str__(self):
        """
        Represents the class as a string.
        """
        return "[{:s}] ({:s}) {}".format(
            self.__class__.__name__, self.id, self.__dict__)

    def delete(self):
        """
        Deletes the current instance from storage.
        """
        storage_engine.delete(self)

    @property
    def key(self):
        """
        An identifying key for the model instance.
        """
        return f'{self.__class__.__name__}.{self.id}'

    def save(self):
        """
        Saves a model to persistent storage.
        """
        self.updated_at = datetime.utcnow()
        storage_engine.new(self)
        storage_engine.save()

    def to_dict(self, save_fs=None):
        """
        Returns a dictionary representation of the instance.
        """
        new_dict = self.__dict__.copy()
        if "created_at" in new_dict:
            new_dict["created_at"] = new_dict["created_at"].strftime(time)
        if "updated_at" in new_dict:
            new_dict["updated_at"] = new_dict["updated_at"].strftime(time)
        new_dict["__class__"] = self.__class__.__name__
        if "_sa_instance_state" in new_dict:
            del new_dict["_sa_instance_state"]
        if save_fs is None:
            if "password" in new_dict:
                del new_dict["password"]

        return new_dict
