import { ImgContainer } from '../../../../utils/ImgContainer/ImgContainer';
import { Typography } from '../../../../utils/Typography/Typography';
import { GenerateActionsProps } from './GenerateActions.props';

export function GenerateActions({
  stopGenerate,
  toggleSound,
  isGenerate,
  isSound,
}: GenerateActionsProps) {
  return (
    <div className='demo_generate_actions_container'>
      <div onClick={stopGenerate}>
        <ImgContainer>
          <img src='./stopGenerate.svg' />
        </ImgContainer>
        <Typography variant='caption' style={{ fontSize: '12px' }}>
          {isGenerate ? 'Остановить генерацию' : 'Генерация остановлена'}
        </Typography>
      </div>
      <div onClick={toggleSound}>
        <Typography variant='caption' style={{ fontSize: '12px' }}>
          {isSound ? 'Включить звук' : 'Выключить звук'}
        </Typography>
        <ImgContainer>
          {isSound ? <img src='./soundOff.svg' /> : <img src='./soundOn.svg' />}
        </ImgContainer>
      </div>
    </div>
  );
}
