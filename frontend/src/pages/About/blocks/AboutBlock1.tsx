import { Typography } from '../../../components/utils/Typography/Typography';
import { PageWrapper } from '../../../layout/PageWrapper/PageWrapper';

export function AboutBlock1() {
  return (
    <div className='about_container about__bg_1'>
      <PageWrapper>
        <div className='about_content'>
          <div>
            <Typography variant='body1' className='left_text_with_blue'>
              Как это
              <span className='blue'> работает?</span>
            </Typography>
          </div>
          <div className='about_1__bottom_block'>
            <div>
              <Typography variant='h2' className='about_1-main_text'>
                Нейросеть создает шоу на основе зрительских запросов.
              </Typography>
            </div>
            <div>
              <Typography variant='body2' className='about_1-sub_text'>
                Зрители пишут запросы — нейросеть мгновенно превращает их в
                музыку и видео. Так каждый гость становится соавтором живого
                перформанса.
              </Typography>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
