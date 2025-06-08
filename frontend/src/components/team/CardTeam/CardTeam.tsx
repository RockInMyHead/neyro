import { useState } from 'react';
import './CardTeam.css';
import { ImgContainer } from '../../utils/ImgContainer/ImgContainer';
import { CardTeamProps } from './CardTeam.props';
import { Typography } from '../../utils/Typography/Typography';

export function CardTeam({
  person,
  role,
  img,
  description,
  id,
}: CardTeamProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`card_team__wrapper ${flipped ? 'flipped' : ''} ${
        id % 2 !== 0 ? 'second' : ''
      }`}
    >
      <div className='card_team__inner'>
        {/* FRONT */}
        <div className='card_team__face card_team__front'>
          <ImgContainer>
            <img src={img} alt='Подробнее' />
          </ImgContainer>
          <div className='card_team__info'>
            <Typography className='card_team__name' variant='body1'>
              {person}
            </Typography>
            <Typography className='card_team__role light_gray' variant='body2'>
              {role}
            </Typography>
          </div>
          <div className='card_team__icon' onClick={() => setFlipped(true)}>
            <ImgContainer>
              <img src='./info.svg' alt='Подробнее' />
            </ImgContainer>
          </div>
        </div>

        {/* BACK */}
        <div className='card_team__face card_team__back'>
          <Typography className='card_team__description' variant='body2'>
            {description}
          </Typography>
          <a className='card_team__link' href='#'>
            Узнать подробнее
          </a>
          <div className='card_team__icon' onClick={() => setFlipped(false)}>
            <ImgContainer>
              <img src='./info.svg' alt='Подробнее' />
            </ImgContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
