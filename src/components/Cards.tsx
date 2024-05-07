import React, {useState, useEffect} from 'react'
import Card from './Card';

import { CssVarsProvider, CssBaseline, Typography, Button, Box } from '@mui/joy';

import img1 from '../assets/image1.jpg';
import img2 from '../assets/image2.jpg';
import img3 from '../assets/image3.jpg';

import { presidentCards } from './CardsData';
import { senadorCards } from './CardsData';
import { diptadosCards } from './CardsData';
import { mercosurNacionalCards } from './CardsData';
import { mercosurRegionalCards } from './CardsData';


type Candidate = {
  id: number,
  candidato: string,
  image: string,
  partido: string,
  rol: string
};

type CardsProps = {
  candidatesPicked: {
    lista: number,
    candidato: string,
    image: string,
    partido: string,
    rol: string
  }[],
  setCandidatesPicked: (candidatesPicked: {
    lista: number,
    candidato: string,
    image: string,
    partido: string,
    rol: string
  }[]) => void
}

const Cards: React.FunctionComponent<CardsProps> = ({ candidatesPicked, setCandidatesPicked }) => {
  const [presidentCards, setPresidentCards] = useState<Candidate[]>([]);
  const [diputadosCards, setDiputadosCards] = useState<Candidate[]>([]);
  const [senadoresCards, setSenadoresCards] = useState<Candidate[]>([]);
  const [mercosurNacionalCards, setMercosurNacionalCards] = useState<Candidate[]>([]);
  const [mercosurRegionalCards, setMercosurRegionalCards] = useState<Candidate[]>([]);

  const handleCardPickPresident = () => {
    
  }

  const handleCardPickDiputados = () => {
    
  }

  const handleCardPickSenadores = () => {
    
  }

  const handleCardPickMercosurNacional = () => {
    
  }

  const handleCardPickMercosurRegional = () => {
    
  }

  useEffect(() => {
    setPresidentCards(presidentCards);
  }, []);

  return (
    // <div className='container d-flex justify-content-center align-items-center h-100'>
    //   <div className='row'>
    //     {
    //       candidates.map(card => (
    //         <div className='col-md-4' key={card.id}>
    //           <Card candidate_name={card.candidato} img={card.image} partido={card.partido} handleCardPick={handleCardPickPresident}/>
    //         </div>
    //       ))
    //     }
    //   </div>
    // </div>

    <CssVarsProvider>
      <CssBaseline />
        <Box>
          <div className='container d-flex justify-content-center align-items-center h-100'>
            <div className='row'>
              {
                candidates.map(card => (
                  <div className='col-md-4' key={card.id}>
                    <Card candidate_name={card.candidato} img={card.image} partido={card.partido} handleCardPick={handleCardPickPresident}/>
                  </div>
                ))
              }
            </div>
          </div>
        </Box>
    </CssVarsProvider>
  )
};

export default Cards;
