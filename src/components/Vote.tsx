import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import { sha256 } from '@ethersproject/sha2';

import { CssVarsProvider, CssBaseline, Typography, Button, Box } from '@mui/joy';

import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import '../App.css';
import CandidateCards from './CandidateCards';
import Navigation from './Navigation';

import VoteABI from '../abis/Vote.json'
import VoterData from './VoterData';

import config from '../config.json';


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

interface Config {
  vote: {
    address: string;
  };
}

// Type assertion for the imported config object
const typedConfig = config as Config;
//const ethers = require("ethers");

const Vote = () => {
  const [dni, setDni] = useState<string>('');
  const [numeroTramite, setNumeroTramite] = useState<string>('');
  
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string>("null");

  const [candidatesPicked, setCandidatesPicked] = useState<CandidatesPicked>({
    'presidente': emptyCandidate,
    'senadores': emptyCandidate,
    'diputados': emptyCandidate,
    'mercosurNacional': emptyCandidate,
    'mercosurRegional': emptyCandidate
  });

  const loadBlockchainData = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);

      const contract_addr = typedConfig.vote.address;

      const vote_contract = new ethers.Contract(contract_addr, VoteABI, provider);
      console.log('Vote contract loaded:', vote_contract);
    } catch (error) {
      console.error('Error loading blockchain data:', error);
    }
  };

  useEffect(() => {
    loadBlockchainData()
  }, [])

  const sendVote = async () => {
    if (!account || !provider) {
      alert("Please connect your wallet");
      return;
    }
  
    // Check if dni and numeroTramite are provided
    if (dni === undefined || numeroTramite === undefined) {
      alert("Please enter DNI and Número de Trámite");
      return;
    }
  
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();
    const contract_addr = typedConfig.vote.address;
  
    const vote_contract = new ethers.Contract(contract_addr, VoteABI, signer);
  
    const sha_dni = sha256(Buffer.from(dni + numeroTramite));
  
    const votes = [
      candidatesPicked.presidente.lista,
      candidatesPicked.senadores.lista,
      candidatesPicked.diputados.lista,
      candidatesPicked.mercosurNacional.lista,
      candidatesPicked.mercosurRegional.lista
    ];
  
    try {
      const tx = await vote_contract.vote(sha_dni, votes);
      await tx.wait();
      alert("Vote sent successfully!");
    } catch (error) {
      console.error(error);
      if (!account || !provider) {
        alert("Please install Metamask and connect your wallet to send the vote");
      } else {
        alert("Failed to send vote");
      }
    }
  };
  
  return (
    <div className="Vote">
      <CssVarsProvider>
        <CssBaseline />
        <Box >
          <Navigation account={account} setAccount={setAccount} />
        </Box>
        <Box>
          <CandidateCards candidatesPicked={candidatesPicked} setCandidatesPicked={setCandidatesPicked} />
        </Box>
        <Box >
          <VoterData dni={dni} setDni={setDni} numeroTramite={numeroTramite} setNumeroTramite={setNumeroTramite} />
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
