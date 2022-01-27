import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'

import './Home.css'

export const Home = ({ socket, failedToJoin, lobbyId }) => {
    const [fieldEntry, setFieldEntry] = useState('');

    const createGame = () => {
        socket.emit("create_game");
    }

    const submitFieldEntry = () => {
        socket.emit("join_game", { player_id: socket.id, lobby_id: fieldEntry })
    };

    return ( 
        <Container id="home-page">
            <h1 className="text-center pt-3">️🏌️‍♂️ Play Nine! 🏌️‍♀️ {lobbyId}</h1>
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
                        className={`${failedToJoin ? 'is-invalid' : ''} rounded-left`}
                        onSubmit={submitFieldEntry}
                        onChange={event => { setFieldEntry(event.target.value); }}
                    />
                    <Button 
                        className="rounded" 
                        variant="info"
                        onClick={submitFieldEntry}
                    >
                        Join game
                    </Button>
                    <Form.Control.Feedback type="invalid">
                        This lobby is full or does not exist!
                    </Form.Control.Feedback>
                </InputGroup>
            </div>
        </Container>
    );
};
