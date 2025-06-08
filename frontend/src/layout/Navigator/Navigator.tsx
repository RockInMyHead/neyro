// import { Button } from '../../components/Button/Button';
import { ImgContainer } from '../../components/utils/ImgContainer/ImgContainer';
import { Typography } from '../../components/utils/Typography/Typography';
import { PageWrapper } from '../PageWrapper/PageWrapper';
import './Navigator.css';

export function Navigator() {
  const navItems = [
    { label: 'Продукт', targetId: 'product' },
    { label: 'Демо', targetId: 'demo' },
    { label: 'Команда', targetId: 'team' },
    { label: 'Планы', targetId: 'plans' },
    { label: 'Контакты', targetId: 'contacts' },
  ];

  const handleScroll = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='header'>
      <PageWrapper>
        <div className='header_container'>
          <div className='header__img'>
            <ImgContainer>
              <img
                src='/logo.svg'
                alt='logo'
                onClick={() => handleScroll('welcome')}
              />
            </ImgContainer>
          </div>

          <div className='header_nav_container'>
            {/* <Typography variant='body1'>
              Интеграция нейросети в живые выступления музыкальных коллективов
            </Typography> */}
            <div className='header_nav_items'>
              {navItems.map(({ label, targetId }) => (
                <Typography
                  variant='body1'
                  className='nav_item'
                  key={label}
                  onClick={() => handleScroll(targetId)}
                  style={{ cursor: 'pointer' }}
                >
                  {label}
                </Typography>
              ))}
            </div>
            {/* <div className='header_nav_btn_connection'>
              <Button className='nav_btn'>Связаться</Button>
            </div> */}
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
