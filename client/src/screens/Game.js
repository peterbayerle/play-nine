import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


export const Game = ({ socket }) => {
    const [joined, setJoined] = useState(false);
    const navigate = useNavigate();
    const params = useParams();
    const lobbyId = params.lobbyId

    useEffect(() => {
        socket.emit('join_game', { lobby_id: lobbyId })

        socket.on('game_joined', ({ lobby_id }) => {
            setJoined(true)
            console.log('joined', lobby_id)
        });

        socket.on('failed_to_join', () => {
            navigate('/', {state: {failedToJoin: true, lobbyId}});
        });
    // eslint-disable-next-line
    }, [socket]);

    return joined ? (
        <div>
            <h1>lobby id: {lobbyId}</h1>
        </div>
    ) : null
}