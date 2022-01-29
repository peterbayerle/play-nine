import { useState, useEffect } from 'react';
const { io } = require('socket.io-client');

export const SocketIOClient = ({ router }) => {
    const [socket, setSocket] = useState({
        on: () => {},
        off : () => {},
        emit: () => {},
    });

    useEffect(() => {
        const s = io('http://127.0.0.1:5000/');

        const recievedConnect = () => {
            setSocket(s);
        };

        s.on('connect', recievedConnect);

        return () => {
            s.off('connect', recievedConnect);
        }
    }, []);

    useEffect(() => {
        socket.emit('player_joined', {player_id: socket.id});
    }, [socket])

    return <>{router({socket})}</>
}