from app.utils import generate_code, log
from app.play_nine import PlayNine

class Game: 
    def __init__(self, lobby_id):
        self.lobby_id = lobby_id
        self.game = PlayNine()
        self.players = {
            'p1': None,
            'p2': None,
        }

    def add_player(self, player_id):
        if player_id in self.players.values():
            return True
        elif not self.players['p1']:
            self.players['p1'] = player_id
            return True
        elif not self.players['p2']:
            self.players['p2'] = player_id
            return True

        return False

    def remove_player(self, player_id):
        if self.players['p1'] == player_id:
            self.players['p1'] = None
        else:
            self.players['p2'] = None

    @property 
    def num_players(self):
        c = 0
        c += 1 if self.players['p1'] else 0
        c += 1 if self.players['p2'] else 0
        return c

    def __repr__(self):
        return f'Game({self.lobby_id=}, {self.players=})'

class GamesManager: 
    def __init__(self):
        self.lobby_to_game = {} # maps lobby id to game
        self.player_to_lobby = {} # maps player id to lobby id

    def has_space_available(self, lobby_id):
        game = self.lobby_to_game.get(lobby_id)
        if not game: return False

        return game.num_players < 2

    def add_game(self):
        lobby_id = generate_code(excluding=self.lobby_to_game.keys())
        self.lobby_to_game[lobby_id] = Game(lobby_id)

        return lobby_id

    def add_player(self, lobby_id, player_id):
        game = self.lobby_to_game.get(lobby_id)
        if not game: return False

        player_added = game.add_player(player_id)
        if player_added:
            self.player_to_lobby[player_id] = lobby_id
            log(f'{player_id} added to {game}')
        
        return player_added

    def remove_player(self, player_id):
        lobby_id = self.player_to_lobby.get(player_id, False)

        if lobby_id:
            del self.player_to_lobby[player_id]

            game = self.lobby_to_game[lobby_id]
            game.remove_player(player_id)
            log(f'{player_id} removed from {game}')

            if not game.num_players:
                del self.lobby_to_game[lobby_id]
                log(f'{lobby_id} deleted')