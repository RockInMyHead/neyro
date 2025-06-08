import { useRef, useState } from 'react';
import { FancyInput } from './components/FancyInput/FancyInput';
import { VideoPlayer } from './components/VideoPlayer/VideoPlayer';
import { GenerateActions } from './components/GenerateActions/GenerateActions';
import { PageWrapper } from '../../../layout/PageWrapper/PageWrapper';
import './VideoGenerator.css';
import { MusicChoices } from '../MusicChoices/MusicChoices';
import { ConcertInfo } from '../ConcertInfo/ConcertInfo';
import axios from 'axios';
import { DOMAIN } from '../../../consts/api';
import AudioPlayer from './components/AudioPlayer/AudioPlayer';

export function VideoGenerator() {
  const [value, setValue] = useState<string>('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isFirst, setIsFirst] = useState<boolean>(true); //фрейм выбора песни
  const [isFinal, setIsFinal] = useState<boolean>(false); //фрейм с концертом

  const [isGenerate, setIsGenerate] = useState<boolean>(false);
  const [isSound, setIsSound] = useState<boolean>(false);
  const [isLoadingPromt, setIsLoadingPromt] = useState<boolean>(false);
  const audioRef = useRef<null | HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const stopGenerate = () => {
    setIsGenerate(false);
    setAudioUrl(null);
    setSessionId(null);
    setValue('');
    setIsFinal(true);
  };

  //переключатель звука
  const toggleSound = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isSound;
      setIsSound(!isSound);
    }
  };

  //выбор песни пользователем
  const handleAcceptGenerate = async (value: number) => {
    setIsFirst(false);
    setIsGenerate(true);
    await fetchAudio(value);
  };

  //запрос на песню
  const fetchAudio = async (id: number) => {
    try {
      const { data } = await axios.post(`${DOMAIN}/session`, { promptType: id });
      setAudioUrl(`${DOMAIN}/music/${id}.mp3`);
      setSessionId(data.session_id);
    } catch (e) {
      console.log(e);
      setAudioUrl(null);
    }
  };
  

  //пользователь генерирует по введенному тексту
  const handleFetchPromt = async (value: string) => {
    if (!sessionId) return;
    setIsLoadingPromt(true);
    try {
      await axios.post(`${DOMAIN}/session/${sessionId}/prompt`, {
        prompt: value,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoadingPromt(false);
    }
  };

  const restart = () => {
    setIsFirst(true);
    setIsFinal(false);
  };

  const content = () => {
    if (isFirst)
      return (
        <div className='demo_title_first'>
          <MusicChoices handleAcceptGenerate={handleAcceptGenerate} />
        </div>
      );
    if (!isFirst && !isFinal)
      return (
        <>
          <VideoPlayer sessionId={sessionId} setSessionId={setSessionId} />
          <AudioPlayer
            audioRef={audioRef}
            audioUrl={audioUrl}
            stopGenerate={stopGenerate}
          />
          <GenerateActions
            isSound={isSound}
            isGenerate={isGenerate}
            stopGenerate={stopGenerate}
            toggleSound={toggleSound}
          />
          <FancyInput
            isLoadingPromt={isLoadingPromt}
            value={value}
            onChange={e => setValue(e.target.value)}
            handleFetchPromt={handleFetchPromt}
            sessionId={sessionId}
          />
        </>
      );
    if (isFinal) return <ConcertInfo restart={restart} />;
  };

  return (
    <div className='demo_container'>
      <PageWrapper>
        <div className=''>{content()}</div>
      </PageWrapper>
    </div>
  );
}
