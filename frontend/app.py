#!/usr/bin/python3
"""
Hbnb Frontend Flask Web Application.
"""
from flask import Flask, abort, render_template
from models import storage_engine
from models.amenity import Amenity
from models.place import Place
from models.state import State
from os import environ
from pathlib import Path
import uuid


app = Flask('Hbnb')

# Set the application root to this directory so it finds templates, scripts,
# etc. regardless of how it was launched
app.root_path = Path(__file__).parent.resolve()

# app.jinja_env.trim_blocks = True
# app.jinja_env.lstrip_blocks = True


@app.teardown_appcontext
def close_db(error):
    """
    Closes the storage engine.
    """
    storage_engine.close()


@app.errorhandler(404)
def page_not_found(e):
    """
    404 page.
    """
    return render_template('404.html.jinja'), 404


@app.route('/places/<place_id>', strict_slashes=False)
def places(place_id):
    """
    Places pages.
    """
    place = storage_engine.get(Place, place_id)

    if place is None:
        abort(404)

    return render_template('place.html.jinja', place=place)


@app.route('/', strict_slashes=False)
def hbnb():
    """
    Hbnb home page.
    """
    def sort_by_name(item): return item.name

    states = sorted(storage_engine.all(State).values(), key=sort_by_name)

    states_cities = [
        [state, sorted(state.cities, key=sort_by_name)] for state in states
    ]

    amenities = sorted(storage_engine.all(Amenity).values(), key=sort_by_name)

    places = sorted(storage_engine.all(Place).values(), key=sort_by_name)

    return render_template(
        'index.html.jinja',
        states=states_cities,
        amenities=amenities,
        places=places,
        cache_id=uuid.uuid4(),
    )


if __name__ == "__main__":
    app.run(
        host=environ.get('HBNB_FRONTEND_HOST', '0.0.0.0'),
        port=environ.get('HBNB_FRONTEND_PORT', '5001'),
        debug=True
    )
