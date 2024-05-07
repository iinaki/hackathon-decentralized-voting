import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Web3 } from 'web3';

import { CssVarsProvider, CssBaseline, Typography, Button, Box } from '@mui/joy';

import '../App.css';
import Cards from './Cards';
import Navigation from './Navigation';

import Election from '../abis/Election.json'

import config from '../config.json';
// import TabsRouter from './TabsRouter';

type Candidate = {
  lista: number,
  candidato: string,
  image: string,
  partido: string,
  rol: string
};

const Vote = () => {
    const [provider, setProvider] = useState(null)
    const [account, setAccount] = useState('null');
    const [candidatesPicked, setCandidatesPicked] = useState<Candidate[]>([]);
  
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
              <Box sx={{ p: 4 }}>
                <Navigation account={account} setAccount={setAccount} />
              </Box>
              <Box>
                <Cards candidatesPicked={candidatesPicked} setCandidatesPicked={setCandidatesPicked} />
              </Box>
        </CssVarsProvider>
    </div>
    );
};
    
export default Vote;
