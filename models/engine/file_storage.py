#!/usr/bin/python3
"""
Defines the file storage engine.
"""
import json
from os import getenv
from pathlib import Path
from models.engine.storage_engine_base import StorageEngineBase


class FileStorage(StorageEngineBase):
    """
    JSON serializer/deserializer for models.

    __file_path: The path of the file to store the JSON serialized objects.

    __objects: Holds objects in memory between serialization and
        deserialization.
    """

    # Path to the serialized JSON data file
    __file_path = Path(__file__).parent.parent.parent / \
        "data" / "Hbnb_FileStorage.json"

    # Stores all objects by <class name>.id
    __objects = {}

    def all(self, model=None) -> dict:
        """
        Returns a dict of all stored objects and their IDs, optionally of a
        given model.

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
        # self.save()
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
        id: (str) Model ID.

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
        DEBUG = getenv("DEBUG")

        def _print(message):
            print(f'{__class__}.reload:', message)

        def warn(message):
            _print(f'WARNING: {message}')

        if DEBUG:
            _print('Loading objects from file.')

        class_map = {cls.__name__: cls for cls in self.models}

        try:
            with open(self.__file_path, 'r') as text_file_handle:
                JSON_object: dict = json.load(text_file_handle)

            class_name_key = "__class__"

            for key, value in JSON_object.items():
                # deserialize
                if type(value) is not dict:
                    warn(
                        f'Expected a `dict` object, but got a: {type(value)}. '
                        f'Skipping: {value}'
                    )
                    continue

                class_name = value.get(class_name_key)

                if class_name is None:
                    warn(
                        f'Expected the "{class_name_key}" key in JSON object, '
                        f'but it was missing. Skipping: {value}'
                    )
                    continue

                cls = class_map.get(class_name)

                if cls is None:
                    warn(
                        f'No class object found for "{class_name}".'
                        f'Skipping: {value}'
                    )
                    continue

                self.__objects[key] = cls(**value)

            if DEBUG:
                object_count = len(self.__objects)
                s = "s" if object_count != 1 else ""
                _print(f'Loaded {object_count} object{s} from file.')
        except FileNotFoundError:
            warn(
                'Could not load objects from file '
                f"'{self.__file_path}'. File not found."
            )
            pass
        except Exception as e:
            warn(
                'Could not load objects from file '
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
