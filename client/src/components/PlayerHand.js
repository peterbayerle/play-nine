import Row from 'react-bootstrap/Row';
import { Card } from './Card';

export const PlayerHand = ({cards, player}) => {
  const CardRow = ({cards}) => {
    return (
    <Row className='justify-content-center pt-2'>
      {cards.map(
        (props, idx) => (
          <div className='pr-2' key={idx}>
            <Card
              {...props}
              player={player}
            />
          </div>
        ))}
    </Row>
  )};

  return (
    <div>
      <CardRow cards={cards.slice(0, 4)} />
      <CardRow cards={cards.slice(4)}/>
    </div>
  );
}