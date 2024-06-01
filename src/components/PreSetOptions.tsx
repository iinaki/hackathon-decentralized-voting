import React from 'react'

import './Sidebar.css';
import { CssVarsProvider, CssBaseline, Typography, Button, Box } from '@mui/joy';

import { dataPresidentCards } from './CandidateCardsData';
import { dataSenadorCards } from './CandidateCardsData';
import { dataDiptadosCards } from './CandidateCardsData';
import { dataMercosurNacionalCards } from './CandidateCardsData';
import { dataMercosurRegionalCards } from './CandidateCardsData';

type PreSetOptionsProps = {
    setCandidatesPicked: (candidatesPicked: any) => void
}

const PreSetOptions: React.FunctionComponent<PreSetOptionsProps> = ({ setCandidatesPicked }) => {

    const chooseLLA = () => {
        setCandidatesPicked({
            'presidente': dataPresidentCards[3],
            'senadores': dataSenadorCards[0],
            'diputados': dataDiptadosCards[0],
            'mercosurNacional': dataMercosurNacionalCards[3],
            'mercosurRegional': dataMercosurRegionalCards[0]
        })
    }

    const chooseJXC = () => {
        setCandidatesPicked({
            'presidente': dataPresidentCards[0],
            'senadores': dataSenadorCards[3],
            'diputados': dataDiptadosCards[3],
            'mercosurNacional': dataMercosurNacionalCards[0],
            'mercosurRegional': dataMercosurRegionalCards[3]
        })
    }

    const chooseUXP = () => {
        setCandidatesPicked({
            'presidente': dataPresidentCards[2],
            'senadores': dataSenadorCards[2],
            'diputados': dataDiptadosCards[2],
            'mercosurNacional': dataMercosurNacionalCards[2],
            'mercosurRegional': dataMercosurRegionalCards[2]
        })
    }

    return (
        <CssVarsProvider>
            <CssBaseline />
            <Box sx={{ padding: '1rem', backgroundColor: '#222831', color: 'white' }}>
            <Typography 
                component="label" 
                htmlFor="preSetButton" 
                level="h4" 
                textColor="inherit" 
                fontWeight="lg" 
                sx={{ marginBottom: '1rem' }}
            >
                Pre Seleccionar por Partidos
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                    className='MetamaskConnect'
                    id="preSetButton"
                    variant="solid"
                    size="lg"
                    onClick={chooseUXP}
                >
                    UXP
                </Button>
                <Button 
                    className='MetamaskConnect'
                    id="preSetButton"
                    variant="solid"
                    size="lg"
                    onClick={chooseJXC}
                >
                    JXC
                </Button>
                <Button 
                    className='MetamaskConnect'
                    id="preSetButton"
                    variant="solid"
                    size="lg"
                    onClick={chooseLLA}
                >
                    LLA
                </Button>
            </Box>
            </Box>
        </CssVarsProvider>
    );
}
export default PreSetOptions;