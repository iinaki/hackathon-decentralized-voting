import React, { useState, useEffect } from 'react'
import CandidateCard from './CandidateCard';

import { CssVarsProvider, CssBaseline, Typography, Button, Box } from '@mui/joy';

import { dataPresidentCards } from './CandidateCardsData';
import { dataSenadorCards } from './CandidateCardsData';
import { dataDiptadosCards } from './CandidateCardsData';
import { dataMercosurNacionalCards } from './CandidateCardsData';
import { dataMercosurRegionalCards } from './CandidateCardsData';

import { CandidatesPicked, Candidate, emptyCandidate } from './Vote';
import CandidateCardsHeader from './CandidateCardsHeader';

type CandidateCardsProps = {
  candidatesPicked: CandidatesPicked,
  setCandidatesPicked: (candidatesPicked: CandidatesPicked) => void
};

const CandidateCards: React.FunctionComponent<CandidateCardsProps> = ({ candidatesPicked, setCandidatesPicked }) => {
  const [presidentCards, setPresidentCards] = useState<Candidate[]>([]);
  const [diputadosCards, setDiputadosCards] = useState<Candidate[]>([]);
  const [senadoresCards, setSenadoresCards] = useState<Candidate[]>([]);
  const [mercosurNacionalCards, setMercosurNacionalCards] = useState<Candidate[]>([]);
  const [mercosurRegionalCards, setMercosurRegionalCards] = useState<Candidate[]>([]);

  const handleCardPickPresident = (candidate: Candidate) => {
    if (candidatesPicked.presidente === candidate) {
      setCandidatesPicked({
        ...candidatesPicked,
        'presidente': emptyCandidate
      });
    } else {
      setCandidatesPicked({
        ...candidatesPicked,
        'presidente': candidate
      });
    }
  }

  const handleCardPickMercosurNacional = (candidate: Candidate) => {
    if (candidatesPicked.mercosurNacional === candidate) {
      setCandidatesPicked({
        ...candidatesPicked,
        'mercosurNacional': emptyCandidate
      });
    } else {
      setCandidatesPicked({
        ...candidatesPicked,
        'mercosurNacional': candidate
      });
    }
  }

  const handleCardPickSenadores = (candidate: Candidate) => {
    if (candidatesPicked.senadores === candidate) {
      setCandidatesPicked({
        ...candidatesPicked,
        'senadores': emptyCandidate
      });
    } else {
      setCandidatesPicked({
        ...candidatesPicked,
        'senadores': candidate
      });
    }
  }

  const handleCardPickDiputados = (candidate: Candidate) => { 
    if (candidatesPicked.diputados === candidate) {
      setCandidatesPicked({
        ...candidatesPicked,
        'diputados': emptyCandidate
      });
    } else {
      setCandidatesPicked({
        ...candidatesPicked,
        'diputados': candidate
      });
    }
  }

  const handleCardPickMercosurRegional = (candidate: Candidate) => {
    if (candidatesPicked.mercosurRegional === candidate) {
      setCandidatesPicked({
        ...candidatesPicked,
        'mercosurRegional': emptyCandidate
      });
    } else {
      setCandidatesPicked({
        ...candidatesPicked,
        'mercosurRegional': candidate
      });
    }
  }

  useEffect(() => {
    setPresidentCards(dataPresidentCards);
    setDiputadosCards(dataDiptadosCards);
    setSenadoresCards(dataSenadorCards);
    setMercosurNacionalCards(dataMercosurNacionalCards);
    setMercosurRegionalCards(dataMercosurRegionalCards);
  }, []);

  return (
    <CssVarsProvider>
      <CssBaseline />
        <Box sx={{ backgroundColor: '#CDE8E5' }} >
          <Box>
            <CandidateCardsHeader text={'Presidentes'} />
              <div className='container d-flex justify-content-center align-items-center h-100'>
                <div className='row'>
                  {
                    presidentCards.map((card, i) => (
                      i < 3 && ( 
                        <div className='col-md-4 my-2' key={card.lista}>
                          <CandidateCard candidate={card} handleCardPick={handleCardPickPresident} cardPicked={ card === candidatesPicked.presidente } />
                        </div>
                    )))
                  }
                </div>
              </div>
              <div className='container d-flex justify-content-center align-items-center h-100'>
                <div className='row'>
                {
                    presidentCards.map((card, i) => (
                      i >= 3 && ( 
                      <div className='col-md-6 my-2' key={card.lista}>
                        <CandidateCard candidate={card} handleCardPick={handleCardPickPresident} cardPicked={ card === candidatesPicked.presidente } />
                      </div>
                    )))
                  }
                </div>
              </div>
          </Box>
          <Box>
            <CandidateCardsHeader text={'Representantes en el Mercosur a nivel Nacional'} />
            <div className='container d-flex justify-content-center align-items-center h-100'>
              <div className='row'>
                {
                  mercosurNacionalCards.map((card, i) => (
                    i < 3 && ( <div className='col-md-4 my-2' key={card.lista}>
                      <CandidateCard candidate={card} handleCardPick={handleCardPickMercosurNacional} cardPicked={ card === candidatesPicked.mercosurNacional } />
                    </div>
                  )))
                }
              </div>
            </div>
            <div className='container d-flex justify-content-center align-items-center h-100'>
              <div className='row'>
                {
                  mercosurNacionalCards.map((card, i) => (
                    i >= 3 && ( <div className='col-md-6 my-2' key={card.lista}>
                      <CandidateCard candidate={card} handleCardPick={handleCardPickMercosurNacional} cardPicked={ card === candidatesPicked.mercosurNacional } />
                    </div>
                  )))
                }
              </div>
            </div>
          </Box>
          <Box>
              <CandidateCardsHeader text={'Senadores'} />
            <div className='container d-flex justify-content-center align-items-center h-100'>
              <div className='row'>
                {
                  senadoresCards.map(card => (
                    <div className='col-md-3 my-2' key={card.lista}>
                      <CandidateCard candidate={card} handleCardPick={handleCardPickSenadores} cardPicked={ card === candidatesPicked.senadores } />
                    </div>
                  ))
                }
              </div>
            </div>
          </Box>
          <Box>
            <CandidateCardsHeader text={'Diputados'} />
            <div className='container d-flex justify-content-center align-items-center h-100'>
              <div className='row'>
                {
                  diputadosCards.map(card => (
                    <div className='col-md-3 my-2' key={card.lista}>
                      <CandidateCard candidate={card} handleCardPick={handleCardPickDiputados} cardPicked={ card === candidatesPicked.diputados } />
                    </div>
                  ))
                }
              </div>
            </div>
          </Box>
          <Box>
            <CandidateCardsHeader text={'Representantes en el Mercosur a nivel Regional'} />
            <div className='container d-flex justify-content-center align-items-center h-100'>
              <div className='row'>
                {
                  mercosurRegionalCards.map(card => (
                    <div className='col-md-3 my-2' key={card.lista}>
                      <CandidateCard candidate={card} handleCardPick={handleCardPickMercosurRegional} cardPicked={ card === candidatesPicked.mercosurRegional } />
                    </div>
                  ))
                }
              </div>
            </div>
          </Box>
      </Box>
    </CssVarsProvider>
  )
};

export default CandidateCards;
