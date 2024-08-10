from flask import Flask, Blueprint, redirect, url_for


app = Flask(__name__, static_url_path="/files")

from walking_knights import app as walking_knights_app

app.register_blueprint(walking_knights_app.walking_knights)
app.run(debug=True)
