#!/usr/bin/env bash
# Sets up the web server for deployment

# Add Hbnb site configuration to Nginx sites
mv config/Hbnb /etc/nginx/sites-available/Hbnb

# Enable Hbnb site
ln -sf /etc/nginx/sites-available/Hbnb /etc/nginx/sites-enabled/Hbnb

# Disable the default Nginx site
rm /etc/nginx/sites-enabled/default
