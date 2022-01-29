from flask_socketio import emit, join_room
from . import socketio
from . import games_manager

from collections import namedtuple 
temp = namedtuple("temp", "players")([])

@socketio.on("player_joined")
def handle_connect(json):
    player_id = json["player_id"]
    print('>>>>>', player_id, 'joined')

    @socketio.on("disconnect")
    def handle_disconnect():
        print('>>>>>', player_id, 'disconnected')
        games_manager.remove_player(player_id)

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
    player_id = json["player_id"] 
    lobby_id = json["lobby_id"]

    added_player = games_manager.add_player(lobby_id, player_id)

    if added_player:
        join_room(lobby_id)
        emit("game_joined", {"lobby_id": lobby_id}, to=lobby_id)
    else:
        emit("failed_to_join")

    print(f'{player_id} tried to join Game({lobby_id=}, {games_manager.lobby_to_game.get(lobby_id, temp).players})')

@socketio.on("back_button_pressed")
def handle_back_button_pressed(json):
    player_id = json['player_id']
    games_manager.remove_player(player_id)

    print('>>>>>', player_id, 'left')