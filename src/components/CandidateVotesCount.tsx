import React from 'react';
import Table from '@mui/joy/Table';
import { Box, Typography } from '@mui/joy';

type CandidateVotesCountProps = {
    votesMatrix: number[][];
    voteType: string;
  };
  
  export const CandidateVotesCount: React.FunctionComponent<CandidateVotesCountProps> = ({ votesMatrix, voteType }) => {
    const [listNumbers, votes] = votesMatrix;
  
    return (
        <Box sx={{ marginBottom: '5rem', maxWidth: '1000px', margin: '0 auto', backgroundColor: "#CDE8E5", padding: '2rem' }}>
            <Typography level="h2" sx={{ marginBottom: '0.5rem', textAlign: 'center' }}>
            {voteType}
            </Typography>
            <Table aria-label={`${voteType} votes`} size="lg" borderAxis="xBetween" sx={{ borderRadius: '10px', backgroundColor: "#B3C8CF" }} >
                <thead>
                <tr>
                    <th>Número de Lista</th>
                    {listNumbers.map((listNumber, index) => (
                    <th key={`listNumber-${index}`}>{listNumber}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Votos</td>
                    {votes.map((vote, index) => (
                        <td key={`vote-${index}`}>{vote}</td>
                    ))}
                </tr>
                </tbody>
            </Table>
        </Box>
    );
  };
