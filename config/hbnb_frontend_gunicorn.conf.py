wsgi_app = 'frontend.hbnb:app'

# Match this in the Nginx site configuration for Hbnb
bind = '127.0.0.1:8000'

proc_name = 'Hbnb frontend'

preload_app = True
