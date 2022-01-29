import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'
import { useNavigate, useLocation } from 'react-router-dom';

import './Home.css'

export const Home = ({ socket }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [fieldEntry, setFieldEntry] = useState('');
    const [failedToJoin, setFailedToJoin] = useState(location.state ? location.state.failedToJoin : false);

    const createGame = () => {
        socket.emit("create_game");
    }

    const submitFieldEntry = () => {
        socket.emit("has_space_available", { lobby_id: fieldEntry })
    };

    useEffect(() => {
        const recievedFailedToJoin = () => {
            setFailedToJoin(true);
        };

        const recievedSpaceAvailable = ({ lobby_id }) => {
            navigate(`/${lobby_id}`);
        };

        socket.on('failed_to_join', recievedFailedToJoin);
        socket.on('space_available', recievedSpaceAvailable);

        return () => {
            socket.off('failed_to_join', recievedFailedToJoin);
            socket.off('space_available', recievedSpaceAvailable);
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
                        defaultValue={failedToJoin && location.state ? location.state.lobbyId : ''}
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
