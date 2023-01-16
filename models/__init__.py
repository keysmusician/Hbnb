#!/usr/bin/python3
"""
Constructs a storage engine.
"""
from os import getenv
from sqlalchemy.ext.declarative import declarative_base


STORAGE_TYPE = getenv("HBNB_TYPE_STORAGE")

if STORAGE_TYPE == "db":
    DeclarativeBase = declarative_base()
    from models.engine.db_storage import DBStorage
    storage_engine = DBStorage()
else:
    DeclarativeBase = object
    from models.engine.file_storage import FileStorage
    storage_engine = FileStorage()

storage_engine.reload()
