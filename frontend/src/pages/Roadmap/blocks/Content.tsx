import { Timeline } from '../../../components/roadmap/TimeLine/TimeLine';
import { ImgContainer } from '../../../components/utils/ImgContainer/ImgContainer';

export function Content() {
  return (
    <div className='roadmap_container__content'>
      <div className='roadmap_container__img'>
        <ImgContainer>
          <img src='./roadmap.png' />
        </ImgContainer>
      </div>
      <div className='roadmap_container__timeline'>
        <Timeline />
      </div>
    </div>
  );
}
