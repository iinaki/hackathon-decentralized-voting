import React from 'react'
import { Web3 } from 'web3';

import './Sidebar.css';
import { CssVarsProvider, CssBaseline, Button, Box } from '@mui/joy';

type HomeNavigationProps = {
  account: string,
  setAccount: (account: string) => void
}

const HomeNavigation: React.FunctionComponent<HomeNavigationProps> = ({ account, setAccount }) => {
    
  async function connectMetamask() {
    console.log("Connecting to Metamask")
    //check metamask is installed
    if (window.ethereum) {
      // instantiate Web3 with the injected provider
      const web3 = new Web3(window.ethereum);

      //request user to connect accounts (Metamask will prompt)
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      //get the connected accounts
      const accounts = await web3.eth.getAccounts();

      //show the first connected account in the react page
      setAccount(accounts[0]);

      // subscribe to accountsChanged event
      window.ethereum.on('accountsChanged', function (newAccounts: string[]) {
        // update the account state when accounts change
        setAccount(newAccounts[0]);
      });
    } else {
      alert('Please download metamask');
    }
  }

  return (

    <CssVarsProvider>
      <CssBaseline />
        <Box sx={{
                display: 'flex',
                justifyContent: 'right',
                alignItems: 'center',
                gap: 1,
                color: 'white',
                backgroundColor: '#222831',
                padding: '1rem',
              }}>
            {account != 'null' ? (
                <Button 
                    className='MetamaskConnect'
                    variant="soft"
                    size="lg"
                    sx={{ maxHeight: '60px', padding: '1rem' }}
                >
                    {account.slice(0, 6) + '...' + account.slice(38, 42)}
                </Button>
            ) : (
                <Button 
                    className='MetamaskConnect'
                    variant="soft"
                    size="lg"
                    sx={{ maxHeight: '60px', padding: '1rem' }}
                    onClick={connectMetamask}
                >
                    Connect to Metamask
                </Button>
            )}
        </Box>
    </CssVarsProvider>
  )
}

export default HomeNavigation;