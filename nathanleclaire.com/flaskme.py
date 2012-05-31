#!/usr/bin/python

import sqlite3
from flask import Flask, render_template, request, jsonify
from flask import session, g, redirect, url_for, abort 
from flask import flash
from contextlib import closing

# configuration
DATABASE = '/tmp/flaskr.db'
DEBUG = True
SECRET_KEY = 'development key'
USERNAME = 'admin'
PASSWORD = 'default'

app = Flask(__name__)
app.config.from_object(__name__)

def connect_db():
	return sqlite3.connect(app.config['DATABASE'])

def init_db():
	with closing(connect_db()) as db:
		with app.open_resource('schema.sql') as f:
			db.cursor().executescript(f.read())
		db.commit()

@app.before_request
def before_request():
    g.db = connect_db()

@app.teardown_request
def teardown_request(exception):
    g.db.close()

@app.route('/')
def main():
	# init_db()
	cur = g.db.execute('SELECT title, text FROM entries ORDER BY id DESC')
	entries = [dict(title=row[0], text=row[1]) for row in cur.fetchall()]
	return render_template('index.html', entries=entries)

@app.route('/make_entry')
def make_entry():
	if session['logged_in'] == True:
		return render_template('blog_entry.html')
	else:
		return render_template('login.html', error='You are not logged in!')

@app.route('/scribble', methods=['POST'])
def scribble():
	# post the entry to the database
	if not session.get('logged_in'):
		abort(401)
	g.db.execute('INSERT INTO entries (title, text) VALUES (?, ?)', [request.form['posttitle'], request.form['postcontent']])
	g.db.commit()
	flash('New entry was successfully posted')
	return redirect(url_for('main'))

@app.route('/login', methods=['GET', 'POST'])
def login():
	error = None
	if request.method == 'POST':
		if request.form['username'] != app.config['USERNAME']:
			error = 'Invalid username'
		elif request.form['password'] != app.config['PASSWORD']:
			error = 'Invalid password'
		else:
			session['logged_in'] = True
			flash('You were logged in')
			return redirect(url_for('make_entry'))
	return render_template('login.html', error=error)

if __name__ == '__main__':
    app.run(debug=True)