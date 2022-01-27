import unittest 
from app.play_nine import PlayNine, Card


class TestPlayNine(unittest.TestCase):
    def test_deck_and_discard(self):
        play_nine = PlayNine()
        self.assertEqual(len(play_nine.deck), 108)

        for _ in range(107):
            play_nine.deck_to_discard()

        self.assertEqual(len(play_nine.deck), 1)
        self.assertEqual(len(play_nine.discard), 107)

        play_nine.deck_to_discard()

        self.assertEqual(len(play_nine.deck), 108)
        self.assertEqual(len(play_nine.discard), 0)

    def test_player_moves(self):
        play_nine = PlayNine()
        play_nine.deal()

        # flip card in hand
        self.assertFalse(play_nine.hands["p1"][0].face_up)
        play_nine.flip("p1", 0)
        self.assertTrue(play_nine.hands["p1"][0].face_up)

        # move card from deck to hand
        top_deck_value = play_nine.deck[-1].value
        prev_p1_card_value = play_nine.hands["p1"][1].value
        play_nine.deck_to_hand("p1", 1)

        self.assertEqual(
            top_deck_value,
            play_nine.hands["p1"][1].value
        )
        self.assertEqual(
            prev_p1_card_value,
            play_nine.discard[-1].value
        )
        
        # move card from discard to hand
        top_discard_value = play_nine.discard[-1].value
        prev_p2_card_value = play_nine.hands["p2"][0].value
        play_nine.discard_to_hand("p2", 0)

        self.assertEqual(
            top_discard_value,
            play_nine.hands["p2"][0].value
        )
        self.assertEqual(
            prev_p2_card_value,
            play_nine.discard[-1].value
        )

        # move deck to discard
        top_deck_value = play_nine.deck[-1].value
        play_nine.deck_to_discard()

        self.assertEqual(
            top_deck_value,
            play_nine.discard[-1].value
        ) 

        # num face up test
        self.assertEqual(play_nine.num_face_up("p1"), 2)
        self.assertEqual(play_nine.num_face_up("p2"), 1)

    def test_stage(self):
        play_nine = PlayNine()
        play_nine.deal()
        self.assertEqual(play_nine.stage, "tee_up")

        play_nine.flip("p1", 0)
        play_nine.flip("p1", 1)
        self.assertEqual(play_nine.stage, "tee_up")
        play_nine.flip("p2", 0)
        play_nine.flip("p2", 1)
        self.assertEqual(play_nine.stage, "play")

        for i in range(2, 7):
            play_nine.flip("p1", i)
            play_nine.flip("p2", i)
            self.assertEqual(play_nine.stage, "play")

        play_nine.flip("p1", 7)
        play_nine.flip("p2", 7)
        self.assertEqual(play_nine.stage, "end")



