import Button from 'react-bootstrap/Button';

import './Card.css';

export const Card = ({value, onClick, player, faceUp, clickable}) => {
  let variant = faceUp ? 'outline-' : ''
  variant += player === 'opponent'
    ? 'warning'
    : player === 'me' 
    ? 'secondary'
    : 'info';
  
  return (
    <Button
      variant={variant}
      className='card-button'
      disabled={!clickable}
      style={{'fontSize':'25px'}}
      onClick={onClick}
    >
      {faceUp && value}
    </Button>
  );
};

