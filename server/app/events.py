from flask_socketio import emit, join_room, leave_room
from . import socketio
from . import games_manager

@socketio.on("create_game")
def handle_create_game():
    lobby_id = games_manager.add_game()

    emit("game_joined", {"lobby_id": lobby_id})

@socketio.on("join_game")
def handle_join_game(json):
    player_id = json["player_id"]
    lobby_id = json["lobby_id"]
    added_player = games_manager.add_player(lobby_id, player_id)

    if added_player:
        join_room(lobby_id)
        emit("game_joined", to=lobby_id)
    else:
        emit("failed_to_join")

@socketio.on("disconnecting")
def handle_disconnecting(json):
    player_id = json["player_id"]
    lobby_id = json["lobby_id"]
    games_manager.remove_player(player_id)

    emit("player_disconnected", to=lobby_id)

