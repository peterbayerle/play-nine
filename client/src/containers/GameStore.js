export class GameStore {
  constructor(game, playerId, lobbyId, playerActionCallback = () => {}) {
    ({
      board: {
        hands: this.hands,
        stage: this.stage,
        top_deck: this.top_deck,
        top_discard: this.top_discard,
        turn: this.turn,
        scores: this._scores,
      },
      players: {
        p1: this.p1
      },
      first_action: this.firstAction,
    } = game);

    ([this.myNum, this.opponentNum] = this.p1 === playerId 
      ? ['p1', 'p2'] 
      : ['p2', 'p1']);

    this.lobbyId = lobbyId;
    this.playerActionCallback = playerActionCallback;
  };

  get numFaceUp() {
    return this.hands[this.myNum].reduce((prev, { face_up }) => 
      prev + face_up, 0
    );
  };

  get skip() {
    if (!this.myTurn || this.numFaceUp < 7 || this.firstAction !== 'deck_to_discard') return null
    else return () => { 
      this.playerActionCallback({ 
        move: 'skip',
        card_num: '',
        player_num: this.myNum,
        lobby_id: this.lobbyId,
      });
    }
  };

  get scores() {
    if (!this._scores) return null;
    return {
      myScore: this._scores[this.myNum],
      opponentScore: this._scores[this.opponentNum],
    }
  };

  get myTurn() {
    return this.turn === this.myNum || this.stage === 'tee_off'
  }

  get myCards() {
    return this.parseHands(this.myNum);
  };

  get opponentCards() {
    return this.parseHands(this.opponentNum);
  }

  get topDeck() {
    const {face_up, ...rest} = this.top_deck;

    return {
      faceUp: face_up, 
      clickable: this.myTurn && this.stage === 'play' && this.firstAction === '',
      onClick: () => { 
        this.playerActionCallback({ 
          move: 'flip',
          card_num: 'deck',
          player_num: this.myNum,
          lobby_id: this.lobbyId,
        });
      }, 
      ...rest}; 
  }

  get topDiscard() {
    const {face_up, ...rest} = this.top_discard || {};

    return {
      faceUp: face_up, 
      clickable: this.stage === 'play' &&  this.myTurn && 
        ((this.top_discard && this.firstAction === '') || this.firstAction === 'deck'),
      onClick: () => { 
        this.playerActionCallback({ 
          move: this.firstAction === '' ? 'flip' : 'deck_to_discard',
          card_num: 'discard',
          player_num: this.myNum,
          lobby_id: this.lobbyId,
        });
      }, 
      ...rest}; 
  }

  parseHands(playerNum) {
    const hand = this.hands[playerNum];
    const clickable = this.clickableHands(playerNum);

    return hand.map(({ face_up, ...rest }, idx) => { 
      return {
        faceUp: face_up, 
        clickable: clickable[idx], 
        onClick: this.clickHandler(playerNum, idx),
        ...rest 
      };
    });
  };

  clickHandler(playerNum, idx) {
    return () => {
      switch (this.stage) {
        case 'tee_off':
          var action = {
            move: 'flip',
            card_num: idx,
            player_num: playerNum,
            lobby_id: this.lobbyId,
          };
          break;
        case 'play':
          // deck face up => clicked deck. Else, clicked discard
          if (this.firstAction === 'deck') var move = 'deck_to_hand';
          else if (this.firstAction === 'discard') move = 'discard_to_hand';
          else move = 'flip';

          action = {
            move: move,
            card_num: idx,
            player_num: playerNum,
            lobby_id: this.lobbyId,
          };
          break;
        default:
          action = {};
      }

      this.playerActionCallback(action);
    };
  };

  clickableHands(playerNum) {
    if (playerNum !== this.myNum || !this.myTurn) {
      return new Array(false);
    }

    const hand = this.hands[playerNum];

    switch (this.stage) {
      case 'tee_off':
        return hand.map(({ face_up }) => this.numFaceUp < 2 && !face_up )
      case 'play':
        return hand.map(({ face_up }) => this.firstAction === 'deck' || 
          this.firstAction === 'discard' || 
          (this.firstAction === 'deck_to_discard' && !face_up))
      default:
        return new Array(false);
    }
  };

}

