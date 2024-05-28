import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Web3 } from 'web3';

import { CssVarsProvider, CssBaseline, Typography, Button, Box } from '@mui/joy';

import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import '../App.css';
import CandidateCards from './CandidateCards';
import Navigation from './Navigation';

import VoteABI from '../abis/Vote.json'

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

  const [provider, setProvider] = useState("null")
  const [account, setAccount] = useState("null");

  const [candidatesPicked, setCandidatesPicked] = useState<CandidatesPicked>({
    'presidente': emptyCandidate,
    'senadores': emptyCandidate,
    'diputados': emptyCandidate,
    'mercosurNacional': emptyCandidate,
    'mercosurRegional': emptyCandidate
  });

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network: string = await provider.getNetwork()
    const contract_addr: string = config[network.chainId].vote.address;

    const vote_contract = new ethers.Contract(contract_addr, VoteABI, provider)
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  const sendVote = async () => {
    if (!account || !provider) {
      alert("Please connect your wallet");
      return;
    }
  
    const signer = provider.getSigner();
    const network = await provider.getNetwork();
    const contract_addr = config[network.chainId].vote.address;
  
    const vote_contract = new ethers.Contract(contract_addr, VoteABI, signer);
  
    try {
      const tx = await vote_contract.vote(
        candidatesPicked.presidente.lista,
        candidatesPicked.senadores.lista,
        candidatesPicked.diputados.lista,
        candidatesPicked.mercosurNacional.lista,
        candidatesPicked.mercosurRegional.lista
      );
  
      await tx.wait();
      alert("Vote sent successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to send vote");
    }
  };
  


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
              <Button endDecorator={<KeyboardArrowRight />} color="success" size='lg' onClick={sendVote}>
                Enviar Voto
              </Button>
            </Box>
        </Box>
      </CssVarsProvider>
      
    </div>
  );
};

export default Vote;
