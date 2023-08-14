#!/usr/bin/python3
"""
Amenity unit tests.
"""
import inspect
import models
from models import amenity
from models.base_model import BaseModel
import pep8
import unittest


Amenity = amenity.Amenity


class TestAmenityDocs(unittest.TestCase):
    """Tests to check the documentation and style of Amenity class"""
    @classmethod
    def setUpClass(cls):
        """Set up for the doc tests"""
        cls.amenity_f = inspect.getmembers(Amenity, inspect.isfunction)

    def test_pep8_conformance_amenity(self):
        """Test that models/amenity.py conforms to PEP8."""
        pep8s = pep8.StyleGuide(quiet=True)
        result = pep8s.check_files(['models/amenity.py'])
        self.assertEqual(result.total_errors, 0,
                         "Found code style errors (and warnings).")

    def test_pep8_conformance_test_amenity(self):
        """Test that tests/test_models/test_amenity.py conforms to PEP8."""
        pep8s = pep8.StyleGuide(quiet=True)
        result = pep8s.check_files(['tests/test_models/test_amenity.py'])
        self.assertEqual(result.total_errors, 0,
                         "Found code style errors (and warnings).")

    def test_amenity_module_docstring(self):
        """Test for the amenity.py module docstring"""
        self.assertIsNot(amenity.__doc__, None,
                         "amenity.py needs a docstring")
        self.assertTrue(len(amenity.__doc__) >= 1,
                        "amenity.py needs a docstring")

    def test_amenity_class_docstring(self):
        """Test for the Amenity class docstring"""
        self.assertIsNot(Amenity.__doc__, None,
                         "Amenity class needs a docstring")
        self.assertTrue(len(Amenity.__doc__) >= 1,
                        "Amenity class needs a docstring")

    def test_amenity_func_docstrings(self):
        """Test for the presence of docstrings in Amenity methods"""
        for func in self.amenity_f:
            self.assertIsNot(func[1].__doc__, None,
                             "{:s} method needs a docstring".format(func[0]))
            self.assertTrue(len(func[1].__doc__) >= 1,
                            "{:s} method needs a docstring".format(func[0]))


class TestAmenity(unittest.TestCase):
    """Test the Amenity class"""

    def test_is_subclass(self):
        """Test that Amenity is a subclass of BaseModel"""
        amenity = Amenity(name="Dummy amenity")
        self.assertIsInstance(amenity, BaseModel)
        self.assertTrue(hasattr(amenity, "id"))
        self.assertTrue(hasattr(amenity, "created_at"))
        self.assertTrue(hasattr(amenity, "updated_at"))

    def test_name_attr(self):
        """Test that Amenity has attribute name, and it's as an empty string"""
        amenity = Amenity(name="")
        self.assertTrue(hasattr(amenity, "name"))
        if models.STORAGE_TYPE == 'db':
            self.assertEqual(amenity.name, None)
        else:
            self.assertEqual(amenity.name, "")

    def test_to_dict_creates_dict(self):
        """test to_dict method creates a dictionary with proper attrs"""
        amenity = Amenity(name="Dummy amenity")
        serialized_amenity = amenity.to_dict()
        self.assertEqual(type(serialized_amenity), dict)
        self.assertFalse("_sa_instance_state" in serialized_amenity)
        for attr in amenity.__dict__:
            if attr != "_sa_instance_state":
                self.assertTrue(attr in serialized_amenity)
        self.assertTrue("__class__" in serialized_amenity)

    def test_to_dict_values(self):
        """test that values in dict returned from to_dict are correct"""
        time_format = "%Y-%m-%dT%H:%M:%S.%f"
        amenity = Amenity(name="Dummy amenity")
        serialized_amenity = amenity.to_dict()
        self.assertEqual(serialized_amenity["__class__"], "Amenity")
        self.assertEqual(type(serialized_amenity["created_at"]), str)
        self.assertEqual(type(serialized_amenity["updated_at"]), str)
        self.assertEqual(
            serialized_amenity["created_at"],
            amenity.created_at.strftime(time_format)
        )
        self.assertEqual(
            serialized_amenity["updated_at"],
            amenity.updated_at.strftime(time_format)
        )

    def test_str(self):
        """test that the str method has the correct output"""
        amenity = Amenity(name="Dummy amenity")
        string = "[Amenity] ({}) {}".format(amenity.id, amenity.__dict__)
        self.assertEqual(string, str(amenity))
