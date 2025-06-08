import { CardList } from '../../components/team/CardList/CardList';
import { ImgContainer } from '../../components/utils/ImgContainer/ImgContainer';
import { Typography } from '../../components/utils/Typography/Typography';
import { PageWrapper } from '../../layout/PageWrapper/PageWrapper';
import './Team.css';
import { useRef } from 'react';

export function Team() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -500, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 500, behavior: 'smooth' });
    }
  };

  return (
    <div className='team_bg'>
      <PageWrapper>
        <div className='team_wrapper'>
          <div className='team__top_block'>
            <Typography variant='h3' className='team_header'>
              О команде
            </Typography>
            <div className='team__buttons'>
              <div onClick={scrollLeft}>
                <ImgContainer className='btn_team'>
                  <img src='./left.svg' alt='scroll left' />
                </ImgContainer>
              </div>
              <div onClick={scrollRight}>
                <ImgContainer className='btn_team'>
                  <img src='./right.svg' alt='scroll right' />
                </ImgContainer>
              </div>
            </div>
          </div>
          <div className='team__bottom_block'>
            <CardList ref={scrollRef} />
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
