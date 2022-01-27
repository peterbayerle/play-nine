import { useState, useEffect } from 'react';
const { io } = require('socket.io-client');

export const SocketIOClient = ({ router }) => {
    const [socket, setSocket] = useState({
        on: () => {},
        emit: () => {},
    });

    const [lobbyId, setLobbyId] = useState('');
    const [failedToJoin, setFailedToJoin] = useState(false);

    useEffect(() => {
        const s = io('http://127.0.0.1:5000/');
        s.on('connect', () => {
            setSocket(s);
        })
    }, []);

    useEffect(() => {
        socket.on('game_joined', ({lobby_id}) => {
            setLobbyId(lobby_id);
        });

        socket.on('failed_to_join', () => {
            setFailedToJoin(true);
        })

    }, [socket]);

    useEffect(() => {

    }, [lobbyId]);

    return <>{router({socket, lobbyId, failedToJoin})}</>
}