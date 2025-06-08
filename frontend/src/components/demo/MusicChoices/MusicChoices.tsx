import { ImgContainer } from '../../utils/ImgContainer/ImgContainer';
import { Typography } from '../../utils/Typography/Typography';
import { MusicСard } from './MusicСard/MusicСard';
import './MusicChoices.css';
import { MusicChoicesProps } from './MusicChoices.props';

const songs = [
  {
    id: 1,
    header: 'Рок музыка',
    description: 'Радость — светлые и яркие образы',
  },
  {
    id: 2,
    header: 'Саундтреки из фильмов',
    description: 'Загадочность — туманные и неожиданные элементы',
  },
  {
    id: 3,
    header: 'Неокласика',
    description: 'Релакс — природные и мягкие тона',
  },
  {
    id: 4,
    header: 'Электронная музыка',
    description: 'Радость — светлые и яркие образы',
  },
];

export function MusicChoices({ handleAcceptGenerate }: MusicChoicesProps) {
  return (
    <>
      <ImgContainer className='music_svg'>
        <img src='./music.svg' />
      </ImgContainer>
      <Typography className='typography-h3_demo'>
        Какое настроение создать?
      </Typography>
      <div className='demo_music_choices__container'>
        {songs.map(el => (
          <div key={el.id} className='demo_music_choices__box'>
            <MusicСard
              handleAcceptGenerate={handleAcceptGenerate}
              id={el.id}
              header={el.header}
              description={el.description}
            />
          </div>
        ))}
      </div>
    </>
  );
}
