import { Typography } from '../../../components/utils/Typography/Typography';

export function Header() {
  return (
    <div className='roadmap_container__header'>
      <Typography className='roadmap_plan' variant='body1'>
        Наши планы
      </Typography>
      <Typography className='roadmap_header'>
        Дорожная карта развития проекта «Нейроивент»:
      </Typography>
    </div>
  );
}
