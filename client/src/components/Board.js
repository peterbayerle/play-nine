import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Card } from './Card';
import { PlayerHand } from './PlayerHand';

export const Board = ({ opponentCards, myCards, topDiscard, topDeck }) => {
  const Piles = () => {
    return (
      <Container>
        <Row className='d-flex justify-content-center pt-4'>
            {[{name: 'Discard', ...topDiscard}, {name: 'Deck', ...topDeck}].map(
              ({name, ...rest}, idx)  => {
              return (
                <div className='d-flex flex-column pl-3 pr-3' key={idx}>
                  <Card
                    {...rest}
                    variant="outline-secondary"
                  />
                  <p className='font-weight-light text-center pt-1'>{name}</p>
                </div>
              )}
            )
          }
        </Row>
      </Container>
    );
  };

  return (
    <div className="pt-2">
      <PlayerHand cards={opponentCards} player="opponent"/>
      <Piles />
      <PlayerHand cards={myCards} player="you"/>
    </div>
  );
};

