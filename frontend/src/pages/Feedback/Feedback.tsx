import { Forma } from '../../components/feedback/Forma/Forma';
import { ImgContainer } from '../../components/utils/ImgContainer/ImgContainer';
import { Typography } from '../../components/utils/Typography/Typography';
import { PageWrapper } from '../../layout/PageWrapper/PageWrapper';
import './Feedback.css';

export function Feedback() {
  return (
    <div className='feedback_bg'>
      <PageWrapper>
        <div className='feedback_wrapper'>
          <ImgContainer className='feedback_logo'>
            <img src='./n.svg' />
          </ImgContainer>
          <div className='feedback_container'>
            <div className='feedback_text'>
              <div>
                <div>
                  <Typography
                    variant='body1'
                    className='typography-feedback_main'
                  >
                    Если вы хотите организовать мероприятие с использованием
                    технологий «Нейроивент» и талантливого коллектива Асии
                    Абдрахмановой, свяжитесь с нами.
                  </Typography>
                </div>
              </div>

              <div className='feedback_text__bottom'>
                <div>
                  <Typography className='gray'>Наш telegram:</Typography>
                  <a
                    className='a-decorated'
                    href='https://t.me/alex_bigkush'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    @alex_bigkush
                  </a>
                </div>
                <div>
                  <Typography className='gray'>Почта:</Typography>
                  <a className='a-decorated' href='mailto:neuroevent@yandex.ru'>
                    neuroevent@yandex.ru
                  </a>
                </div>
              </div>
            </div>
            <Forma />
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
