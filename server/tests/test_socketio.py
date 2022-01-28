import unittest 
from app import create_app, socketio


class TestServer(unittest.TestCase):
    def setUp(self):
        self.app = create_app("testing")
        self.client1 = socketio.test_client(self.app)
        self.client2 = socketio.test_client(self.app)
        self.client3 = socketio.test_client(self.app)
        self.client4 = socketio.test_client(self.app)
    
    def test_socketio(self):
        # user creates game
        self.client1.emit("create_game") 
        lobby_id = self.client1.get_received().pop().get("args").pop().get("lobby_id")
        
        # first client checks if space is available and joins
        self.client1.emit("has_space_available", {"lobby_id": lobby_id})
        resp = self.client1.get_received()[0]
        self.assertEqual(resp.get("name"), "space_available")
        self.assertEqual(resp.get("args").pop().get("lobby_id"), lobby_id)

        self.client1.emit("join_game", {"lobby_id": lobby_id,})
        self.assertEqual(self.client1.get_received().pop().get("name"), "game_joined")
        
        # second client joins
        self.client2.emit("join_game", {"lobby_id": lobby_id})
        self.assertEqual(self.client2.get_received().pop().get("name"), "game_joined")

        # third client checks if space available and fails to join
        self.client3.emit("has_space_available", {"lobby_id": lobby_id})
        self.assertEqual(self.client3.get_received().pop().get("name"), "failed_to_join")

        self.client3.emit("join_game", {"lobby_id": lobby_id})
        self.assertEqual(self.client3.get_received().pop().get("name"), "failed_to_join")

        # first client disconnects and third sucessfully joins
        self.client1.disconnect()
        self.client3.emit("join_game", {"lobby_id": lobby_id})
        self.assertEqual(self.client3.get_received().pop().get("name"), "game_joined")

        # second and third client disconnect, and fourth fails to join
        self.client2.disconnect()
        self.client3.disconnect()

        self.client4.emit("has_space_available", {"lobby_id": lobby_id})
        self.assertEqual(self.client4.get_received().pop().get("name"), "failed_to_join")

        self.client4.emit("join_game", {"lobby_id": lobby_id})
        self.assertEqual(self.client4.get_received().pop().get("name"), "failed_to_join")
