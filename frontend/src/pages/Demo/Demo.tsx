import { useState } from 'react';
import { VideoGenerator } from '../../components/demo/VideoGenerator/VideoGenerator';
import './Demo.css';
import { DemoTextPreview } from '../../components/demo/DemoTextPreview/DemoTextPreview';

export function Demo() {
  const [isWatchingDemo, setIsWathingDemo] = useState(false);
  return (
    <div>
      <div className='demo_container_visual'>
        {!isWatchingDemo ? (
          <DemoTextPreview setIsWathingDemo={setIsWathingDemo} />
        ) : (
          <VideoGenerator />
        )}
      </div>
    </div>
  );
}
