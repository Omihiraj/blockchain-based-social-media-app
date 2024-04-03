import React from "react";
import Sidebar from "./Sidebar";
import Feed from "./Feed";
import Widgets from "./Widgets";
import "./App.css";
import { useState, useEffect } from "react";
import imagePath from './assets/metamask.jpg';

function App() {

  const [currentAccount, setCurrentAccount] = useState('');
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const backgroundImage = `url(${imagePath})`;


  const connectWallet = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log('Metamask not detected')
        return
      }
      let chainId = await ethereum.request({ method: 'eth_chainId' })
      console.log('Connected to chain:' + chainId)

      const rinkebyChainId = '0xaa36a7'

      if (chainId !== rinkebyChainId) {
        alert('You are not connected to the Rinkeby Testnet!')
        return
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      console.log('Found account', accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log('Error connecting to metamask', error)
    }
  }

  // Checks if wallet is connected to the correct network
  const checkCorrectNetwork = async () => {
    const { ethereum } = window
    let chainId = await ethereum.request({ method: 'eth_chainId' })
    console.log('Connected to chain:' + chainId)

    const rinkebyChainId = '0xaa36a7'

    if (chainId !== rinkebyChainId) {
      setCorrectNetwork(false)
    } else {
      setCorrectNetwork(true)
    }
  }

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    connectWallet();
    checkCorrectNetwork();
  });

  return (
    // BEM
    <div>
      {currentAccount === '' ? (

        <div style={{
          backgroundImage: backgroundImage,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          width: '100%',
          height: '100vh'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
            <div style={{ marginTop: '80px', color: 'white', fontSize: '36px', fontWeight: 'bolder' }}>Blockchain based Social media app</div>
            <div style={{ color: 'white', fontSize: '14px' }}>Please connect to the Metamask Wallet for start journy</div>
            <button
              style={{
                backgroundColor: '#000000',
                border: 'none',
                color: 'white',
                padding: '15px 32px',
                textAlign: 'center',
                textDecoration: 'none',
                display: 'inline-block',
                fontSize: '16px',
                marginTop: '460px',
                cursor: 'pointer',
                borderRadius: 100
              }}
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          </div>

        </div>
      ) : correctNetwork ? (
        <div className="app">
          <Sidebar />
          <Feed />
          <Widgets />
        </div>
      ) : (
        <div className='flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3'>
          <div>----------------------------------------</div>
          <div>Please connect to the SepoliaETH Testnet</div>
          <div>and reload the page</div>
          <div>----------------------------------------</div>
        </div>
      )
      }
    </div >

  );
}

export default App;
