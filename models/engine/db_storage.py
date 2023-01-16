#!/usr/bin/python3
"""
Defines the database storage engine.
"""
from models import DeclarativeBase
from models.engine.storage_engine_base import StorageEngineBase
from os import getenv
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker


class DBStorage(StorageEngineBase):
    """
    MySQL database storage engine.
    """
    __engine = None

    __session = None

    def __init__(self):
        """
        Instantiates a DBStorage object.
        """
        # Connect to the database
        HBNB_MYSQL_USER = getenv('HBNB_MYSQL_USER')
        HBNB_MYSQL_PWD = getenv('HBNB_MYSQL_PWD')
        HBNB_MYSQL_HOST = getenv('HBNB_MYSQL_HOST')
        HBNB_MYSQL_DB = getenv('HBNB_MYSQL_DB')
        HBNB_ENV = getenv('HBNB_ENV')
        self.__engine = create_engine(
            f'mysql+mysqldb://{HBNB_MYSQL_USER}:{HBNB_MYSQL_PWD}'
            f'@{HBNB_MYSQL_HOST}/{HBNB_MYSQL_DB}'
        )

        if HBNB_ENV == "test":
            DeclarativeBase.metadata.drop_all(self.__engine)

    def all(self, model=None):
        """
        Returns all stored objects, optionally of a given model.

        model: A model or model name.
        """
        stored_objects = {}

        for _model in self.models:
            _model_name = _model.__name__
            if model is None or model is _model or model is _model_name:
                objects = self.__session.query(_model).all()

                for object in objects:
                    key = object.__class__.__name__ + '.' + object.id

                    stored_objects[key] = object

        return stored_objects

    def close(self):
        """
        Closes the current database session.
        """
        self.__session.remove()

    def delete(self, object=None):
        """
        Deletes an object from the current database session.
        """
        if object is not None:
            self.__session.delete(object)

    def get(self, model, id):
        """
        Returns a model instance by (model or model name) and ID.

        model: (str | type) Model or model name.

        Returns `None` if not found.
        """
        model_name = model.__name__ if type(model) is type else model

        for value in self.all(model_name).values():
            if (value.id == id):
                return value

        return None

    def new(self, object):
        """
        Adds an object to the current database session.
        """
        self.__session.add(object)

    def reload(self):
        """
        Reloads data from the database.
        """
        DeclarativeBase.metadata.create_all(self.__engine)
        session_factory = sessionmaker(
            bind=self.__engine, expire_on_commit=False)
        Session = scoped_session(session_factory)
        self.__session = Session

    def save(self):
        """
        Commits all changes of the current database session.
        """
        self.__session.commit()
