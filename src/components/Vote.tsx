import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import { sha256 } from '@ethersproject/sha2';
import { Buffer } from 'buffer';

import { CssVarsProvider, CssBaseline, Typography, Button, Box, Sheet, Link  } from '@mui/joy';
import Modal from '@mui/joy/Modal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircularProgress from '@mui/joy/CircularProgress';
import ErrorIcon from '@mui/icons-material/Error';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import '../App.css';
import CandidateCards from './CandidateCards';
import Navigation from './Navigation';

import VoteABI from '../abis/Vote.json';
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

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

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
    if (dni === '' || numeroTramite === '') {
      alert("Please enter DNI and Número de Trámite");
      return;
    }

    setIsModalOpen(true);
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);
  
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();
    const contract_addr = typedConfig.vote.address;
  
    const vote_contract = new ethers.Contract(contract_addr, VoteABI, signer);
  
    let sha_dni = sha256(Buffer.from(dni + numeroTramite));
    sha_dni = sha_dni.substring(2);
  
    const votes = [
      candidatesPicked.presidente.lista,
      candidatesPicked.mercosurNacional.lista,
      candidatesPicked.senadores.lista,
      candidatesPicked.diputados.lista,
      candidatesPicked.mercosurRegional.lista
    ];

    try {
      const tx = await vote_contract.vote(sha_dni, votes);
      await tx.wait();
      setIsLoading(false);
      setIsSuccess(true);
      setDni('');
      setNumeroTramite('');
      setCandidatesPicked({
        'presidente': emptyCandidate,
        'senadores': emptyCandidate,
        'diputados': emptyCandidate,
        'mercosurNacional': emptyCandidate,
        'mercosurRegional': emptyCandidate
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setIsError(true);
    }
  };
  
  return (
    <div className="Vote">
      <CssVarsProvider>
        <CssBaseline />
        <Box >
          <Navigation account={account} setAccount={setAccount} setCandidatesPicked={setCandidatesPicked} />
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
        <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
        >
          <Sheet
            variant="outlined"
            sx={{
              maxWidth: 500,
              borderRadius: 'md',
              p: 3,
              boxShadow: 'lg',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center', // Center children horizontally
              textAlign: 'center',  // Center text
            }}
          >
            <Typography
              component="h2"
              id="modal-title"
              level="h2"
              textColor="inherit"
              fontWeight="lg"
              mb={1}
            >
              {isLoading ? "Your vote is being processed" : isSuccess ? "Vote sent successfully!" : "Failed to send vote"}
            </Typography>
            {isLoading ? (
              <CircularProgress thickness={1} size="lg" sx={{ mb: 2 }} />
            ) : isSuccess ? (
              <CheckCircleIcon sx={{ fontSize: 60, color: 'green', mb: 2 }} />
            ) : (
              <ErrorIcon sx={{ fontSize: 60, color: 'red', mb: 2 }} />
            )}
            <Typography id="modal-desc" textColor="text.tertiary">
              {isLoading ? "This might take a few minutes." : isSuccess ? "Thank you for voting!" : "Your transaction failed, please try again with the right data."}
            </Typography>
            {isSuccess && (
              <>
                <Typography id="modal-desc" textColor="text.tertiary">
                If your data is valid, you will see your vote on your account in a few minutes.
                </Typography>
                <Link href="https://testnets.opensea.io/account" target="_blank" rel="noopener" underline="hover">
                  View in OpenSea.
                </Link>
              </>
            )}
          </Sheet>
        </Modal>
      </CssVarsProvider>
      
    </div>
  );
};

export default Vote;
