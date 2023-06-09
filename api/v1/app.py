#!/usr/bin/python3
"""
Hbnb API Flask application.
"""
from api.v1.views import app_views
from flasgger import Swagger
from flask import Flask, make_response, jsonify
from flask_cors import CORS
from models import storage_engine
from os import environ


app = Flask('Hbnb REST API')

# TODO: update to app.json.compact
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True

app.register_blueprint(app_views)

cors = CORS(app, resources={r"/api/v1/*": {"origins": "*"}})


@app.teardown_appcontext
def close_db(error):
    """
    Closes the storage engine.
    """
    storage_engine.close()

@app.errorhandler(404)
def not_found(error):
    """
    Returns the 404 error response.
    """
    return make_response(jsonify({'error': "Not found"}), 404)

app.config['SWAGGER'] = {
    'title': 'Hbnb REST API',
    'uiversion': 3
}

Swagger(app)


if __name__ == "__main__":
    app.run(
        host=environ.get('HBNB_API_HOST', '0.0.0.0'),
        port=environ.get('HBNB_API_PORT', '5002'),
        debug=True,
        threaded=True
    )
