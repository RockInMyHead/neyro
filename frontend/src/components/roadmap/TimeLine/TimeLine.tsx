import { useEffect, useRef } from 'react';
import './TimeLine.css';
import { roadmapItems } from './roadmapItems';
import { RoadmapCardProps } from '../RoadmapCard/RoadmapCard.props';
import { RoadmapCard } from '../RoadmapCard/RoadmapCard';

export function Timeline() {
  const progressRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const content = contentRef.current;
      const progress = progressRef.current;

      if (!content || !progress) return;

      const scrollTop = content.scrollTop;
      const scrollHeight = content.scrollHeight - content.clientHeight;
      const scrollPercent = (scrollTop / scrollHeight) * 100;

      progress.style.height = `${scrollPercent}%`;
    };

    const content = contentRef.current;
    if (content) content.addEventListener('scroll', onScroll);

    return () => {
      if (content) content.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className='roadmap_scroll_block'>
      <div className='timeline_container'>
        <div className='timeline_progress'>
          <div ref={progressRef} className='progress_line'></div>
        </div>
        <div className='timeline_content' ref={contentRef}>
          {roadmapItems.map((item: RoadmapCardProps, i: number) => (
            <section className='timeline_step' key={i}>
              <RoadmapCard
                title={item.title}
                description={item.description}
                step={item.step}
              />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
