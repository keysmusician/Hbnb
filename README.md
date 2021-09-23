<p align="center">
  <a href=#>
    <img src="https://s3.amazonaws.com/intranet-projects-files/holbertonschool-higher-level_programming+/263/HBTN-hbnb-Final.png" alt="Holberton School HBnB logo">
  </a>
</p>

<center>
<h1>HBnB</h1>
<em>Holberton School Air BnB clone</em>
</center>

## Table of Contents
* [About](#about)
	* [Technologies](#technologies)
* [Installation](#installation)
* [The Console](#the-console)
	* [HBnB CLI — The command interpreter](#hbnb-cli--the-command-interpreter)
	* [Commands](#commands)
	* [Usage](#usage)
	* [Examples](#examples)
* [Web Static](#web-static)
* [Database](#database)
* [Deploy Static](#deploy-static)
* [Web Framework](#web-framework)
* [REST API](#rest-api)
	* [Usage](#usage-1)
	* [Example](#example)
	* [Endpoints](#endpoints)
* [Web Dynamic](#web-dynamic)
* [Bugs](#bugs)
* [Authors](#authors)
* [License](#license)

## About
HBnB is a clone of the Air BnB website. The project is divided into 7 parts:
1. The Console
2. Web Static
3. Database
4. Deploy Static
5. Web Framework
6. REST API
7. Web Dynamic

### Technologies
This project was developed with the following tools:
* **Environment**: Ubuntu 14.04 (Trusty)
* **Codebase**: Python 3.4.3
  * **ORM**: SQLAlchemy 1.2.5
  * **Web Framework**: Flask 1.0.4
* **Linter**: PEP8 1.7.0
* **Database**: MySQL 5.7

## Installation
To try any part of this project yourself, follow these instructions:
1. Clone this repository: `git clone https://github.com/keysmusician/AirBnB_clone_v3.git`
2. Install necessary dependencies:
	* Python3
	* Flask
	* MySQL
	* SQLAlchemy
	* Fabric

	*Note: Not all dependencies are needed for every section of this project.*

3. Set up the development database: `cat ./setup_mysql_dev.sql | mysql -root -p`

## The Console
The Console is the first stage of the HBnB clone. In it, we wrote classes for representing users and listings, a file storage engine for saving and recalling data between interactive sessions, as well as a command interpreter (the console), for easily managing our data. The console provides a backend interface to our storage engine(s).

### HBnB CLI — The command interpreter
The HBnB CLI (command line interpreter) provides a convenient command line interface specifically to manage (add, delete, modify, etc.) HBnB data.
It offers an improved workflow over alternatives such as embedding data in the source code, manually managing a data file, or using the Python interpreter to manage the data.

### Commands
Bracketed arguments are optional.
* `all [CLASS]` - Show all objects.
* `create CLASS` - Create a new object.
* `destroy CLASS ID` - Destroy a specified instance.
* `help [COMMAND]` - Get information about a command.
* `quit` - Close an interactive session. Also quit with `^-D` or `EOF`.
* `show CLASS ID` - Display a single instance.
* `update CLASS ID ATTRIBUTE VALUE` - Edit attributes of an instance.

### Usage
Start an interactive HBnB CLI session by executing `console.py`:

`./console.py`

If it runs successfully, it will display the prompt and await input:

`(hbnb) `

Simply type any valid command(s) listed above. Type `quit` to exit the interactive session.

The HBnB CLI may also be used non-non-interactively by piping input to it from a shell:

`$ echo "help" | ./console.py`


### Examples
```
(hbnb) help

Documented commands (type help <topic>):
========================================
EOF  all  create  destroy  help  quit  show  update

(hbnb) create Place
aba364fd-8b9e-4c4b-b865-8db6a6e9bc03

(hbnb) all
["[Place] (aba364fd-8b9e-4c4b-b865-8db6a6e9bc03) {'created_at': datetime.datetime(2021, 7, 1, 13, 29, 27, 264673), 'id': 'aba364fd-8b9e-4c4b-b865-8db6a6e9bc03', 'updated_at': datetime.datetime(2021, 7, 1, 13, 29, 27, 264832)}"]
(hbnb)
```

## Web Static
The Web Static part of this project consisted of designing the website HTML and CSS.

## Database
In the Database stage, we built a second storage engine---database storage. This one uses a MySQL database and SQLAlchemy to manage data persistence. We introduced the following environment variables:
* `HBNB_MYSQL_USER`
* `HBNB_MYSQL_PWD`
* `HBNB_MYSQL_HOST`
* `HBNB_MYSQL_DB`
* `HBNB_TYPE_STORAGE`

If `HBNB_TYPE_STORAGE` = `db`, The database storage engine will be use, which depends upon the values of the other environment variables to establish a connection to a database. Consequently, the specified database must exist *and* contain the expected tables. `setup_mysql_dev.sql` sets up a development environment database and user.

Additionally, both storage engines' classes have the same methods implemented to provide seamless toggling between them. The SQLAlchemy ORM required significant additions to our models in order to properly link them to a database.

## Deploy Static
In this stage, we set up an Nginx web server and deployed our static files using Fabric---at least, that was the plan...

## Web Framework
In the Web Framework stage we learned how to set up routes in Flask and create Jinja templates. That allowed us to create dynamic HTML using data pulled from our MySQL database.

## REST API
In this section of the project, we built a REST API. Our Flask blueprint and views for the API can be found in the `api` directory. Our API base URL is `<host>/api/v1/`.

### Usage
Note that for the purposes of this project, we hosted locally with the built in development server that comes with Flask. The following environment variables determine the host and port the development server will use:
* `HBNB_API_HOST`
* `HBNB_API_PORT`

Unless specified, the host and port default to `0.0.0.0` and `5000` respectively.
To try this API yourself, follow the [installation](#installation) steps, launch our API on the Flask development server, and go to `http://0.0.0.0:5000/api/v1/<endpoint>`. A successful request returns JSON.

### Example
Running the development server:
```
$ python3 -m api.v1.app
 * Serving Flask app "app" (lazy loading)
. . .
 * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
```
Requesting an endpoint:
```
$ curl http://0.0.0.0:5000/api/v1/stats
{
  "amenities": 1,
  "cities": 1,
  "places": 1,
  "reviews": 1,
  "states": 1,
  "users": 1
}
```


### Endpoints
The following are the endpoints we defined and their corresponding supported HTTP methods:
|Endpoint|Methods|
|--------|-------|
|`/amenities/`| GET, POST |
|`/amenities/<amenity_id>`| DELETE, GET, PUT |
|`/cities/<city_id>`| DELETE, GET, PUT |
|`/cities/<city_id>/places`|  GET, POST |
|`/places/<place_id>`| DELETE, GET, PUT |
|`/places/<place_id>/reviews`| GET, POST |
|`/reviews/<review_id>`| DELETE, GET, PUT |
|`/states/<state_id>/cities`|  GET, POST |
|`/stats`| GET |
|`/states/`| GET, POST |
|`/states/<state_id>`| DELETE, GET, PUT |
|`/status`| GET |
|`/users/`| GET, POST |
|`/users/<user_id>`| DELETE, GET, PUT |

## Web Dynamic
**COMING SOON**

## Bugs
No known bugs.

## Authors
### V1 authors:
Alexa Orrico - [Github](https://github.com/alexaorrico) / [Twitter](https://twitter.com/alexa_orrico)

Jennifer Huang - [Github](https://github.com/jhuang10123) / [Twitter](https://twitter.com/earthtojhuang)

### V2 Authors:
Joann Vuong

### V3 Authors:
Justin Masayda [@keysmusician](https://github.com/keysmusician)

Carson Stearn [@krytech](https://github.com/krytech)

## License
All rights reserved.
