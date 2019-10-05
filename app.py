#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import absolute_import
from flask import Flask
from flask_environments import Environments

#from templates import app

app = Flask(__name__, static_folder='static')
env = Environments(app)

@app.route('/')
def hello_world():
 return 'Hello to the World of Flask!'

if __name__ == '__main__':
	env.from_object('configurations.ProductionConfig')
	app.run(host="0.0.0.0",debug=True, port=5000)