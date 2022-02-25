from flask_socketio import emit, join_room
from flask import request
from json import JSONEncoder
from . import socketio
from . import games_manager
from app.utils import log

# handle JSON serialization
def _default(self, obj):
    return getattr(obj.__class__, '__json__', _default.default)(obj)

_default.default = JSONEncoder().default
JSONEncoder.default = _default

# socketio events
@socketio.on("create_game")
def handle_create_game():
    lobby_id = games_manager.add_game()

    emit("game_created", {"lobby_id": lobby_id})

@socketio.on("join_game")
def handle_join_game(json):
    player_id = request.sid #json["player_id"] 
    lobby_id = json["lobby_id"]

    added_player = games_manager.add_player(lobby_id, player_id)
    game_json = {}

    if added_player:
        join_room(lobby_id)
        game_json = games_manager.get_game_json(lobby_id)
        
    emit("join_status", {"joined": added_player})
    emit("update_game", {"gameJson": game_json})

@socketio.on("player_action")
def handle_player_action(json):
    lobby_id = json["lobby_id"]
    player_num = json["player_num"]
    card_num = json["card_num"]
    move = json["move"]

    games_manager.handle_player_action(lobby_id, player_num, card_num, move)
    game_json = games_manager.get_game_json(lobby_id)

    emit("update_game", {"gameJson": game_json}, room=lobby_id)

def handle_player_leaving():
    player_id = request.sid #json['player_id']
    games_manager.remove_player(player_id)

    log(f'{player_id} has left')

socketio.on_event("disconnect", handle_player_leaving)
socketio.on_event("leaving", handle_player_leaving) # handles case when back button in browser is pressed


