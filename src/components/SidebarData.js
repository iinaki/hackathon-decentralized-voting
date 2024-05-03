import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import MailIcon from '@mui/icons-material/Mail'; 

export const SidebarData = [
    {
        title: 'Home',
        icon: <HomeIcon />,
        link: '/home'
    },
    {
        title: 'Vote',
        icon: <MailIcon />,
        link: '/vote'
    }
]