import unittest 
from app import create_app, socketio


class TestServer(unittest.TestCase):
    def setUp(self):
        self.app = create_app("testing")
        self.client1 = socketio.test_client(self.app)
        self.client2 = socketio.test_client(self.app)
        self.client3 = socketio.test_client(self.app)
    
    def test_socketio(self):
        # user creates game
        self.client1.emit("create_game") 
        lobby_id = self.client1.get_received().pop().get("args").pop().get("lobby_id")
        
        self.client1.emit("join_game", {"lobby_id": lobby_id, "player_id": 1})
        self.assertEqual(self.client1.get_received().pop().get("name"), "game_joined")
        
        self.client2.emit("join_game", {"lobby_id": lobby_id, "player_id": 2})
        self.assertEqual(self.client2.get_received().pop().get("name"), "game_joined")

        self.client3.emit("join_game", {"lobby_id": lobby_id, "player_id": 3})
        self.assertEqual(self.client3.get_received().pop().get("name"), "failed_to_join")

        # users disconnect
        self.client1.disconnect()
        self.client2.disconnect()
        self.client3.disconnect()
