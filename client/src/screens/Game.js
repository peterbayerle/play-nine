import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";


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
        <div>
            { joined === true
              ? <h1>lobby id: {lobbyId}</h1>
              : joined === false 
              ? <h1> failed to join </h1>
              : null
            }
        </div>
    )

}