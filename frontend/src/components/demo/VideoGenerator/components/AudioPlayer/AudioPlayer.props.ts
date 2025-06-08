import { RefObject } from 'react';

export type AudioPlayerProps = {
  audioUrl: string | null;
  audioRef: RefObject<HTMLAudioElement | null>;
  stopGenerate: () => void;
};
