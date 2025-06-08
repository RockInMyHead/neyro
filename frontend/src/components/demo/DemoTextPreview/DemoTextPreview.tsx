import { useEffect, useRef } from 'react';
import { Button } from '../../utils/Button/Button';
import { Typography } from '../../utils/Typography/Typography';
import './DemoTextPreview.css';
import { DemoTextPreviewProps } from './DemoTextPreview.props';

const textBlocks = [
  'Нейроивент: нейросеть для перформансов',
  'Нейросеть, которая превращает текстовые сообщения в визуальные и звуковые эффекты',
  'Попробуйте в реальном времени. Нажмите кнопку для старта',
];

export function DemoTextPreview({ setIsWathingDemo }: DemoTextPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections =
      containerRef.current?.querySelectorAll('.demo_text_section');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          } else {
            entry.target.classList.remove('visible');
          }
        });
      },
      { threshold: 0.6, root: containerRef.current }
    );

    sections?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className='demo_container_preview'>
      <div className='demo_container_preview__text'>
        <div className='demo_preview__text' ref={containerRef}>
          {textBlocks.map((text, idx) => (
            <section key={idx} className='demo_text_section'>
              <Typography
                className={
                  idx !== 0 ? 'typography-h2_demo' : 'typography-h1_demo'
                }
              >
                {text}
              </Typography>
            </section>
          ))}
        </div>
      </div>

      <div>
        <Button
          onClick={() => setIsWathingDemo(true)}
          className='demo_btn__try'
        >
          Попробовать бесплатно
        </Button>
      </div>

      <div className='demo_container_caption'>
        <div className='demo_caption__chip'>Демо версия «Нероивент»</div>
      </div>
    </div>
  );
}
