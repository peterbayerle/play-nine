from flask import request
from flask_socketio import emit, join_room
from . import socketio
from . import games_manager

@socketio.on("create_game")
def handle_create_game():
    lobby_id = games_manager.add_game()

    emit("space_available", {"lobby_id": lobby_id})

@socketio.on("has_space_available")
def handle_check_space(json):
    lobby_id = json["lobby_id"]
    space_available = games_manager.has_space_available(lobby_id)

    if space_available:
        emit("space_available", {"lobby_id": lobby_id})
    else:
        emit("failed_to_join")

@socketio.on("join_game")
def handle_join_game(json):
    player_id = request.sid 
    lobby_id = json["lobby_id"]
    added_player = games_manager.add_player(lobby_id, player_id)

    if added_player:
        join_room(lobby_id)
        emit("game_joined", {"lobby_id": lobby_id}, to=lobby_id)
    else:
        emit("failed_to_join")

@socketio.on("disconnect")
def handle_disconnect():
    player_id = request.sid 
    games_manager.remove_player(player_id)

    emit("player_disconnected")

