"""
Defines `StorageEngineBase`.
"""


class StorageEngineBase:
    """
    Attributes common to storage engines.
    """

    def count(self, model=None):
        """
        Counts the number of objects in storage.

        model: A model of which to count the number of instances in storage.
            if `None`, counts the number of instances of all models in storage.
        """
        return len(self.all(model))

    @property
    def models(self):
        """
        All models managed by the storage engine.
        """
        # Models depend on a storage engine instance being defined at class
        # definition time, so the models have to be imported after the storage
        # engine class is defined to avoid a circular import:
        from models.amenity import Amenity
        from models.city import City
        from models.place import Place
        from models.review import Review
        from models.state import State
        from models.user import User
        from models.category import Category

        return (Amenity, Category, City, Place, Review, State, User)
