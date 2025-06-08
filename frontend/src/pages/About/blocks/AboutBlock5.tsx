import { Typography } from '../../../components/utils/Typography/Typography';
import { PageWrapper } from '../../../layout/PageWrapper/PageWrapper';

export function AboutBlock5() {
  return (
    <div className='about__bg_5 about_container'>
      <PageWrapper>
        <div className='about_content about_content_5'>
          <div>
            <Typography variant='body1' className='left_text_with_blue'>
              Миссия
              <br />
              <span className='blue'>Нейроивент</span>
            </Typography>
          </div>
          <div className='about_5__bottom_block'>
            <div>
              <Typography variant='body2' className='about_5-main_text'>
                Сделать вклад в развитии ивент-индустрии, предлагая новые
                подходы к организации мероприятий и задавая стандарты качества и
                уникальности впечатлений для гостей.
              </Typography>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
