import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Web3 } from 'web3';

import { CssVarsProvider, CssBaseline, Typography, Button, Box } from '@mui/joy';

import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import '../App.css';
import CandidateCards from './CandidateCards';
import Navigation from './Navigation';

import Election from '../abis/Election.json'

import config from '../config.json';
// import TabsRouter from './TabsRouter';

export type Candidate = {
  lista: number,
  candidato: string,
  image: string,
  partido: string,
  rol: string
};

export type CandidatesPicked = {
  'presidente': Candidate,
  'senadores': Candidate,
  'diputados': Candidate,
  'mercosurNacional': Candidate,
  'mercosurRegional': Candidate
}

export const emptyCandidate = {
  lista: 0,
  candidato: '',
  image: '',
  partido: '',
  rol: ''
};

const Vote = () => {

  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState('null');
  const [candidatesPicked, setCandidatesPicked] = useState<CandidatesPicked>({
    'presidente': emptyCandidate,
    'senadores': emptyCandidate,
    'diputados': emptyCandidate,
    'mercosurNacional': emptyCandidate,
    'mercosurRegional': emptyCandidate
  });

  const voter_location = 'Buenos Aires';

  const loadBlockchainData = async () => {

    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // setProvider(provider);

    // const network = await provider.getNetwork();

    // const election = new ethers.Contract(config[network.chainId].election.address, Election, provider);

    // const total_candidates = 9;

    // const candidates = [];

    // for (let i = 1; i <= total_candidates; i++) {
    //   const uri = await realEstate.tokenURI(i)
    //   const response = await fetch(uri)
    //   const metadata = await response.json()
    //   candidates.push(metadata)
    // };
    // setCandidates(candidates);
  };

  // useEffect(() => {
  //   loadBlockchainData()
  // }, []);

  return (
    <div className="Vote">
      {/* <TabsRouter /> */}
      <CssVarsProvider>
        <CssBaseline />
        <Box >
          <Navigation account={account} setAccount={setAccount} />
        </Box>
        <Box>
          <CandidateCards candidatesPicked={candidatesPicked} setCandidatesPicked={setCandidatesPicked} />
        </Box>
        <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                color: 'white',
                backgroundColor: 'black',
                padding: '1rem'
              }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button endDecorator={<KeyboardArrowRight />} color="success" size='lg'>
                Enviar Voto
              </Button>
            </Box>
        </Box>
      </CssVarsProvider>
      
    </div>
  );
};

export default Vote;
