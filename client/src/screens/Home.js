import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import { useNavigate } from 'react-router-dom';

import './Home.css'

export const Home = ({ socket }) => {
    const [fieldEntry, setFieldEntry] = useState('');
    const navigate = useNavigate();

    const createGame = () => {
        socket.emit("create_game");
    }

    const recievedGameCreated = ({ lobby_id }) => {
        navigate(`/${lobby_id}`);
    }

    const submitFieldEntry = _ => { recievedGameCreated({lobby_id: fieldEntry}); }

    useEffect(() => {
        socket.on('game_created', recievedGameCreated);

        return () => {
            socket.off('game_created', recievedGameCreated);
        }
    // eslint-disable-next-line
    }, [socket])

    return ( 
        <Container id="home-page">
            <h1 className="text-center pt-3">️🏌️‍♂️ Play Nine! 🏌️‍♀️</h1>
            <div className="d-flex flex-column justify-content-center pt-2">
                <Button
                    variant="info"
                    onClick={createGame}
                >
                    Create New Game
                </Button>

                <InputGroup className="mb-3 pt-3">
                    <FormControl
                        placeholder="Lobby Id"
                        aria-label="Enter Lobby Id"
                        className={"rounded-left"}
                        // onSubmit={submitFieldEntry}
                        onChange={event => { setFieldEntry(event.target.value); }}
                    />
                    <Button 
                        className="rounded" 
                        variant="info"
                        onClick={submitFieldEntry}
                        disabled={fieldEntry.length !== 4}
                    >
                        Join game
                    </Button>
                </InputGroup>
            </div>
        </Container>
    );
};
