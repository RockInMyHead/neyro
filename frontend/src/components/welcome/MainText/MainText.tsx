import { ImgContainer } from '../../utils/ImgContainer/ImgContainer';
import { Typography } from '../../utils/Typography/Typography';

export function MainText() {
  return (
    <div className='welcome_text'>
      <Typography variant='h1' className='typography-h1'>
        Нейросеть
      </Typography>

      <div>
        <ImgContainer>
          <img src='/stars.svg' />
        </ImgContainer>
        <Typography variant='h1' className='typography-h1'>
          на вашем
        </Typography>
      </div>

      <Typography variant='h1' className='typography-h1'>
        мероприятии
      </Typography>
    </div>
  );
}
