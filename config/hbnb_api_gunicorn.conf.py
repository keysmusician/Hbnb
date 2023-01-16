wsgi_app = 'api.v1.app:app'

# Match this in the Nginx site configuration for Hbnb
bind = '127.0.0.1:8001'

proc_name = 'Hbnb API'

preload_app = True
