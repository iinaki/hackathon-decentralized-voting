import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CssVarsProvider, CssBaseline, Typography, Button, Box } from '@mui/joy';

const Home = () => {

    return (
        <CssVarsProvider>
            <CssBaseline />
            <Box sx={{ p: 4 }}>
                <Button>
                    <Link to={`/DVote/vote`} className="link">
                        VOTE
                    </Link>
                </Button>
            </Box>
        </CssVarsProvider>
    );
}

export default Home;