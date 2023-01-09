#!/usr/bin/python3
"""
Defines the file storage engine.
"""
import json
from models.engine.storage_engine_base import StorageEngineBase


class FileStorage(StorageEngineBase):
    """
    JSON serializer/deserializer for models.

    __file_path: The path of the file to store the JSON serialized objects.

    __objects: Holds objects in memory between serialization and
        deserialization.
    """

    # Path to the JSON file
    __file_path = "Hbnb_FileStorage.json"

    # Stores all objects by <class name>.id
    __objects = {}

    def all(self, model=None):
        """
        Returns all stored objects, optionally of a given model.

        model: A model or model name.
        """
        if model is not None:
            stored_objects = {}

            for key, value in self.__objects.items():
                if (model is value.__class__ or
                        model == value.__class__.__name__):
                    stored_objects[key] = value

            return stored_objects

        return self.__objects

    def close(self):
        """
        Closes this storage engine instance.

        Does nothing for this FileStorage engine, but this function exists to
        be compatible with the storage engine API.
        """
        #self.save()
        pass

    def delete(self, object=None):
        """
        Deletes a model instance.
        """
        try:
            del self.__objects[object.key]
        except:
            print(
                f'{self.__class__.__name__}.delete: Could not delete object:'
                f'{object}'
            )

    def get(self, model, id):
        """
        Returns a model instance by (model or model name) and ID.

        model: (str | type) Model or model name.

        Returns `None` if not found.
        """
        model_name = model.__name__ if type(model) is type else model

        key = f'{model_name}.{id}'

        try:
            return self.__objects[key]
        except:
            pass

    def new(self, object):
        """
        Adds a model instance to the session.

        Object keys are `<obj class name>.id`.
        """
        self.__objects[object.key] = object

    def reload(self):
        """
        Deserializes objects from a JSON file.
        """
        class_map = {cls.__name__: cls for cls in self.models}

        try:
            with open(self.__file_path, 'r') as f:
                JSON_object = json.load(f)

            for key in JSON_object:
                cls = class_map[JSON_object[key]["__class__"]]
                self.__objects[key] = cls(**JSON_object[key])
        except FileNotFoundError:
            print(
                f'{__class__}.reload: '
                'WARNING: Could not load objects from file '
                f"'{self.__file_path}'. File not found."
            )
            pass
        except Exception as e:
            print(
                f'{__class__}.reload: '
                'WARNING: Could not load objects from file '
                f"'{self.__file_path}'.", e
            )

    def save(self):
        """
        Serializes objects to a JSON file.

        See `__file_path` for the name of the file.
        """
        json_objects = {}

        for key in self.__objects:
            if key == "password":
                json_objects[key].decode()

            json_objects[key] = self.__objects[key].to_dict(save_fs=1)

        with open(self.__file_path, 'w') as f:
            json.dump(json_objects, f)
