from random import shuffle
from dataclasses import dataclass


@dataclass
class Card:
    value: int
    face_up: bool

    def __json__(self):
        return {
            "value": self.value, 
            "face_up": self.face_up,
        }


class PlayNineBoard: 
    def __init__(self):
        self._deck = []
        self.discard = [Card(value=i, face_up=True) for _ in range(8) for i in range(13)]
        self.discard += [Card(value=-5, face_up=True) for _ in range(4)]
        self.hands = {"p1": [], "p2": []}
        self.turn = "p1"
        self.deal()

    def score_hand(self, player_num):
        hand = self.hands[player_num]
        points = 0
        seen_pairs = {}

        for card_up, card_lo in zip(hand[:4], hand[4:]):
            if card_up.value == card_lo.value:
                if card_up.value == -5:
                    points += -10
                if card_up.value in seen_pairs.keys():
                    seen_pairs[card_up.value] += 1
                else:
                    seen_pairs[card_up.value] = 1
            else:
                points += card_up.value + card_lo.value
        for num in seen_pairs.values():
            points += [0, -10, -15, -20][num - 1]
        
        return points

    @property
    def scores(self):
        if self.stage != 'end': return None
        return {
            "p1": self.score_hand("p1"),
            "p2": self.score_hand("p2"),
        }


    @property
    def deck(self):
        if not self._deck:
            self._deck, self.discard = self.discard, self._deck
            for c in self._deck:
                c.face_up = False

            shuffle(self._deck)
        
        return self._deck

    def deal(self):
        self.hands = {
            player: [self.deck.pop() for _ in range(8)]
            for player in ("p1", "p2") 
        }

    def num_face_up(self, player):
        return sum(c.face_up for c in self.hands[player])

    @property 
    def stage(self):
        num_face_up_p1 = self.num_face_up("p1")
        num_face_up_p2 = self.num_face_up("p2")
        
        if num_face_up_p1 + num_face_up_p2 < 4:
            return "tee_off"
        elif num_face_up_p1 < 8 or num_face_up_p2 < 8:
            return "play"
        else:
            return "end"

    def flip(self, player_num, card_num):
        if card_num == 'deck':
            self._deck[-1].face_up = True
        elif card_num == 'discard':
            ...
        else:
            self.hands[player_num][card_num].face_up = True
            self.switch_turn()

    def flip_all(self, player_num):
        hand = self.hands[player_num]
        for card_num in range(8):
            hand[card_num].face_up = True

    def discard_to_hand(self, player_num, card_num):
        old = self.hands[player_num][card_num]
        new = self.discard.pop()

        new.face_up = old.face_up = True

        self.discard.append(old)
        self.hands[player_num][card_num] = new

        self.switch_turn()

    def deck_to_hand(self, player_num, card_num):
        old = self.hands[player_num][card_num]
        new = self.deck.pop()

        new.face_up = old.face_up = True

        self.discard.append(old)
        self.hands[player_num][card_num] = new

        self.switch_turn()

    def deck_to_discard(self):
        old = self.deck.pop()
        old.face_up = True

        self.discard.append(old)

    def switch_turn(self):
        # if other person has 8 flipped up, then  
        old_turn = self.turn       
        self.turn = "p1" if self.turn == "p2" else "p2"
        if self.num_face_up(self.turn) == 8:
            self.flip_all(old_turn)

    def __json__(self):
        return {
            "top_deck": self.deck[-1],
            "top_discard": self.discard[-1] if self.discard else None,
            "hands": self.hands,
            "stage": self.stage,
            "turn": self.turn,
            "scores": self.scores,
        }
    

    
