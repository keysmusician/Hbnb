#!/usr/bin/python3
""" Starts a Flash Web Application """
from flask import Flask, render_template
from models.amenity import Amenity
from models.place import Place
from models.state import State
from models import storage
import uuid
app = Flask(__name__)


@app.teardown_appcontext
def close_db(error):
    """ Close the storage engine """
    storage.close()


@app.route('/2-hbnb', strict_slashes=False)
def hbnb():
    """ HBNB is alive! """
    states = storage.all(State).values()
    states = sorted(states, key=lambda k: k.name)
    st_ct = []

    for state in states:
        st_ct.append([state, sorted(state.cities, key=lambda k: k.name)])

    amenities = storage.all(Amenity).values()
    amenities = sorted(amenities, key=lambda k: k.name)

    places = storage.all(Place).values()
    places = sorted(places, key=lambda k: k.name)

    return render_template('2-hbnb.html',
                           states=st_ct,
                           amenities=amenities,
                           places=places,
                           cache_id=uuid.uuid4())


if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5000)
