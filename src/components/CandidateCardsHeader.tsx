import React from 'react'
import List from '@mui/joy/List';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItem from '@mui/joy/ListItem';

type CandidateCardsHeaderProps = {
    text: string
}

const CandidateCardsHeader: React.FunctionComponent<CandidateCardsHeaderProps> = ({ text }) => {
    return (
        <List
            sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
            color: 'white',
            backgroundColor: '#4D869C',
            padding: '1rem',
            bottomBorderRadius: '10px'
            }}
        >
            <ListItem nested sx={{ display: 'flex', align: 'justify-content-center'}}>
                <ListSubheader sx={{ 
                    letterSpacing: '2px', fontWeight: '800', fontSize: '1.5rem', color: 'white'
                    }}>
                    {text}
                </ListSubheader>
            </ListItem>
        </List>
    );
};

export default CandidateCardsHeader;