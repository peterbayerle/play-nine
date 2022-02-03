import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Board } from '../components/Board';

import './Home.css'

export const Game = ({ socket }) => {
  const params = useParams();
  const lobbyId = params.lobbyId
  const [joined, setJoined] = useState(null)

  useEffect(() => {
    socket.emit('join_game', { lobby_id: lobbyId, player_id: socket.id })

    const recievedJoinStatus = ({ joined }) => {
      setJoined(joined);
    };

    socket.on('join_status', recievedJoinStatus);

    return () => {
      socket.emit('leaving');
      socket.off('join_status', recievedJoinStatus);
    }
  // eslint-disable-next-line
  }, [socket]);

  return (
    <div id="game-page">
      { joined === true
        ? <div>
          <h3 className="text-center pt-4">Lobby: {lobbyId}</h3>
          <Board 
            opponentCards={[0,1,2,3,4,5,6,7].map(value => { return {value, clickable: false, faceUp: false, onClick: () => {}}; })} 
            myCards={[8,9,10,11,12,13,14,15].map(value => { return {value, clickable: false, faceUp: true, onClick: () => {}}; })} 
            topDiscard={{value: 0, faceUp: true, clickable: false, onClick: () => {}}} 
            topDeck={{value: -5, faceUp: false, clickable: false, onClick: () => {}}}
          />
        </div>
        : joined === false && <h1> failed to join :( </h1>
      }
    </div>
  )

}