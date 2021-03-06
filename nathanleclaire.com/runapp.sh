#!/bin/bash

if [[ $1 == "-d" ]]
then
    python ./setupdb.py
    echo "Initliazing/Emptying database..................................................."
fi

sass --watch static/css/style.scss:static/css/style.css & uwsgi --plugins http,python --socket 127.0.0.1:3031 --file ~/Desktop/webdev/nathanleclaire.com/flaskme.py --callable app --processes 2
