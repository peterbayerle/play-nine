import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { useNavigate } from 'react-router-dom';

import './Home.css'

export const Home = ({ socket }) => {
  const [fieldEntry, setFieldEntry] = useState('');
  const navigate = useNavigate();

  const recievedGameCreated = ({ lobby_id }) => {
    navigate(`/${lobby_id}`);
  };

  useEffect(() => {
    socket.on('game_created', recievedGameCreated);

  // eslint-disable-next-line
  }, [socket])

  return ( 
    <div>
      <h1 className="text-center pt-3">️🏌️‍♂️ Play Nine! 🏌️‍♀️</h1>
        <Container id="home-page">
          <div className="d-flex flex-column justify-content-center pt-2">
            <Button
                variant="info"
                onClick={() => { socket.emit("create_game"); }}
            >
                Create New Game
            </Button>

            <div>
              <InputGroup className="mb-3 pt-3">
                <FormControl
                  placeholder="Lobby Id"
                  aria-label="Enter Lobby Id"
                  aria-describedby="basic-addon2"
                  onChange={event => setFieldEntry(event.target.value)}
                  className="rounded-left"
                />
                <InputGroup.Append>
                <Button
                  className="rounded-right"
                  variant="info"
                  onClick={_ => { recievedGameCreated({lobby_id: fieldEntry}); }}
                  disabled={fieldEntry.length !== 4}
                >Join game</Button>
                </InputGroup.Append>
            </InputGroup>
          </div>
        </div>
      </Container>
  </div>
  );
};
