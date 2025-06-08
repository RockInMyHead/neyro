import { ChangeEvent, FormEvent, useState } from 'react';
import { Button } from '../../utils/Button/Button';
import { Typography } from '../../utils/Typography/Typography';
import './Forma.css';

export function Forma() {
  const [isAgree, setIsArgee] = useState(true);
  const handleSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const fullName = formData.get('fullName');
    const email = formData.get('email');
    const phone = formData.get('phone');

    const consent = formData.get('consent');
    if (!consent) {
      setIsArgee(false);
      return;
    }

    console.log({ fullName, email, phone });
  };

  const checkIsAgree = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setIsArgee(e.target.checked);
    }
  };

  return (
    <div className='forma'>
      <div className='feedback_forma__container'>
        <Typography className='forma_description'>
          Обсудим сотрудничество? Заполните форму,
          <br /> и мы свяжемся с вами в ближайшее время.
        </Typography>

        <form onSubmit={e => handleSubmitForm(e)}>
          <div className='feedback_forma__input_wrapper'>
            <label>
              <input type='text' name='fullName' placeholder='ФИО' required />
            </label>
          </div>

          <div className='feedback_forma__input_wrapper'>
            <label>
              <input type='email' name='email' placeholder='Email' required />
            </label>
          </div>
          <div className='feedback_forma__input_wrapper'>
            <label>
              <input type='tel' name='phone' placeholder='Телефон*' required />
            </label>
          </div>

          <label className='form_checkbox'>
            <input
              type='checkbox'
              name='consent'
              onChange={e => checkIsAgree(e)}
            />
            <span className='custom_checkbox'></span>
            Согласен на обработку персональных данных
          </label>
          {!isAgree && (
            <Typography variant='caption'>Необходимо подтверждение</Typography>
          )}
          <Button className='blue blue_btn' type='submit'>
            Отправить
          </Button>
        </form>
      </div>
    </div>
  );
}
