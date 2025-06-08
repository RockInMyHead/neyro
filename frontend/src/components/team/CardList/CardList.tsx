import { forwardRef } from 'react';
import { CardTeam } from '../CardTeam/CardTeam';
import './CardList.css';

const teamMembers = [
  {
    person: 'Александр',
    role: 'frontend',
    img: '/about4_3.png',
    description:
      'Отвечает за интерфейс и пользовательский опыт. Специализируется на React и TailwindCSS.',
  },
  {
    person: 'Мария',
    role: 'designer',
    img: '/about4_3.png',
    description:
      'Создает UI/UX-дизайн и следит за визуальной целостностью проекта.',
  },
  {
    person: 'Иван',
    role: 'backend',
    img: '/about4_3.png',
    description: 'Разрабатывает серверную часть и интеграции с базами данных.',
  },
  {
    person: 'Екатерина',
    role: 'Менеджер',
    img: '/about4_3.png',
    description:
      'Планирует задачи, контролирует сроки и коммуникацию внутри команды.',
  },
  {
    person: 'Никита',
    role: 'Менеджер',
    img: '/about4_3.png',
    description:
      'Планирует задачи, контролирует сроки и коммуникацию внутри команды.',
  },
  {
    person: 'Никита',
    role: 'Менеджер',
    img: '/about4_3.png',
    description:
      'Планирует задачи, контролирует сроки и коммуникацию внутри команды.',
  },
  {
    person: 'Никита',
    role: 'Менеджер',
    img: '/about4_3.png',
    description:
      'Планирует задачи, контролирует сроки и коммуникацию внутри команды.',
  },
];

export const CardList = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div className='carousel_wrapper' ref={ref}>
      {teamMembers.map((el, i) => (
        <CardTeam
          key={i}
          id={i}
          person={el.person}
          role={el.role}
          img={el.img}
          description={el.description}
        />
      ))}
    </div>
  );
});
