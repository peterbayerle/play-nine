import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


export const Game = ({ socket }) => {
    const [joined, setJoined] = useState(false);
    const navigate = useNavigate();
    const params = useParams();
    const lobbyId = params.lobbyId

    useEffect(() => {
        const recievedGameJoined = ({ lobby_id }) => {
            setJoined(true)
            console.log('joined', lobby_id)
        };

        const recievedFailedToJoin = () => {
            navigate('/', {state: {failedToJoin: true, lobbyId}});
        };

        socket.emit('join_game', { lobby_id: lobbyId, player_id: socket.id })

        socket.on('game_joined', recievedGameJoined);
        socket.on('failed_to_join', recievedFailedToJoin);

        return () => {
            socket.emit('back_button_pressed', {player_id: socket.id});
            socket.off('game_joined', recievedGameJoined);
            socket.off('failed_to_join', recievedFailedToJoin);
        }
    // eslint-disable-next-line
    }, [socket]);

    return joined ? (
        <div>
            <h1>lobby id: {lobbyId}</h1>
        </div>
    ) : null
}