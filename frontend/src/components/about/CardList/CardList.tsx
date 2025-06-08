import { Card } from './Card/Card';
import './CardList.css'

const cards = [
    {img: './about4_1.png', title: 'Генерировать уникальный визуальный контент в режиме реального времени'},
    {img: './about4_2.png', title: 'Адаптировать репертуар коллектива под интересы и настроение аудитории'},
    {img: './about4_3.png', title: 'Добавлять уникальные звуковые эффекты к живому выступлению музыкантов'},
    {img: './about4_4.png', title: 'Управлять параметрами освещения зала'}
]


export function CardList() {
  return (
    <div className='about_card__container'>
      {cards.map((el, index) => (
        <div className='about_card__wrapper' key={index}>
          <Card title={el.title} img={el.img} />
        </div>
      ))}
    </div>
  );
}
