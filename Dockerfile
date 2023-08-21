# syntax=docker/dockerfile:1

FROM python:3.8

WORKDIR /app

RUN apt-get -y update; apt-get -y upgrade; apt-get -y install nginx

COPY requirements.txt .

RUN pip install --requirement requirements.txt

COPY api api

COPY config config

COPY frontend frontend

COPY models models

# Sets up the web server for deployment
RUN <<HEREDOC_END
	export SITE_CONFIG_NAME=Hbnb.conf
	# Add Hbnb site configuration to Nginx sites
	mv config/"$SITE_CONFIG_NAME" /etc/nginx/sites-available/"$SITE_CONFIG_NAME"

	# Enable Hbnb site
	ln -sf /etc/nginx/sites-available/"$SITE_CONFIG_NAME" \
		/etc/nginx/sites-enabled/"$SITE_CONFIG_NAME"

	# Disable the default Nginx site
	rm /etc/nginx/sites-enabled/default
HEREDOC_END

# Change API root URL to deployment host:
RUN echo "export const API_root = 'https://hbnb.fly.dev/api/'" > frontend/static/scripts/api_root.js

COPY data/Hbnb_FileStorage.json data/Hbnb_FileStorage.json

ENV HBNB_TYPE_STORAGE='file'

# This should match [[services]] > internal_port in fly.toml and the Hbnb site's Nginx configuration:
EXPOSE 8080

# Specifying Bash as the interpreter makes it clear what's wrong if the file accidentally contains CRLF
CMD bash ./config/docker_entrypoint.sh
