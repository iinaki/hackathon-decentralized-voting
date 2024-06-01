import React from 'react'

import './Sidebar.css';
import { CssVarsProvider, CssBaseline, Typography, Button, Box } from '@mui/joy';
import List from '@mui/joy/List';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItem from '@mui/joy/ListItem';



const HeaderHome = () => {

  return (

    <CssVarsProvider>
      <CssBaseline />
        <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1,
                color: 'white',
                backgroundColor: '#222831',
                padding: '1rem',
              }}>
        <List
            sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
            color: 'white',
            backgroundColor: '#4D869C',
            padding: '1rem',
            bottomBorderRadius: '10px',
            borderRadius: '10px'
            }}
        >
            <ListItem nested sx={{ display: 'flex', align: 'justify-content-center'}}>
                <ListSubheader sx={{ 
                    letterSpacing: '2px', fontWeight: '800', fontSize: '1.5rem', color: 'white'
                    }}>
                    elecciones argentina 2023 - 1era vuelta
                </ListSubheader>
            </ListItem>
        </List>
        </Box>
    </CssVarsProvider>
  )
}

export default HeaderHome;