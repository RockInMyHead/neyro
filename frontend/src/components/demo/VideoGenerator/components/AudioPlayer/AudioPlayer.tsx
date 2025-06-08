import { useEffect } from 'react';
import { AudioPlayerProps } from './AudioPlayer.props';

function AudioPlayer({ audioUrl, audioRef, stopGenerate }: AudioPlayerProps) {
  useEffect(() => {
    if (audioUrl && audioRef?.current && audioRef) {
      console.log(audioUrl);
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }

    return () => {
      if (audioRef?.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // сбрасываем воспроизведение
      }
    };
  }, [audioUrl, audioRef]);

  return (
    <>
      <audio
        ref={audioRef}
        controls
        style={{ display: 'none' }}
        onEnded={stopGenerate}
      />
    </>
  );
}

export default AudioPlayer;