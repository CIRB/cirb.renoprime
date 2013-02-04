.. contents::

Introduction
============
For testing gis,

first install lib : libpcre3 libpcre3-dev (for Ubuntu):

    sudo apt-get install libpcre3 libpcre3-dev

Launch buildout, ...

Start proxy and start instance:

    ./bin/proxy start
    ./bin/instance fg

Open a browser on http://localhost:8000/
