
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import BechaNft from "./utils/becha.json";

const TWITTER_HANDLE = "bechabecha_nft";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
// const OPENSEA_LINK = "";
const CONTRACT_ADDRESS = '0xDbaD4107Da1871D98d1F670AA6c55663051CDfC1'

// const TOTAL_MINT_COUNT = 100;
const App = () => {
const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: '',
    SCAN_LINK: '',
    NETWORK: {
      NAME: '',
      SYMBOL: '',
      ID: 0,
    },
    NFT_NAME: '',
    SYMBOL: '',
    MAX_SUPPLY: 100,
    GAS_LIMIT: 0,
  })
  
  const [currentAccount, setCurrentAccount] = useState("");
  const [Allowlists, setAllowlists] = useState(false);
  const [saleStatus, setSaleStatus] = useState(false);
  const [maxPerWallet, setMaxPerWallet] = useState(null);
  const [mineStatus, setMineStatus] = useState(null);
  const [taxnHash, setTxnhash] = useState(null);

  console.log("currentAccount: ", currentAccount);
  
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      
    } else {
      console.log("No authorized account found");
    }
  };

 
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  
      console.log("Connected", accounts[0]);
  

      setCurrentAccount(accounts[0]);
  

    } catch (error) {
      console.log(error);
    }
  };

const mintNFT = async () => {
  try {
    // setMineStatus('mining');
    
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS,BechaNft.abi,signer);
      console.log("Going to pop wallet now to pay gas...");

      let mint = await connectedContract.preMint(1, {
        gasPrice: 5100000000,
        gasLimit: 200000,
        value: 8000000000000000,
      });

      console.log("Mining...please wait.");
      await mint.await();
      setTxnhash(mint.hash);
      setMineStatus('success');
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
};

// const checkActive = async () => {
//   const { ethereum } = window;
//   try {
//     const provider = new ethers.providers.Web3Provider(ethereum);
//     const signer = provider.getSigner()
//     const contract = new ethers.Contract(
//       CONTRACT_ADDRESS,
//       BechaNft.abi,
//       signer
//     );
//     // call your address    
//     const address = await signer.getAddress();
    
//     // bool: Allowlists
//     const Allowlists = await contract.updateWL(address);
//     setAllowlists(Allowlists)
    
//     // int: mintedPerWallet
//     const minted = await contract.minted(address);
//     setMaxPerWallet(minted.toString());

//     // bool: sale
//     const bool = await contract.setPresale();
//     setSaleStatus(bool);

//   } catch (err) {
//     console.error(err);
//   }
// };

// const renderMintUI = () => {
//   checkActive()
  
//   if (Allowlists) {
//     if (saleStatus) {
//       if (maxPerWallet < 2) {
//         return (<div>
//           <button onClick={mintNFT} className="bn29">Mint NFT</button>
          
//           <p>{currentAccount}<br/>Your address can mint NFT: Remaining {2-maxPerWallet}</p></div>
//           );    
//       } else {
//         return (<div><p class="success" >Thank you!🐑</p></div>);
//       }
//     } else {
//       return (<div>
//         <p>Not on sale<br/>{currentAccount}<br/>You have Allowlists</p></div>
//         );
//     }
//   } else {
//     return (<div><p>Not on sale<br/>{currentAccount}<br/>Your address don't have Allowlists</p></div>);
//   }
// }

// const claimNFTs = () => {
//   let cost = data.cost
//   let gasLimit = CONFIG.GAS_LIMIT
//   let method = null
//   let totalGasLimit = String(gasLimit * mintAmount)
//   setFeedback(`Minting your ${CONFIG.NFT_NAME}...`)
//   setClaimingNft(true)
//   if (data.presale) {
//     method = blockchain.smartContract.methods.preMint(
//       mintAmount,
//       merkle.hexProof
//     )
//   } else {
//     method = blockchain.smartContract.methods.publicMint(mintAmount)
//   }
//   method
//     .send({
//       gasLimit: String(totalGasLimit),
//       to: CONFIG.CONTRACT_ADDRESS,
//       from: blockchain.account,
//       value: totalCostWei,
//     })
//     .once('error', (err) => {
//       console.log(err)
//       setFeedback('Sorry, something went wrong please try again later.')
//       setClaimingNft(false)
//     })
//     .then((receipt) => {
//       console.log(receipt)
//       setFeedback(
//         `WOW, the ${CONFIG.NFT_NAME} is yours! go visit ${CONFIG.MARKETPLACE} to view it.`
//       )
//       setClaimingNft(false)
//       dispatch(fetchData(blockchain.account))
//     })
// }
// const claimNFTsB = () => {
//   let cost = 0.02;
//   let amount = mintAmountB;
//   let gasLimit = CONFIG.GAS_LIMIT;
//   let totalCostWei = String(cost * amount);//個数を１に固定0714(ふりっきー)
//   let totalGasLimit = String(gasLimit * amount);//個数を1に固定0714(ふりっきー)
//   console.log("Cost: ", totalCostWei);
//   console.log("Gas limit: ", totalGasLimit);
//   setFeedback(`${CONFIG.NAME}ミント中...`);
//   setClaimingNft(true);
//   blockchain.smartContract.methods
//   .mintB(amount)
//   .send({
//       gasLimit: String(totalGasLimit),
//       to: CONFIG.CONTRACT_ADDRESS,
//       from: blockchain.account,
//       value: totalCostWei,
//       maxPriorityFeePerGas: "40000000000",
//     })
//     .once("error", (err) => {
//       console.log(err);
//       setFeedback("ミント失敗（泣）もう一回やってみてね！");
//       setClaimingNft(false);
//     })
//     .then((receipt) => {
//       console.log(receipt);
//       setFeedback(
//         `わぁ!${CONFIG.NAME}ミント成功!!自分のOpen seaで確認してみてね！`
//       );
//       setClaimingNft(true);
//       checkMintedwlB();
//       // dispatch(fetchData(blockchain.account));
//     });
// };

// const getConfig = async () => {
//   const configResponse = await fetch('/config/config.json', {
//     headers: {
//       'Content-Type': 'application/json',
//       Accept: 'application/json',
//     },
//   })
//   const config = await configResponse.json()
//   SET_CONFIG(config)
// }




  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );
  
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Becha</p>
            <div className="sub-text">
            <p>No Roadmap, No Discord, No Utility, No Rarity</p>
              <p> Sale: 2022/11/14 21:00 JST ~ (Open: 48 hours)</p>
              <p> ALSale: 0.008 ETH(24 hours)</p>
              <p> public Sale: 0.01ETH(24 hours)</p>
              <p> 2 mint Per Wallet</p>
              <p> Supply: 100</p>
            </div> 
            {/* <div className='banner-img'>
              <a href={OPENSEA_LINK}><img src={image}/></a>
            </div> */}
          {currentAccount === "" ? (renderNotConnectedContainer()) : 
          (
            <button onClick={mintNFT} className="cta-button connect-wallet-button">
              You can MINT!
            </button>
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`@${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
  
};
export default App;