import { useEffect, useRef, useState } from 'react';
import { Typography } from '../../../../utils/Typography/Typography';
import './VideoPlayer.css';
import { VideoPlayerProps } from './VideoPlayer.prors';
import { HOST } from '../../../../../consts/api';
import { ImgContainer } from '../../../../utils/ImgContainer/ImgContainer';

export function VideoPlayer({ sessionId, setSessionId }: VideoPlayerProps) {
  const [frameUrl, setFrameUrl] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!sessionId) {
      return;
    }
    const ws = new WebSocket(`ws://${HOST}/session/${sessionId}/stream`);
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
      console.log('WS подключён');
    };

    ws.onmessage = evt => {
      const blob = new Blob([evt.data], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      setFrameUrl(prevUrl => {
        if (prevUrl) URL.revokeObjectURL(prevUrl);
        return url;
      });
    };

    ws.onerror = err => console.error('WS error', err);
    ws.onclose = () => console.log('WS закрыт');

    wsRef.current = ws;

    //очистка при размонтировании компонента или изменении sessionId
    return () => {
      ws.close();
      setSessionId(null);
      if (frameUrl) URL.revokeObjectURL(frameUrl);
    };
  }, [sessionId]);

  return (
    <div className='video_frame'>
      {frameUrl ? (
        <ImgContainer className='img__demo_wrapper'>
          <img src={frameUrl} alt='Streaming frame' className='img__demo' />
        </ImgContainer>
      ) : (
        <div className='demo_video__help_text_wrapper'>
          <Typography className='typography-video'>
            Осталось пару секунд...
          </Typography>
          <Typography className='typography-video gray'>
            Создаем аудио-видео дорожку
          </Typography>
        </div>
      )}
    </div>
  );
}
