import React from 'react'
import Card from './Card';

type CardsProps = {
  candidates: {
    id: number,
    candidato: string,
    image: string,
    partido: string
  }[]
}

const Cards: React.FunctionComponent<CardsProps> = ({ candidates }) => {
  return (
    <div className='container d-flex justify-content-center align-items-center h-100'>
      <div className='row'>
        {
          candidates.map(card => (
            <div className='col-md-4' key={card.id}>
              <Card candidate_name={card.candidato} img={card.image} partido={card.partido}/>
            </div>
          ))
        }
      </div>
    </div>
  )
};

export default Cards;
