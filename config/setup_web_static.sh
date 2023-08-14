#!/usr/bin/env bash
# Sets up the web server for deployment

# TODO: Create a variable for the name of the configuration file

# Add Hbnb site configuration to Nginx sites
mv config/Hbnb.conf /etc/nginx/sites-available/Hbnb.conf

# Enable Hbnb site
ln -sf /etc/nginx/sites-available/Hbnb.conf /etc/nginx/sites-enabled/Hbnb.conf

# Disable the default Nginx site
rm /etc/nginx/sites-enabled/default
