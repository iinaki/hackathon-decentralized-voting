import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Web3 } from 'web3';

import './App.css';
import Cards from './components/Cards';
import Sidebar from './components/Sidebar';

import img1 from './assets/image1.jpg';
import img2 from './assets/image2.jpg';
import img3 from './assets/image3.jpg';

import Election from './abis/Election.json'

import config from './config.json';

type Candidate = {
  id: number,
  candidato: string,
  image: string,
  partido: string
};


function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState('null');
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const voter_location = 'Madrid';

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

  useEffect(() => {
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
    ];

    setCandidates(cards);
  }, []);

  // useEffect(() => {
  //   loadBlockchainData()
  // }, []);

  return (
    <div className="App">
      <Sidebar account={account} setAccount={setAccount} />
      <Cards candidates={candidates}/>
    </div>
  );
};

export default App;

