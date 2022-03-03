import detectEthereumProvider from "@metamask/detect-provider";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { loadContract } from "./utils/load_contract";

const App = () => {
  const [web3Api, setWeb3Api] = useState({ provider: null,web3: null, contract: null})
  const [account, setAccount] = useState('')
  const [balance, setBalance] = useState('')
  const [reload, setReload] = useState(false)
  
  const reloadEffect = () => setReload(!reload) 

  useEffect(() => {
    const loadProvider = async() => {
      const provider = await detectEthereumProvider()
      const contract = await loadContract("Funder", provider)
      if(provider) {
        provider.request({method: "eth_requestAccounts"})
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract
        })
      }
      else{
        console.log('Please install MetaMask!')
      }
    }
    loadProvider();
  },[])

  useEffect(() => {
    const getAddress = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0])
    }
    web3Api.web3 && getAddress()
  },[web3Api.web3])
 
  useEffect(() => {
    const loadBalance = async () => {
      const balance = await web3Api.web3.eth.getBalance(web3Api.contract.address)
      setBalance(web3Api.web3.utils.fromWei(balance, 'ether'));
      console.log(balance)
    }
    web3Api.contract && loadBalance()
  },[web3Api, reload])

  const transferFund = async () => {
    const {contract, web3} = web3Api
    await contract.transfer({
      from: account,
      value: web3.utils.toWei("2", "ether")
    })
    reloadEffect()
  }

  const withdrawFund = async () => {
    const {contract, web3} = web3Api
    const withdrawAmount = web3.utils.toWei("1", "ether")
    await contract.withdraw(withdrawAmount, {
      from: account
    })
    reloadEffect()
  }
  return (
    <>
      <div className="card text-center">
        <div className="card-header">Funding</div>
        <div className="card-body">
          <h5 className="card-title">Balance: {balance} Eth</h5>
          <p className="card-text">
            Account : {account ? account : 'not connected'}
          </p>
          &nbsp;
          <button type="button" className="btn btn-success" onClick={transferFund}>
            Transfer
          </button>
          &nbsp;
          <button type="button" className="btn btn-primary" onClick={withdrawFund}>
            Withdraw
          </button>
        </div>
        <div className="card-footer text-muted">Cdalas 2022</div>
      </div>
    </>
  );
};

export default App;


// useEffect(() => {
  //   const loadProvider = async () => {
  //     let provider = null;
  //     if (ethereum) {
  //       provider = ethereum;
  //       try {
  //         await provider.enable();
  //       } catch {
  //         console.log("user is not allowed");
  //       }
  //     }
  //     else if(window.web3) {
  //       provider = window.web3.currentProvider;
  //     }
  //     else if(!process.env.production) {
  //       provider = new Web3.providers.HttpProvider('http://localhost:7545')
  //     }
  //     setWeb3Api({
  //       web3: new Web3(provider),
  //       provider
  //     })
  //   };
  //   loadProvider();
  // }, [ethereum]);

  // useEffect(() => {
  //   const getAccount = async () => {
  //     const account = await web3Api.web3.eth.getAccounts()
  //     setAccount(account[0])
  //   }
  //   web3Api.web3 && getAccount()
  // },[web3Api.web3])