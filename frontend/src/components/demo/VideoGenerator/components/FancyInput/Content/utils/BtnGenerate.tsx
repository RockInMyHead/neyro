import { ButtonHTMLAttributes } from 'react';
import { Button } from '../../../../../../utils/Button/Button';
import { ImgContainer } from '../../../../../../utils/ImgContainer/ImgContainer';

export function BtnGenerate({
  isLoadingPromt,
  sessionId,
  ...props
}: {
  isLoadingPromt: boolean;
  sessionId: string | null;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  console.log(isLoadingPromt);
  return (
    <Button className='btn_generate' disabled={!sessionId} {...props}>
      <div className='btn_generate_content'>
        <ImgContainer className='fancy_input__img_btn'>
          <img src='./starsInput.svg' />
        </ImgContainer>
        <span>{!isLoadingPromt ? 'Генерация' : 'Загрузка'}</span>
      </div>
    </Button>
  );
}
