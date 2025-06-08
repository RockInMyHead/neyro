import { useEffect, useState } from 'react';
import { Button } from '../../utils/Button/Button';
import { ImgContainer } from '../../utils/ImgContainer/ImgContainer';
import { Typography } from '../../utils/Typography/Typography';
import './ConcertInfo.css';
import { ConcertInfoProps } from './ConcertInfo.props';

export function ConcertInfo({ restart }: ConcertInfoProps) {
  const [isVisible, setIsVisible] = useState<string>('');
  useEffect(() => {
    setIsVisible('visible');
  }, []);
  return (
    <div className='demo_concert_container'>
      <div className={`demo_concert__text ${isVisible}`}>
        <div className='demo_concert__card_final'>
          <div className='demo_concert__card_final_generate'>Генерация</div>
          <div className='demo_concert__card_final_generate blue'>
            завершена
          </div>
        </div>

        <div className='demo_concert__card_repeat_wrapper'>
          <Typography className='demo_concert__card_repeat_text'>
            Спасибо за участие в тесте!
          </Typography>
          <div>
            <Button onClick={restart} className='restart_btn'>Поробовать еще раз</Button>
          </div>
        </div>
      </div>
      <div className={`demo_concert__card ${isVisible}`}>
        <ImgContainer>
          <img src='./concert.png' />
        </ImgContainer>
        <Typography className='demo_concert__card_desc'>
          24 мая в Артист Hall состоится премьера проекта — «Rock Sympho Main
          Strings Orchestra», где зрители смогут в реальном времени влиять на
          шоу через нейросеть.
        </Typography>
        <a
          href='https://afisha.yandex.ru/moscow/concert/main-strings-orchestra-rok-simfonii?utm_source=direct_search&utm_medium=paid_performance&utm_campaign=113669815%257CMSCAMP-60_%5BAF-PT%5D_%7BWS%253AS%7D_RU-213_goal-REV_Category-Brand-Plus&utm_term=%25D0%25AF%25D0%25BD%25D0%25B4%25D0%25B5%25D0%25BA%25D1%2581%2520%25D0%2590%25D1%2584%25D0%25B8%25D1%2588%25D0%25B0&utm_content=INTid%257C0100000052810370302_52810370302%257Ccid%257C113669815%257Cgid%257C5482303674%257Caid%257C16425295823%257Cpos%257Cpremium1%257Csrc%257Csearch_none%257Cdvc%257Cdesktop%257Cevid%257C0%257Cretid%257C0&city=moscow&source=suggest'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Typography className='get_tikets blue'>
            Забронировать билеты →
          </Typography>
        </a>
      </div>
    </div>
  );
}
