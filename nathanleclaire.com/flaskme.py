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
PASSWORD = 'everytime i make a point she makes a counterpoint'

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

@app.route('/read')
def read_entries():
	if session['logged_in'] == True:
		cur = g.db.execute('SELECT id, title, text FROM entries ORDER BY id DESC')
		entries = [dict(id=row[0], title=row[1], text=row[2]) for row in cur.fetchall()]
		return render_template('peekatentrylist.html', entries=entries)
	else:
		return render_template('login.html', error='You are not logged in!')

def query_db(query, args=(), one=False):
    cur = g.db.execute(query, args)
    rv = [dict((cur.description[idx][0], value)
               for idx, value in enumerate(row)) for row in cur.fetchall()]
    return (rv[0] if rv else None) if one else rv

@app.route('/edit_entry/<int:post_id>')
def edit_entry(post_id):
	if session['logged_in'] == True:
		entry = query_db('SELECT title, text FROM entries WHERE id='+str(post_id))
		return render_template('edit.html', entry=entry, post_id=post_id)
	else:
		return redirect(url_for('login'))

@app.route('/update_entry', methods=['POST'])
def update_entry():
	if not session.get('logged_in'):
		abort(401)
	g.db.execute("UPDATE entries SET title='%(posttitle)s', text='%(postcontent)s' WHERE id=%(id)s" % request.form)
	g.db.commit()
	flash('successfully updated database')
	return redirect(url_for('read_entries'))

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