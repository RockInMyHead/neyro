import { Typography } from '../../../components/utils/Typography/Typography';
import { PageWrapper } from '../../../layout/PageWrapper/PageWrapper';

export function AboutBlock2() {
  return (
    <div className='about_container about__bg_2'>
      <PageWrapper>
        <div className='about_content about_content_2'>
          <div>
            <Typography variant='body1' className='left_text_with_blue'>
              Шоу подстраивается
              <br />
              <span className='blue'> под аудиторию</span>
            </Typography>
          </div>
          <div className='about_2__bottom_block'>
            <Typography variant='body1' className='about_2-main_text'>
              Этот инновационный подход полностью трансформирует привычные
              форматы досуга, открывая принципиально новую эру в индустрии
              развлечений и живых мероприятий.
            </Typography>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
