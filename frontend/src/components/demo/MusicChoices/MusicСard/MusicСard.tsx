import { MusicСardProps } from './MusicСard.props';
import './MusicСard.css';

export function MusicСard({
  id,
  header,
  description,
  handleAcceptGenerate,
}: MusicСardProps) {
  return (
    <div
      className='demo_music_card__wrapper'
      onClick={() => handleAcceptGenerate(id)}
    >
      <div className='demo_music_card__header'>{header}</div>
      <div className='demo_music_card__description'>{description}</div>
    </div>
  );
}
