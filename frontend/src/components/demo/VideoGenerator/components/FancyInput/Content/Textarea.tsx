import { TextareaHTMLAttributes } from 'react';
import { BtnGenerate } from './utils/BtnGenerate';
import { Typography } from '../../../../../utils/Typography/Typography';

export function Textarea({
  handleFetchPromt,
  value,
  isLoadingPromt,
  sessionId,
  ...props
}: {
  handleFetchPromt: (val: string) => void;
  value: string;
  isLoadingPromt: boolean;
  sessionId: string | null;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className='demo_input_block'>
      <div className='demo_input_container'>
        <textarea
          {...props}
          placeholder='Введите запрос'
          className='demo_input'
          value={value}
        />
      </div>

      <div className='demo_input_actions_container'>
        <div className='demo_input_actions'>
          <Typography className='typography-demo_caption' variant='caption'>
            Опишите настроение — например, «вдохновлённое», «расслабленное»
          </Typography>
        </div>

        <BtnGenerate onClick={() => handleFetchPromt(value)} isLoadingPromt={isLoadingPromt} sessionId={sessionId}/>
      </div>
    </div>
  );
}
