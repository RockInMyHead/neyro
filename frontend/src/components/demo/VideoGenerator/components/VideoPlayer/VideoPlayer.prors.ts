import { Dispatch, SetStateAction } from 'react';

export type VideoPlayerProps = {
     sessionId: string | null;
     setSessionId: Dispatch<SetStateAction<string | null>>
}