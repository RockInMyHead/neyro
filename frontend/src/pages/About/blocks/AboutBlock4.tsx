import { CardList } from '../../../components/about/CardList/CardList';
import { Ticker } from '../../../components/about/Ticker/Ticker';
import { Typography } from '../../../components/utils/Typography/Typography';
import { PageWrapper } from '../../../layout/PageWrapper/PageWrapper';

export function AboutBlock4() {
  return (
    <div className='about_4_container'>
      <div className='about__bg_4'>
        <PageWrapper>
          <div className='about_content about_content_4'>
            <div className='about_4__top_block'>
              <div>
                <Typography variant='body1' className='left_text_with_blue'>
                  Список
                  <br />
                  <span className='blue'>возможностей</span>
                </Typography>
              </div>
              <div>
                <Typography
                  variant='body2'
                  className='about_4-main_text about_1-main_text'
                >
                  С помощью нашей технологии ваши гости смогут:
                </Typography>
              </div>
            </div>
            <div className='about_4__bottom_block'>
              <CardList />
            </div>
          </div>
        </PageWrapper>
      </div>
      <Ticker />
    </div>
  );
}
