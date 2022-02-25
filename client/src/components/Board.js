import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { Card } from './Card';
import { PlayerHand } from './PlayerHand';

import Alert from 'react-bootstrap/Alert';


export const Board = ({ opponentCards, myCards, topDiscard, topDeck, scores, skip }) => {  
  const GameOverAlert = () => {
    const { myScore, opponentScore } = scores;
    
    if (myScore < opponentScore) {
      var variant = "success";
      var message = `🤗️ You won! You scored ${myScore} points over your opponent's ${opponentScore}`;
    } else if (myScore > opponentScore) {
      variant = "danger";
      message = `😭️ You lost ... you scored ${myScore} points and your opponent scored ${opponentScore}`
    } else {
      variant = "warning";
      message = `🤝️ You tied! Both of you scored ${myScore} points`
    }

    return (
      <Row className="mt-4 d-flex justify-content-center">
        <Alert variant={variant}>{ message }</Alert>
      </Row>    
    )
  }
  
  const Piles = () => (
    <Container className="pt-4">
      <Row className="d-flex justify-content-center">
        {[{name: 'Discard', ...topDiscard}, {name: 'Deck', ...topDeck}].map(
          ({name, ...rest}, idx)  => {
            return (
              <div className='d-flex flex-column pl-3 pr-3' key={idx}>
                <Card
                  {...rest}
                  variant="outline-secondary"
                />
                <p className="font-weight-light text-center pt-1">{name}</p>
              </div>
            )}
          )
        }
      </Row>
    </Container>
  );

  const SkipTurnButton = () => (
    <Row className="mt-4 d-flex justify-content-center">
      <Button variant="link" onClick={skip}>Skip Turn</ Button>
    </Row> 
  )

  return (
    <div className="pt-2">
      <PlayerHand cards={opponentCards} player="opponent"/>
      <Piles />
      <PlayerHand cards={myCards} player="you"/>
      {scores && <GameOverAlert />}
      {skip && <SkipTurnButton />}
    </div>
  );
};

