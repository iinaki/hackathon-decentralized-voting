import React from 'react'
import Card from './Card';
import img1 from '../assets/image1.jpg';
import img2 from '../assets/image2.jpg';
import img3 from '../assets/image3.jpg';

const cards = [
  {
    id: 1,
    candidato: 'Javier Milei',
    image: img1,
    partido: 'La Libertad Avanza'
  },
  {
    id: 2,
    candidato: 'Sergio Massa',
    image: img2,
    partido: 'Frente de Todos'
  },
  {
    id: 3,
    candidato: 'Myriam Bregman',
    image: img3,
    partido: 'Frente de Izquierda'
  }
]

export default function Cards() {
  return (
    <div className='container d-flex justify-content-center align-items-center h-100'>
      <div className='row'>
        {
          cards.map(card => (
            <div className='col-md-4' key={card.id}>
              <Card candidate_name={card.candidato} img={card.image} partido={card.partido}/>
            </div>
          ))
        }
      </div>
    </div>
  )
}
