from random import shuffle
from dataclasses import dataclass


@dataclass
class Card:
    value: int
    face_up: bool


class PlayNine: 
    def __init__(self):
        self._deck = []
        self.discard = [Card(value=i, face_up=True) for _ in range(8) for i in range(13)]
        self.discard += [Card(value=-5, face_up=True) for _ in range(4)]

    @property
    def deck(self):
        if not len(self._deck):
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
            return "tee_up"
        elif num_face_up_p1 < 8 or num_face_up_p2 < 8:
            return "play"
        else:
            return "end"

    def flip(self, player_num, card_num):
        self.hands[player_num][card_num].face_up = True

    def discard_to_hand(self, player_num, card_num):
        old = self.hands[player_num][card_num]
        new = self.discard.pop()

        new.face_up = True

        self.discard.append(old)
        self.hands[player_num][card_num] = new

    def deck_to_hand(self, player_num, card_num):
        old = self.hands[player_num][card_num]
        new = self.deck.pop()

        new.face_up = True

        self.discard.append(old)
        self.hands[player_num][card_num] = new

    def deck_to_discard(self):
        old = self.deck.pop()

        old.face_up = True

        self.discard.append(old)

    

    
