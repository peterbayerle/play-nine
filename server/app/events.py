from flask_socketio import emit, join_room
from flask import request
from . import socketio
from . import games_manager
from app.utils import log

@socketio.on("create_game")
def handle_create_game():
    lobby_id = games_manager.add_game()

    emit("game_created", {"lobby_id": lobby_id})

@socketio.on("join_game")
def handle_join_game(json):
    player_id = request.sid #json["player_id"] 
    lobby_id = json["lobby_id"]

    added_player = games_manager.add_player(lobby_id, player_id)

    if added_player:
        join_room(lobby_id)
        
    emit("join_status", {"joined": added_player})

def handle_player_leaving():
    player_id = request.sid #json['player_id']
    games_manager.remove_player(player_id)

    log(f'{player_id} has left')

socketio.on_event("disconnect", handle_player_leaving)
socketio.on_event("leaving", handle_player_leaving) # handles case when back button in browser is pressed


