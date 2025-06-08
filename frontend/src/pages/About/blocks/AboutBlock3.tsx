import { Typography } from '../../../components/utils/Typography/Typography';
import { PageWrapper } from '../../../layout/PageWrapper/PageWrapper';

export function AboutBlock3() {
  return (
    <div className='about__bg_3 about_container'>
      <PageWrapper>
        <div className='about_content'>
          <div>
            <Typography variant='body1' className='left_text_with_blue'>
              Постоянное
              <br />
              <span className='blue'>развитие</span>
            </Typography>
          </div>
          <div className='about_1__bottom_block'>
            <div>
              <Typography variant='h2' className='about_3-main_text'>
                Будущее интерактивных мероприятий
              </Typography>
            </div>
            <div>
              <Typography variant='body2' className='about_3-sub_text'>
                Проект непрерывно совершенствуется. В ближайшее время
                наша модель обеспечит полное взаимодействие зрителей
                с интерактивными компонентами шоу, анализируя их действия
                и эмоциональные реакции.
              </Typography>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
