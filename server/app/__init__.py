from flask import Flask
from flask_socketio import SocketIO
from app.games_manager import GamesManager

socketio = SocketIO(cors_allowed_origins="*")
games_manager = GamesManager()

def create_app(debug=False):
    app = Flask(__name__, instance_relative_config=True)
    app.debug = debug
    app.config.from_mapping(
        SECRET_KEY="dev",
    )

    from app import events
    socketio.init_app(app)

    return app

