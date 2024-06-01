import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import { Link } from 'react-router-dom';
import { CssVarsProvider, CssBaseline, Typography, Button, Box } from '@mui/joy';
import HeaderHome from './HeaderHome';
import List from '@mui/joy/List';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItem from '@mui/joy/ListItem';
import { CandidateVotesCount } from './CandidateVotesCount';

import VoteABI from '../abis/Vote.json'
import config from '../config.json';
import HomeNavigation from './HomeNavigation';

interface Config {
    vote: {
      address: string;
    };
  }
  
const typedConfig = config as Config;

const Home = () => {
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [account, setAccount] = useState<string>("null");
    
    const [presidenteVotes, setPresidenteVotes] = useState<number[][]>(
        [
            [132, 133, 134, 135, 136],
            [0, 0, 0, 0, 0]
        ]
    );
    const [senadoresVotes, setSenadoresVotes] = useState<number[][]>(
        [
            [501, 502, 503, 504],
            [0, 0, 0, 0]
        ]
    );
    const [diputadosVotes, setDiputadosVotes] = useState<number[][]>(
        [
            [501, 502, 503, 504],
            [0, 0, 0, 0]
        ]
    );

    const [mercosurNacionalVotes, setMercosurNacionalVotes] = useState<number[][]>(
        [
            [132, 133, 134, 135, 136],
            [0, 0, 0, 0, 0]
        ]
    );

    const [mercosurRegionalVotes, setMercosurRegionalVotes] = useState<number[][]>(
        [
            [501, 502, 503, 504],
            [0, 0, 0, 0]
        ]
    );

    // const fetchVoteCounts = async () => {
    //     try {
    //         const provider = new ethers.BrowserProvider(window.ethereum);
    //         setProvider(provider);
    //         const contract_addr = typedConfig.vote.address;

    //         const vote_contract = new ethers.Contract(contract_addr, VoteABI, provider);

    //         let votes: number[] = [];
    //         presidenteVotes[0].forEach(async (listId) => {
    //             const voteCount = await vote_contract.getPresidentVotes(listId);
    //             votes.push(voteCount);
    //         });

    //         console.log(votes);

    //         setPresidenteVotes([presidenteVotes[0], votes]);

    //         votes = [];
    //         senadoresVotes[0].forEach(async (listId) => {
    //             const voteCount = await vote_contract.getSenadoresVotes(listId);
    //             votes.push(voteCount);
    //         });
    //         console.log(votes);

    //         setSenadoresVotes([senadoresVotes[0], votes]);

    //         votes = [];
    //         diputadosVotes[0].forEach(async (listId) => {
    //             const voteCount = await vote_contract.getDiputadosVotes(listId);
    //             votes.push(voteCount);
    //         });
    //         console.log(votes);

    //         setDiputadosVotes([diputadosVotes[0], votes]);

    //         votes = [];
    //         mercosurNacionalVotes[0].forEach(async (listId) => {
    //             const voteCount = await vote_contract.getMercosurNacionalVotes(listId);
    //             votes.push(voteCount);
    //         });
    //         console.log(votes);

    //         setMercosurNacionalVotes([mercosurNacionalVotes[0], votes]);

    //         votes = [];
    //         mercosurRegionalVotes[0].forEach(async (listId) => {
    //             const voteCount = await vote_contract.getMercosurRegionalVotes(listId);
    //             votes.push(voteCount);
    //         });
    //         console.log(votes);

    //         setMercosurRegionalVotes([mercosurRegionalVotes[0], votes]);
    //     } catch (error) {
    //         console.error('Error loading blockchain data:', error);
    //     }
    //   };

    const fetchVoteCounts = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            setProvider(provider);
            const contract_addr = typedConfig.vote.address;
            const vote_contract = new ethers.Contract(contract_addr, VoteABI, provider);

            const fetchVotes = async (list: number[], method: string) => {
                const votes = await Promise.all(list.map(async (listId) => {
                    const voteCount = await vote_contract[method](listId);
                    return voteCount.toNumber(); // Ensure the vote count is a number
                }));
                return votes;
            };

            const presidenteVotesList = await fetchVotes(presidenteVotes[0], 'getPresidentVotes');
            setPresidenteVotes([presidenteVotes[0], presidenteVotesList]);

            const senadoresVotesList = await fetchVotes(senadoresVotes[0], 'getSenadoresVotes');
            setSenadoresVotes([senadoresVotes[0], senadoresVotesList]);

            const diputadosVotesList = await fetchVotes(diputadosVotes[0], 'getDiputadosVotes');
            setDiputadosVotes([diputadosVotes[0], diputadosVotesList]);

            const mercosurNacionalVotesList = await fetchVotes(mercosurNacionalVotes[0], 'getMercosurNacionalVotes');
            setMercosurNacionalVotes([mercosurNacionalVotes[0], mercosurNacionalVotesList]);

            const mercosurRegionalVotesList = await fetchVotes(mercosurRegionalVotes[0], 'getMercosurRegionalVotes');
            setMercosurRegionalVotes([mercosurRegionalVotes[0], mercosurRegionalVotesList]);

        } catch (error) {
            console.error('Error loading blockchain data:', error);
        }
    };

    useEffect(() => {
        fetchVoteCounts();
    }, []);

    return (
        <div className="Vote">
            <CssVarsProvider>
                <CssBaseline />
                <Box sx={{ backgroundColor: '#222831' }} >
                    <HomeNavigation account={account} setAccount={setAccount} />
                    <Box >
                        <HeaderHome />
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 1,
                        color: 'white',
                        backgroundColor: '#222831',
                        padding: '1rem',
                    }}>
                        <Button size='lg' variant="soft"> 
                            <Link to={`/DVote/vote`} >
                                VOTAR
                            </Link>
                        </Button>
                    </Box>
                    <Box sx={{ backgroundColor: '#EEF7FF', display: 'flex', justifyContent: 'center' }} >
                        <Box sx={{ maxWidth: '1000px', justifyContent: 'center', alignItems: 'center' }} >
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 1,
                                color: 'white',
                                backgroundColor: '#EEF7FF',
                                padding: '1rem'
                            }}>
                                <List
                                    sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 1,
                                    color: 'white',
                                    backgroundColor: '#7AB2B2',
                                    padding: '1rem',
                                    bottomBorderRadius: '10px',
                                    borderRadius: '10px'
                                    }}
                                >
                                    <ListItem nested sx={{ display: 'flex', align: 'justify-content-center'}}>
                                        <ListSubheader sx={{ 
                                            letterSpacing: '2px', fontWeight: '800', fontSize: '1.5rem', color: 'white'
                                            }}>
                                            recuento de votos en tiempo real
                                        </ListSubheader>
                                    </ListItem>
                                </List>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '10px' }}>
                                <CandidateVotesCount votesMatrix={presidenteVotes} voteType="Presidente" />
                                <CandidateVotesCount votesMatrix={senadoresVotes} voteType="Senadores" />
                                <CandidateVotesCount votesMatrix={diputadosVotes} voteType="Diputados" />
                                <CandidateVotesCount votesMatrix={mercosurNacionalVotes} voteType="Mercosur Nacional" />
                                <CandidateVotesCount votesMatrix={mercosurRegionalVotes} voteType="Mercosur Regional" />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </CssVarsProvider>
        </div>
    );
}

export default Home;