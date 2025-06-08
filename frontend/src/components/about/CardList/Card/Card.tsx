import { Typography } from '../../../utils/Typography/Typography';
import { CardProps } from './Card.props';
import { styledCard } from './Card.styled';

export function Card({ title, img }: CardProps) {
  return (
    <div style={styledCard(img)}>
      <Typography variant='body1' className='about_card__text'>{title}</Typography>
    </div>
  );
}
