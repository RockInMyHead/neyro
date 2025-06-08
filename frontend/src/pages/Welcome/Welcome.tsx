import { ImgContainer } from '../../components/utils/ImgContainer/ImgContainer';
import { Typography } from '../../components/utils/Typography/Typography';
import { MainText } from '../../components/welcome/MainText/MainText';
import { PageWrapper } from '../../layout/PageWrapper/PageWrapper';
import './Welcome.css';

export function Welcome() {
  return (
    <div className='welcome_container'>
      <video
        className='video-bg'
        autoPlay
        muted
        loop
        playsInline
        src='/electri.mp4'
      />
      <PageWrapper>
        <div className='welcome_content'>
          <div>
            <MainText />
          </div>
          <div className='welcome_second_container'>
            <div className='welcome_go_down_container'>
              <Typography variant='body1' className='welcome_go_down_text'>
                Крутите вниз
              </Typography>
              <ImgContainer>
                <img src='/arrow-down.svg' />
              </ImgContainer>
            </div>
            <div className='welcome_description_container'>
              <Typography variant='body1' className='welcome_description__text'>
                Цифровое преображение концертов: нейросети
                <br /> на сцене
              </Typography>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
