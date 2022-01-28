import { useState, useEffect } from 'react';
const { io } = require('socket.io-client');

export const SocketIOClient = ({ router }) => {
    const [socket, setSocket] = useState({
        on: () => {},
        emit: () => {},
    });

    useEffect(() => {
        const s = io('http://127.0.0.1:5000/');
        s.on('connect', () => {
            setSocket(s);
        })
    }, []);

    return <>{router({socket})}</>
}