from flask import Flask, render_template, request, jsonify, Blueprint
from .knights import knight_walk


walking_knights = Blueprint(
    "walking_knights",
    __name__,
    template_folder="templates",
    static_folder="static",
    static_url_path="/walking-knights/static",
)


@walking_knights.route("/")
def walking_knights_index():
    return render_template("walking_knights_index.html")


@walking_knights.route("/knight_walk_move", methods=["POST"])
def get_knight_walk_move():
    data = request.json
    start_sq = data.get("start_square")
    end_sq = data.get("end_square")

    moves = knight_walk(start_sq, end_sq)

    return jsonify(
        {
            "moves": moves,
        }
    )
