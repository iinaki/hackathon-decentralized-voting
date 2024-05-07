import React, { useState, useEffect } from 'react'
import CandidateCard from './CandidateCard';

import { CssVarsProvider, CssBaseline, Typography, Button, Box } from '@mui/joy';
import List from '@mui/joy/List';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItem from '@mui/joy/ListItem';

import { dataPresidentCards } from './CandidateCardsData';
import { dataSenadorCards } from './CandidateCardsData';
import { dataDiptadosCards } from './CandidateCardsData';
import { dataMercosurNacionalCards } from './CandidateCardsData';
import { dataMercosurRegionalCards } from './CandidateCardsData';

import { CandidatesPicked, Candidate, emptyCandidate } from './Vote';

type CandidateCardsProps = {
  candidatesPicked: CandidatesPicked,
  setCandidatesPicked: (candidatesPicked: CandidatesPicked) => void
}

const CandidateCards: React.FunctionComponent<CandidateCardsProps> = ({ candidatesPicked, setCandidatesPicked }) => {
  const [presidentCards, setPresidentCards] = useState<Candidate[]>([]);
  const [diputadosCards, setDiputadosCards] = useState<Candidate[]>([]);
  const [senadoresCards, setSenadoresCards] = useState<Candidate[]>([]);
  const [mercosurNacionalCards, setMercosurNacionalCards] = useState<Candidate[]>([]);
  const [mercosurRegionalCards, setMercosurRegionalCards] = useState<Candidate[]>([]);

  const handleCardPickPresident = (candidate: Candidate) => {
    setCandidatesPicked({
      ...candidatesPicked,
      'presidente': candidate
    });
  }

  const handleCardPickDiputados = (candidate: Candidate) => {
    setCandidatesPicked({
      ...candidatesPicked,
      'diputados': candidate
    });
  }

  const handleCardPickSenadores = (candidate: Candidate) => {
    setCandidatesPicked({
      ...candidatesPicked,
      'senadores': candidate
    });
  }

  const handleCardPickMercosurNacional = (candidate: Candidate) => {
    setCandidatesPicked({
      ...candidatesPicked,
      'mercosurNacional': candidate
    });
  }

  const handleCardPickMercosurRegional = (candidate: Candidate) => {
    setCandidatesPicked({
      ...candidatesPicked,
      'mercosurRegional': candidate
    });
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
        <Box>
          <Box>
            <List
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1,
                color: 'white',
                backgroundColor: 'black',
                padding: '1rem',
                borderRadius: '10px'
              }}
            >
              <ListItem nested sx={{ display: 'flex', align: 'justify-content-center'}}>
                    <ListSubheader sx={{ 
                      letterSpacing: '2px', fontWeight: '800', fontSize: '1.5rem', color: 'white'
                     }}>
                        Presidentes
                    </ListSubheader>
              </ListItem>
            </List>
            <div className='container d-flex justify-content-center align-items-center h-100'>
              <div className='row'>
                {
                  presidentCards.map((card, i) => (
                    i < 3 && ( <div className='col-md-4 my-2' key={card.lista}>
                      <CandidateCard candidate={card} handleCardPick={handleCardPickPresident} />
                    </div>
                  )))
                }
              </div>
            </div>
            <div className='container d-flex justify-content-center align-items-center h-100'>
              <div className='row'>
                {
                  presidentCards.map((card, i) => (
                    i >= 3 && ( <div className='col-md-6 my-2' key={card.lista}>
                      <CandidateCard candidate={card} handleCardPick={handleCardPickPresident} />
                    </div>
                  )))
                }
              </div>
            </div>
          </Box>
          <Box>
            <List
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 1,
                  color: 'white',
                  backgroundColor: 'black',
                  padding: '1rem',
                  borderRadius: '10px'
                }}
              >
                <ListItem nested sx={{ display: 'flex', align: 'justify-content-center'}}>
                      <ListSubheader sx={{ 
                        letterSpacing: '2px', fontWeight: '800', fontSize: '1.5rem', color: 'white'
                      }}>
                          Senadores
                      </ListSubheader>
                </ListItem>
              </List>
            <div className='container d-flex justify-content-center align-items-center h-100'>
              <div className='row'>
                {
                  senadoresCards.map(card => (
                    <div className='col-md-3 my-2' key={card.lista}>
                      <CandidateCard candidate={card} handleCardPick={handleCardPickSenadores} />
                    </div>
                  ))
                }
              </div>
            </div>
          </Box>
          <Box>
            <List
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 1,
                  color: 'white',
                  backgroundColor: 'black',
                  padding: '1rem',
                  borderRadius: '10px'
                }}
              >
                <ListItem nested sx={{ display: 'flex', align: 'justify-content-center'}}>
                      <ListSubheader sx={{ 
                        letterSpacing: '2px', fontWeight: '800', fontSize: '1.5rem', color: 'white'
                      }}>
                          Diputados
                      </ListSubheader>
                </ListItem>
              </List>
            <div className='container d-flex justify-content-center align-items-center h-100'>
              <div className='row'>
                {
                  diputadosCards.map(card => (
                    <div className='col-md-3 my-2' key={card.lista}>
                      <CandidateCard candidate={card} handleCardPick={handleCardPickDiputados} />
                    </div>
                  ))
                }
              </div>
            </div>
          </Box>
          <Box>
            <List
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 1,
                  color: 'white',
                  backgroundColor: 'black',
                  padding: '1rem',
                  borderRadius: '10px'
                }}
              >
                <ListItem nested sx={{ display: 'flex', align: 'justify-content-center'}}>
                      <ListSubheader sx={{ 
                        letterSpacing: '2px', fontWeight: '800', fontSize: '1.5rem', color: 'white'
                      }}>
                          Representantes en el Mercosur a nivel Nacional
                      </ListSubheader>
                </ListItem>
              </List>
            <div className='container d-flex justify-content-center align-items-center h-100'>
              <div className='row'>
                {
                  mercosurNacionalCards.map((card, i) => (
                    i < 3 && ( <div className='col-md-4 my-2' key={card.lista}>
                      <CandidateCard candidate={card} handleCardPick={handleCardPickMercosurNacional} />
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
                      <CandidateCard candidate={card} handleCardPick={handleCardPickMercosurNacional} />
                    </div>
                  )))
                }
              </div>
            </div>
          </Box>
          <Box>
            <List
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                    color: 'white',
                    backgroundColor: 'black',
                    padding: '1rem',
                    borderRadius: '10px'
                  }}
                >
                  <ListItem nested sx={{ display: 'flex', align: 'justify-content-center'}}>
                        <ListSubheader sx={{ 
                          letterSpacing: '2px', fontWeight: '800', fontSize: '1.5rem', color: 'white'
                        }}>
                            Representantes en el Mercosur a nivel Regional
                        </ListSubheader>
                  </ListItem>
                </List>
            <div className='container d-flex justify-content-center align-items-center h-100'>
              <div className='row'>
                {
                  mercosurRegionalCards.map(card => (
                    <div className='col-md-3 my-2' key={card.lista}>
                      <CandidateCard candidate={card} handleCardPick={handleCardPickMercosurRegional} />
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
