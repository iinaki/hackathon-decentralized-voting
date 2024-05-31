import React from 'react'
import { useParams } from "react-router-dom";

import './Sidebar.css';
import List from '@mui/joy/List';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItem from '@mui/joy/ListItem';

import { CssVarsProvider, CssBaseline, Box, Typography, Input } from '@mui/joy';

type VoterDataProps = {
    dni: string,
    setDni: (dni: string) => void,
    numeroTramite: string,
    setNumeroTramite: (numeroTramite: string) => void
}

const VoterData: React.FunctionComponent<VoterDataProps> = ({ dni, setDni, numeroTramite, setNumeroTramite }) => {
    return (
        <CssVarsProvider>
            <CssBaseline />
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                color: 'white',
                backgroundColor: '#222831',
                padding: '1rem',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <List
                sx={{
                    display: 'flex',
                    gap: 1,
                    color: 'white',
                    padding: '1rem',
                    bottomBorderRadius: '10px'
                }}
                >
                    <ListItem nested sx={{ display: 'flex', align: 'justify-content-left' }}>
                        <ListSubheader sx={{ 
                        letterSpacing: '2px', fontWeight: '800', fontSize: '1.5rem', color: 'white'
                        }}>
                        Datos del Votante
                        </ListSubheader>
                    </ListItem>
                </List>
                <Box sx={{
                display: 'flex',
                padding: '0.5rem',
                gap: '1rem',
                width: '100%',
                justifyContent: 'center'
                }}>
                    <Box sx={{ flex: 1, maxWidth: '200px' }}>
                        <Typography component="label" htmlFor="dni" sx={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                            DNI
                        </Typography>
                        <Input
                            required
                            id="dni"
                            value={dni ?? ''}
                            onChange={(e) => setDni(e.target.value)}
                            size="lg"
                            sx={{
                            color: 'white',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            width: '100%'
                            }}
                        />
                    </Box>
                    <Box sx={{ flex: 1, maxWidth: '200px' }}>
                        <Typography component="label" htmlFor="numeroTramite" sx={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                        Número de Trámite
                        </Typography>
                        <Input
                        required
                        id="numeroTramite"
                        value={numeroTramite ?? ''}
                        onChange={(e) => setNumeroTramite(e.target.value)}
                        size="lg"
                        sx={{
                            color: 'white',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            width: '100%'
                        }}
                        />
                    </Box>
                </Box>
            </Box>
        </CssVarsProvider>
      );
    
}

export default VoterData;