import { Typography } from '../../utils/Typography/Typography';
import { RoadmapCardProps } from './RoadmapCard.props';
import './RoadmapCard.css';

export function RoadmapCard({ step, title, description }: RoadmapCardProps) {
  return (
    <div>
      <div className='roadmap_card__step'>
        <Typography variant='caption' className='typography-roadmap_step'>
          {step}
        </Typography>
      </div>
      <div className='roadmap_card__text'>
        <Typography variant='body1' className='typography-roadmap_title'>
          {title}
        </Typography>
        <ul>
          {description.map((el: string, i: number) => (
            <li key={i}>
              <Typography
                variant='body2'
                className='typography-roadmap_description'
              >
                {el}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
