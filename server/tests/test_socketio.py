import unittest 
from app import create_app, socketio


def get_resp_arg(client, arg_name):
    return client.get_received().pop().get("args").pop().get(arg_name)


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
        
        # first client tries to join
        self.client1.emit("join_game", {"lobby_id": lobby_id,})
        self.assertEqual(get_resp_arg(self.client1, "joined"), True)
        
        # second client joins
        self.client2.emit("join_game", {"lobby_id": lobby_id})
        self.assertEqual(get_resp_arg(self.client2, "joined"), True)

        self.client3.emit("join_game", {"lobby_id": lobby_id})
        self.assertEqual(get_resp_arg(self.client3, "joined"), False)

        # first client disconnects and third sucessfully joins
        self.client1.disconnect()
        self.client3.emit("join_game", {"lobby_id": lobby_id})
        self.assertEqual(get_resp_arg(self.client3, "joined"), True)

        # second and third client disconnect, and fourth fails to join
        self.client2.disconnect()
        self.client3.disconnect()

        self.client4.emit("join_game", {"lobby_id": lobby_id})
        self.assertEqual(get_resp_arg(self.client4, "joined"), False)
