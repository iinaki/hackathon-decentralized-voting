import React from 'react'
import { ethers } from 'ethers';
import { Web3 } from 'web3';

import './Sidebar.css';
import {SidebarData} from './SidebarData';

type SidebarProps = {
  account: string,
  setAccount: (account: string) => void
}

const Sidebar: React.FunctionComponent<SidebarProps> = ({ account, setAccount }) => {

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
    } else {
      alert('Please download metamask');
    }
  }

  return (
    <div className='Sidebar'>
        {account != 'null' ? (
                <button
                    type="button"
                    className='MetamaskConnect'
                >
                    {account.slice(0, 6) + '...' + account.slice(38, 42)}
                </button>
            ) : (
                <button
                    type="button"
                    className='MetamaskConnect'
                    onClick={connectMetamask}
                >
                    Connect to Metamask
                </button>
            )}
        <ul className='SidebarList'>
            {SidebarData.map((val, key) => {
            return (
                <li key={key} className='row' id={window.location.pathname == val.link ? 'active' : ''} onClick={() => {window.location.pathname = val.link}}>
                <div id='icon'>{val.icon}</div> <div id='title'>{val.title}</div>
                </li>
            )
            })}
        </ul>
    </div>
  )
}

export default Sidebar