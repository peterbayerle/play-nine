import { useState, useEffect } from 'react';
const { io } = require('socket.io-client');

export const SocketIOClient = ({ children }) => {
    const [socket, setSocket] = useState({
        on: () => {},
        off : () => {},
        emit: () => {},
    });

    useEffect(() => {
        const recievedConnect = (s) => {
            setSocket(s);
            s.emit('player_connect', {player_id: s.id});
        };

        const _socket = io('http://127.0.0.1:5000/');
        _socket.on('connect', () => { 
            recievedConnect(_socket) 
        });
    }, []);

    return <>{children({socket})}</>
}