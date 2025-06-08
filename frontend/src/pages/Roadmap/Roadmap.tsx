import { PageWrapper } from '../../layout/PageWrapper/PageWrapper';
import { Content } from './blocks/Content';
import { Header } from './blocks/Header';
import './Roadmap.css';

export function Roadmap() {
  return (
    <div className='roadmap_bg'>
      <PageWrapper>
        <div className='roadmap_container'>
          <Header />
          <Content />
        </div>
      </PageWrapper>
    </div>
  );
}
