import { Board } from '../components/Board';
import { useState, useEffect } from 'react';
import { GameStore } from '../containers/GameStore';
import { useParams } from 'react-router-dom';

import './Home.css'

export const BoardScreen = ({ socket }) => { 
  const params = useParams();
  const lobbyId = params.lobbyId;
  const [joined, setJoined] = useState(null);
  const [game, setGame] = useState({
    myCards: [], opponentCards: [], topDeck: null, topDiscard: null,
  });

  const handlePlayerAction = (action) => {
    socket.emit('player_action', action);
  };

  useEffect(() => {
    socket.emit('join_game', { lobby_id: lobbyId, player_id: socket.id })

    socket.on('join_status', ({ joined }) => {
      setJoined(joined);
    });

    socket.on('update_game', ({ gameJson }) => {
      setGame(new GameStore(gameJson, socket.id, lobbyId, handlePlayerAction));
    });

    return () => {
      socket.emit('leaving');
    }
  }, [socket]);

  return (
    <div id="game-page">
      { joined === true
      ? <div>
          <h3 className="text-center pt-4">Lobby: {lobbyId}</h3>
          <Board 
            opponentCards={game.opponentCards} 
            myCards={game.myCards} 
            topDiscard={game.topDiscard} 
            topDeck={game.topDeck}
            scores={game.scores}
            skip={game.skip}
          />
      </div>
      : joined === false && <h1> failed to join :( </h1>
      }
    </div>
  );
};

