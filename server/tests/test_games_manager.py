import unittest 
from app.games_manager import Game, GamesManager


class TestServer(unittest.TestCase):
    def setUp(self):
        self.game = Game('test')
        self.games_manager = GamesManager()
    
    def test_games_manager(self):
        lobby_id = self.games_manager.add_game()
        lobby_id2 = self.games_manager.add_game()

        self.assertTrue(self.games_manager.add_player(lobby_id2, 1)) 

        self.assertTrue(self.games_manager.add_player(lobby_id, 1))        
        self.assertTrue(self.games_manager.add_player(lobby_id, 2))
        self.assertFalse(self.games_manager.add_player(lobby_id, 3))

        self.games_manager.remove_player(1)        
        self.assertTrue(self.games_manager.add_player(lobby_id, 3))

    def test_game(self):
        self.game.add_player(1)
        self.game.add_player(2)
        self.assertTrue(1 in self.game.players.values())
        self.assertTrue(2 in self.game.players.values())

        self.game.remove_player(1)
        self.assertFalse(1 in self.game.players.values())
        self.game.remove_player(2)
        self.assertTrue(self.game.is_empty())





       

