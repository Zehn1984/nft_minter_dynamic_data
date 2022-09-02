import { useState } from 'react';
import { ethers } from "ethers";

// Criando funcao principal que sera chamada pelo react no index.js para interagir com contrato
function CallContract() {

  // Declarando variaveis globais constante obrigatorias utilizando o ethersjs para acessar as funcoes posteriormente
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const abi = [
         {
           "inputs": [],
           "stateMutability": "nonpayable",
           "type": "constructor"
         },
         {
           "anonymous": false,
           "inputs": [
             {
               "indexed": true,
               "internalType": "address",
               "name": "owner",
               "type": "address"
             },
             {
               "indexed": true,
               "internalType": "address",
               "name": "approved",
               "type": "address"
             },
             {
               "indexed": true,
               "internalType": "uint256",
               "name": "tokenId",
               "type": "uint256"
             }
           ],
           "name": "Approval",
           "type": "event"
         },
         {
           "anonymous": false,
           "inputs": [
             {
               "indexed": true,
               "internalType": "address",
               "name": "owner",
               "type": "address"
             },
             {
               "indexed": true,
               "internalType": "address",
               "name": "operator",
               "type": "address"
             },
             {
               "indexed": false,
               "internalType": "bool",
               "name": "approved",
               "type": "bool"
             }
           ],
           "name": "ApprovalForAll",
           "type": "event"
         },
         {
           "anonymous": false,
           "inputs": [
             {
               "indexed": true,
               "internalType": "address",
               "name": "previousOwner",
               "type": "address"
             },
             {
               "indexed": true,
               "internalType": "address",
               "name": "newOwner",
               "type": "address"
             }
           ],
           "name": "OwnershipTransferred",
           "type": "event"
         },
         {
           "anonymous": false,
           "inputs": [
             {
               "indexed": true,
               "internalType": "address",
               "name": "from",
               "type": "address"
             },
             {
               "indexed": true,
               "internalType": "address",
               "name": "to",
               "type": "address"
             },
             {
               "indexed": true,
               "internalType": "uint256",
               "name": "tokenId",
               "type": "uint256"
             }
           ],
           "name": "Transfer",
           "type": "event"
         },
         {
           "inputs": [
             {
               "internalType": "string",
               "name": "nomeConquista_",
               "type": "string"
             },
             {
               "internalType": "uint128",
               "name": "dataConquista_",
               "type": "uint128"
             },
             {
               "internalType": "uint128",
               "name": "idConquista_",
               "type": "uint128"
             }
           ],
           "name": "adicionarConquistaHistorico",
           "outputs": [],
           "stateMutability": "nonpayable",
           "type": "function"
         },
         {
           "inputs": [
             {
               "internalType": "address",
               "name": "to",
               "type": "address"
             },
             {
               "internalType": "uint256",
               "name": "tokenId",
               "type": "uint256"
             }
           ],
           "name": "approve",
           "outputs": [],
           "stateMutability": "nonpayable",
           "type": "function"
         },
         {
           "inputs": [
             {
               "internalType": "address",
               "name": "owner",
               "type": "address"
             }
           ],
           "name": "balanceOf",
           "outputs": [
             {
               "internalType": "uint256",
               "name": "",
               "type": "uint256"
             }
           ],
           "stateMutability": "view",
           "type": "function"
         },
         {
           "inputs": [],
           "name": "consultarHistorico",
           "outputs": [
             {
               "components": [
                 {
                   "internalType": "string",
                   "name": "nomeConquista",
                   "type": "string"
                 },
                 {
                   "internalType": "uint128",
                   "name": "dataConquista",
                   "type": "uint128"
                 },
                 {
                   "internalType": "uint128",
                   "name": "idConquista",
                   "type": "uint128"
                 }
               ],
               "internalType": "struct CarteirinhaNFT.Historico[]",
               "name": "",
               "type": "tuple[]"
             }
           ],
           "stateMutability": "view",
           "type": "function"
         },
         {
           "inputs": [
             {
               "internalType": "uint256",
               "name": "tokenId",
               "type": "uint256"
             }
           ],
           "name": "getApproved",
           "outputs": [
             {
               "internalType": "address",
               "name": "",
               "type": "address"
             }
           ],
           "stateMutability": "view",
           "type": "function"
         },
         {
           "inputs": [
             {
               "internalType": "uint256",
               "name": "",
               "type": "uint256"
             }
           ],
           "name": "historico",
           "outputs": [
             {
               "internalType": "string",
               "name": "nomeConquista",
               "type": "string"
             },
             {
               "internalType": "uint128",
               "name": "dataConquista",
               "type": "uint128"
             },
             {
               "internalType": "uint128",
               "name": "idConquista",
               "type": "uint128"
             }
           ],
           "stateMutability": "view",
           "type": "function"
         },
         {
           "inputs": [
             {
               "internalType": "address",
               "name": "owner",
               "type": "address"
             },
             {
               "internalType": "address",
               "name": "operator",
               "type": "address"
             }
           ],
           "name": "isApprovedForAll",
           "outputs": [
             {
               "internalType": "bool",
               "name": "",
               "type": "bool"
             }
           ],
           "stateMutability": "view",
           "type": "function"
         },
         {
           "inputs": [],
           "name": "name",
           "outputs": [
             {
               "internalType": "string",
               "name": "",
               "type": "string"
             }
           ],
           "stateMutability": "view",
           "type": "function"
         },
         {
           "inputs": [],
           "name": "owner",
           "outputs": [
             {
               "internalType": "address",
               "name": "",
               "type": "address"
             }
           ],
           "stateMutability": "view",
           "type": "function"
         },
         {
           "inputs": [
             {
               "internalType": "uint256",
               "name": "tokenId",
               "type": "uint256"
             }
           ],
           "name": "ownerOf",
           "outputs": [
             {
               "internalType": "address",
               "name": "",
               "type": "address"
             }
           ],
           "stateMutability": "view",
           "type": "function"
         },
         {
           "inputs": [],
           "name": "renounceOwnership",
           "outputs": [],
           "stateMutability": "nonpayable",
           "type": "function"
         },
         {
           "inputs": [
             {
               "internalType": "address",
               "name": "to",
               "type": "address"
             }
           ],
           "name": "safeMint",
           "outputs": [],
           "stateMutability": "nonpayable",
           "type": "function"
         },
         {
           "inputs": [
             {
               "internalType": "address",
               "name": "from",
               "type": "address"
             },
             {
               "internalType": "address",
               "name": "to",
               "type": "address"
             },
             {
               "internalType": "uint256",
               "name": "tokenId",
               "type": "uint256"
             }
           ],
           "name": "safeTransferFrom",
           "outputs": [],
           "stateMutability": "nonpayable",
           "type": "function"
         },
         {
           "inputs": [
             {
               "internalType": "address",
               "name": "from",
               "type": "address"
             },
             {
               "internalType": "address",
               "name": "to",
               "type": "address"
             },
             {
               "internalType": "uint256",
               "name": "tokenId",
               "type": "uint256"
             },
             {
               "internalType": "bytes",
               "name": "_data",
               "type": "bytes"
             }
           ],
           "name": "safeTransferFrom",
           "outputs": [],
           "stateMutability": "nonpayable",
           "type": "function"
         },
         {
           "inputs": [
             {
               "internalType": "address",
               "name": "operator",
               "type": "address"
             },
             {
               "internalType": "bool",
               "name": "approved",
               "type": "bool"
             }
           ],
           "name": "setApprovalForAll",
           "outputs": [],
           "stateMutability": "nonpayable",
           "type": "function"
         },
         {
           "inputs": [
             {
               "internalType": "bytes4",
               "name": "interfaceId",
               "type": "bytes4"
             }
           ],
           "name": "supportsInterface",
           "outputs": [
             {
               "internalType": "bool",
               "name": "",
               "type": "bool"
             }
           ],
           "stateMutability": "view",
           "type": "function"
         },
         {
           "inputs": [],
           "name": "symbol",
           "outputs": [
             {
               "internalType": "string",
               "name": "",
               "type": "string"
             }
           ],
           "stateMutability": "view",
           "type": "function"
         },
         {
           "inputs": [
             {
               "internalType": "uint256",
               "name": "index",
               "type": "uint256"
             }
           ],
           "name": "tokenByIndex",
           "outputs": [
             {
               "internalType": "uint256",
               "name": "",
               "type": "uint256"
             }
           ],
           "stateMutability": "view",
           "type": "function"
         },
         {
           "inputs": [
             {
               "internalType": "address",
               "name": "owner",
               "type": "address"
             },
             {
               "internalType": "uint256",
               "name": "index",
               "type": "uint256"
             }
           ],
           "name": "tokenOfOwnerByIndex",
           "outputs": [
             {
               "internalType": "uint256",
               "name": "",
               "type": "uint256"
             }
           ],
           "stateMutability": "view",
           "type": "function"
         },
         {
           "inputs": [
             {
               "internalType": "uint256",
               "name": "tokenId",
               "type": "uint256"
             }
           ],
           "name": "tokenURI",
           "outputs": [
             {
               "internalType": "string",
               "name": "",
               "type": "string"
             }
           ],
           "stateMutability": "view",
           "type": "function"
         },
         {
           "inputs": [],
           "name": "totalSupply",
           "outputs": [
             {
               "internalType": "uint256",
               "name": "",
               "type": "uint256"
             }
           ],
           "stateMutability": "view",
           "type": "function"
         },
         {
           "inputs": [
             {
               "internalType": "address",
               "name": "from",
               "type": "address"
             },
             {
               "internalType": "address",
               "name": "to",
               "type": "address"
             },
             {
               "internalType": "uint256",
               "name": "tokenId",
               "type": "uint256"
             }
           ],
           "name": "transferFrom",
           "outputs": [],
           "stateMutability": "nonpayable",
           "type": "function"
         },
         {
           "inputs": [
             {
               "internalType": "address",
               "name": "newOwner",
               "type": "address"
             }
           ],
           "name": "transferOwnership",
           "outputs": [],
           "stateMutability": "nonpayable",
           "type": "function"
         }
  ]

  // Criando useState() react para retornar na tela a informacao coletada da blockchain
  let [nome, setNome] = useState("")
  let [signer, setSigner] = useState("")
  let [wallet, setWallet] = useState(false)
  let [balance, setBalance] = useState("")
  let [deployedContract, setDeployedContract] = useState(false)
  let [contractObject, setContractObject] = useState(new ethers.Contract(localStorage.getItem("contract_address"), abi, provider)) // // ja comecamos com o ultimo contrato deployado na memoria
  let [balanceOf, setBalanceOf] = useState("")

  // Conectar Carteira Metamask
  async function connectMetamask() {    
    // Requisitando permissao ao usuario para conexao da metamask junto ao script e contrato
    provider.send("eth_requestAccounts", []);
    signer = provider.getSigner(); // requisicao de assinatura para conectar na metamask, caso nao esteja conectado
    localStorage.setItem("wallet", await signer.getAddress()) // captura a wallet em um DB local
    setSigner(await signer) // atualiza estado do signer para conectado, assim podemos chamar as outras funcoes que exige assinatura
    setWallet(await signer.getAddress()) // Pega o endereco da carteira conectada
  }

  // Pegar saldo matic
  async function getSaldo() {
    const balance_wei = await signer.getBalance()
    balance = await ethers.utils.formatEther(balance_wei) // converte de wei pra ether (divide por 1e18)
    localStorage.setItem("balance", await balance)
    setBalance(await balance)
  }
  
  // Minta carteirinha e guarda hash do endereco em uma variavel
  async function deployContract() {
    // copiando e colando bytecode da polygonscan (necessario apenas para fazer deploy) - o bytecode eh o codigo fonte do contrato transformado em linguagem de maquina, que eh a linguagem que o EVM executa
    const ContractByteCode = "60806040523480156200001157600080fd5b50604080518082018252600e81526d10d85c9d195a5c9a5b9a1853919560921b60208083019182528351808501909452600484526310d3919560e21b9084015281519192916200006491600091620000f3565b5080516200007a906001906020840190620000f3565b50505062000097620000916200009d60201b60201c565b620000a1565b620001d6565b3390565b600a80546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b828054620001019062000199565b90600052602060002090601f01602090048101928262000125576000855562000170565b82601f106200014057805160ff191683800117855562000170565b8280016001018555821562000170579182015b828111156200017057825182559160200191906001019062000153565b506200017e92915062000182565b5090565b5b808211156200017e576000815560010162000183565b600181811c90821680620001ae57607f821691505b60208210811415620001d057634e487b7160e01b600052602260045260246000fd5b50919050565b611dee80620001e66000396000f3fe608060405234801561001057600080fd5b506004361061014d5760003560e01c80634f6ccce7116100c3578063a22cb4651161007c578063a22cb465146102bc578063b88d4fde146102cf578063c13e57b4146102e2578063c87b56dd146102f7578063e985e9c51461030a578063f2fde38b1461034657600080fd5b80634f6ccce7146102625780636352211e1461027557806370a0823114610288578063715018a61461029b5780638da5cb5b146102a357806395d89b41146102b457600080fd5b806323b872dd1161011557806323b872dd146101e15780632f745c59146101f457806330bb8ae614610207578063330c52091461021a57806340d097c31461023c57806342842e0e1461024f57600080fd5b806301ffc9a71461015257806306fdde031461017a578063081812fc1461018f578063095ea7b3146101ba57806318160ddd146101cf575b600080fd5b6101656101603660046119bc565b610359565b60405190151581526020015b60405180910390f35b61018261036a565b6040516101719190611ba1565b6101a261019d366004611a63565b6103fc565b6040516001600160a01b039091168152602001610171565b6101cd6101c8366004611993565b610423565b005b6008545b604051908152602001610171565b6101cd6101ef3660046118a5565b61053e565b6101d3610202366004611993565b61056f565b6101cd6102153660046119f4565b610605565b61022d610228366004611a63565b6106b1565b60405161017193929190611bb4565b6101cd61024a366004611859565b610781565b6101cd61025d3660046118a5565b6107b2565b6101d3610270366004611a63565b6107cd565b6101a2610283366004611a63565b61086e565b6101d3610296366004611859565b6108ce565b6101cd610954565b600a546001600160a01b03166101a2565b610182610968565b6101cd6102ca366004611959565b610977565b6101cd6102dd3660046118e0565b610982565b6102ea6109ba565b6040516101719190611b13565b610182610305366004611a63565b610ad5565b610165610318366004611873565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b6101cd610354366004611859565b610b49565b600061036482610bc2565b92915050565b60606000805461037990611cf6565b80601f01602080910402602001604051908101604052809291908181526020018280546103a590611cf6565b80156103f25780601f106103c7576101008083540402835291602001916103f2565b820191906000526020600020905b8154815290600101906020018083116103d557829003601f168201915b5050505050905090565b600061040782610be7565b506000908152600460205260409020546001600160a01b031690565b600061042e8261086e565b9050806001600160a01b0316836001600160a01b031614156104a15760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b60648201526084015b60405180910390fd5b336001600160a01b03821614806104bd57506104bd8133610318565b61052f5760405162461bcd60e51b815260206004820152603e60248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60448201527f6b656e206f776e6572206e6f7220617070726f76656420666f7220616c6c00006064820152608401610498565b6105398383610c46565b505050565b6105483382610cb4565b6105645760405162461bcd60e51b815260040161049890611c39565b610539838383610d33565b600061057a836108ce565b82106105dc5760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201526a74206f6620626f756e647360a81b6064820152608401610498565b506001600160a01b03919091166000908152600660209081526040808320938352929052205490565b61060d610eda565b604080516060810182528481526001600160801b0380851660208084019190915290841692820192909252600d805460018101825560009190915281518051929360029092027fd7b6990105719101dabeb77144f2a3385c8033acd3af97e9423a695e81ad1eb501926106839284920190611717565b5060208201516040909201516001600160801b03908116600160801b02921691909117600190910155505050565b600d81815481106106c157600080fd5b90600052602060002090600202016000915090508060000180546106e490611cf6565b80601f016020809104026020016040519081016040528092919081815260200182805461071090611cf6565b801561075d5780601f106107325761010080835404028352916020019161075d565b820191906000526020600020905b81548152906001019060200180831161074057829003601f168201915b505050600190930154919250506001600160801b0380821691600160801b90041683565b610789610eda565b6000610794600b5490565b90506107a4600b80546001019055565b6107ae8282610f34565b5050565b61053983838360405180602001604052806000815250610982565b60006107d860085490565b821061083b5760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201526b7574206f6620626f756e647360a01b6064820152608401610498565b6008828154811061085c57634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050919050565b6000818152600260205260408120546001600160a01b0316806103645760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b6044820152606401610498565b60006001600160a01b0382166109385760405162461bcd60e51b815260206004820152602960248201527f4552433732313a2061646472657373207a65726f206973206e6f7420612076616044820152683634b21037bbb732b960b91b6064820152608401610498565b506001600160a01b031660009081526003602052604090205490565b61095c610eda565b6109666000610f4e565b565b60606001805461037990611cf6565b6107ae338383610fa0565b61098c3383610cb4565b6109a85760405162461bcd60e51b815260040161049890611c39565b6109b48484848461106f565b50505050565b6060600d805480602002602001604051908101604052809291908181526020016000905b82821015610acc5783829060005260206000209060020201604051806060016040529081600082018054610a1190611cf6565b80601f0160208091040260200160405190810160405280929190818152602001828054610a3d90611cf6565b8015610a8a5780601f10610a5f57610100808354040283529160200191610a8a565b820191906000526020600020905b815481529060010190602001808311610a6d57829003601f168201915b50505091835250506001918201546001600160801b03808216602080850191909152600160801b909204166040909201919091529183529290920191016109de565b50505050905090565b6060610ae082610be7565b6000610af760408051602081019091526000815290565b90506000815111610b175760405180602001604052806000815250610b42565b80610b21846110a2565b604051602001610b32929190611aa7565b6040516020818303038152906040525b9392505050565b610b51610eda565b6001600160a01b038116610bb65760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610498565b610bbf81610f4e565b50565b60006001600160e01b0319821663780e9d6360e01b14806103645750610364826111bc565b6000818152600260205260409020546001600160a01b0316610bbf5760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b6044820152606401610498565b600081815260046020526040902080546001600160a01b0319166001600160a01b0384169081179091558190610c7b8261086e565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b600080610cc08361086e565b9050806001600160a01b0316846001600160a01b03161480610d0757506001600160a01b0380821660009081526005602090815260408083209388168352929052205460ff165b80610d2b5750836001600160a01b0316610d20846103fc565b6001600160a01b0316145b949350505050565b826001600160a01b0316610d468261086e565b6001600160a01b031614610daa5760405162461bcd60e51b815260206004820152602560248201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060448201526437bbb732b960d91b6064820152608401610498565b6001600160a01b038216610e0c5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610498565b610e1783838361120c565b610e22600082610c46565b6001600160a01b0383166000908152600360205260408120805460019290610e4b908490611cb3565b90915550506001600160a01b0382166000908152600360205260408120805460019290610e79908490611c87565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b600a546001600160a01b031633146109665760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610498565b6107ae828260405180602001604052806000815250611217565b600a80546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b816001600160a01b0316836001600160a01b031614156110025760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610498565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b61107a848484610d33565b6110868484848461124a565b6109b45760405162461bcd60e51b815260040161049890611be7565b6060816110c65750506040805180820190915260018152600360fc1b602082015290565b8160005b81156110f057806110da81611d31565b91506110e99050600a83611c9f565b91506110ca565b60008167ffffffffffffffff81111561111957634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015611143576020820181803683370190505b5090505b8415610d2b57611158600183611cb3565b9150611165600a86611d4c565b611170906030611c87565b60f81b81838151811061119357634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a9053506111b5600a86611c9f565b9450611147565b60006001600160e01b031982166380ac58cd60e01b14806111ed57506001600160e01b03198216635b5e139f60e01b145b8061036457506301ffc9a760e01b6001600160e01b0319831614610364565b610539838383611357565b611221838361140f565b61122e600084848461124a565b6105395760405162461bcd60e51b815260040161049890611be7565b60006001600160a01b0384163b1561134c57604051630a85bd0160e11b81526001600160a01b0385169063150b7a029061128e903390899088908890600401611ad6565b602060405180830381600087803b1580156112a857600080fd5b505af19250505080156112d8575060408051601f3d908101601f191682019092526112d5918101906119d8565b60015b611332573d808015611306576040519150601f19603f3d011682016040523d82523d6000602084013e61130b565b606091505b50805161132a5760405162461bcd60e51b815260040161049890611be7565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610d2b565b506001949350505050565b6001600160a01b0383166113b2576113ad81600880546000838152600960205260408120829055600182018355919091527ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee30155565b6113d5565b816001600160a01b0316836001600160a01b0316146113d5576113d5838261155d565b6001600160a01b0382166113ec57610539816115fa565b826001600160a01b0316826001600160a01b0316146105395761053982826116d3565b6001600160a01b0382166114655760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610498565b6000818152600260205260409020546001600160a01b0316156114ca5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610498565b6114d66000838361120c565b6001600160a01b03821660009081526003602052604081208054600192906114ff908490611c87565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b6000600161156a846108ce565b6115749190611cb3565b6000838152600760205260409020549091508082146115c7576001600160a01b03841660009081526006602090815260408083208584528252808320548484528184208190558352600790915290208190555b5060009182526007602090815260408084208490556001600160a01b039094168352600681528383209183525290812055565b60085460009061160c90600190611cb3565b6000838152600960205260408120546008805493945090928490811061164257634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050806008838154811061167157634e487b7160e01b600052603260045260246000fd5b60009182526020808320909101929092558281526009909152604080822084905585825281205560088054806116b757634e487b7160e01b600052603160045260246000fd5b6001900381819060005260206000200160009055905550505050565b60006116de836108ce565b6001600160a01b039093166000908152600660209081526040808320868452825280832085905593825260079052919091209190915550565b82805461172390611cf6565b90600052602060002090601f016020900481019282611745576000855561178b565b82601f1061175e57805160ff191683800117855561178b565b8280016001018555821561178b579182015b8281111561178b578251825591602001919060010190611770565b5061179792915061179b565b5090565b5b80821115611797576000815560010161179c565b600067ffffffffffffffff808411156117cb576117cb611d8c565b604051601f8501601f19908116603f011681019082821181831017156117f3576117f3611d8c565b8160405280935085815286868601111561180c57600080fd5b858560208301376000602087830101525050509392505050565b80356001600160a01b038116811461183d57600080fd5b919050565b80356001600160801b038116811461183d57600080fd5b60006020828403121561186a578081fd5b610b4282611826565b60008060408385031215611885578081fd5b61188e83611826565b915061189c60208401611826565b90509250929050565b6000806000606084860312156118b9578081fd5b6118c284611826565b92506118d060208501611826565b9150604084013590509250925092565b600080600080608085870312156118f5578081fd5b6118fe85611826565b935061190c60208601611826565b925060408501359150606085013567ffffffffffffffff81111561192e578182fd5b8501601f8101871361193e578182fd5b61194d878235602084016117b0565b91505092959194509250565b6000806040838503121561196b578182fd5b61197483611826565b915060208301358015158114611988578182fd5b809150509250929050565b600080604083850312156119a5578182fd5b6119ae83611826565b946020939093013593505050565b6000602082840312156119cd578081fd5b8135610b4281611da2565b6000602082840312156119e9578081fd5b8151610b4281611da2565b600080600060608486031215611a08578283fd5b833567ffffffffffffffff811115611a1e578384fd5b8401601f81018613611a2e578384fd5b611a3d868235602084016117b0565b935050611a4c60208501611842565b9150611a5a60408501611842565b90509250925092565b600060208284031215611a74578081fd5b5035919050565b60008151808452611a93816020860160208601611cca565b601f01601f19169290920160200192915050565b60008351611ab9818460208801611cca565b835190830190611acd818360208801611cca565b01949350505050565b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090611b0990830184611a7b565b9695505050505050565b60006020808301818452808551808352604092508286019150828160051b870101848801865b83811015611b9357603f19898403018552815160608151818652611b5f82870182611a7b565b838b01516001600160801b03908116888d0152938a0151909316958901959095525094870194925090860190600101611b39565b509098975050505050505050565b602081526000610b426020830184611a7b565b606081526000611bc76060830186611a7b565b6001600160801b0394851660208401529290931660409091015292915050565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6020808252602e908201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560408201526d1c881b9bdc88185c1c1c9bdd995960921b606082015260800190565b60008219821115611c9a57611c9a611d60565b500190565b600082611cae57611cae611d76565b500490565b600082821015611cc557611cc5611d60565b500390565b60005b83811015611ce5578181015183820152602001611ccd565b838111156109b45750506000910152565b600181811c90821680611d0a57607f821691505b60208210811415611d2b57634e487b7160e01b600052602260045260246000fd5b50919050565b6000600019821415611d4557611d45611d60565b5060010190565b600082611d5b57611d5b611d76565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160e01b031981168114610bbf57600080fdfea26469706673582212205b612f2e075ccc4a7dafe3d6991ae7fb87b4219a309e958e56fe5894ba66e43864736f6c63430008040033"
    const factory = new ethers.ContractFactory(abi, ContractByteCode, signer) //para deploy, eh necessario a abi, o bytecode e a assinatura da metamask conectada
    const contrato = await factory.deploy(); //executa a funcao de deploy de fato
    const dados_deploy = await contrato.deployTransaction.wait();
    console.log(`Contrato deployado com sucesso da blockchain, segue o endereco do contrato: ${dados_deploy.contractAddress}`)
    deployedContract = await dados_deploy.contractAddress
    contractObject = await new ethers.Contract(deployedContract, abi, provider)

    localStorage.setItem("contract_address", await deployedContract)
    localStorage.setItem("name", await contractObject.name())
    localStorage.setItem("symbol", await contractObject.symbol())
    localStorage.setItem("balanceOf", await contractObject.balanceOf(wallet))
    localStorage.setItem("lerHistoricoCarteirinha", await contractObject.lerHistoricoCarteirinha())

    setDeployedContract(await deployedContract)
    setContractObject(await contractObject) // Agora ContractObject eh um objeto que interage com as funcoes do contrato. pra chamar a funcao de nome por exemplo basta usar contractObject.name()
  }

  // Executa a funcao de saldo para saber quantas CNFT tem na carteira
  async function getSaldoNft() {
    //contractObject = new ethers.Contract(localStorage.getItem("contract_address"), abi, provider)
    setBalanceOf(await contractObject.balanceOf(wallet))
  }

  async function mintNft() {}
  /*
  // Minta o NFT a uma carteira, ou seja, define um dono ao NFT.
  async function mintNft() {

    // pega a carteira que tera o token mintado digitada no formulario e armazena na variavel wallet
    const wallet = document.querySelector("#input_set_owner_wallet").value

    const carteirinhaNFTcontract = new ethers.Contract(hash_contrato_deployado, abi, provider); // define carteirinhaNFTcontract como um objeto que interage com as funcoes do contrato CarteirinhaNFT.sol
    
    if (wallet === "") {
      set_owner_wallet = document.querySelector("#set_owner_wallet")
      set_owner_wallet.textContent = "Preencha o campo com alguma carteira para realizar o mint!";
    } else {
      const transacao = await carteirinhaNFTcontract.connect(signer).safeMint(wallet) //executa a funcao de mint do contrato. Para funcoes que mudam o estado da blockchain, eh necessario uma assinatura confirmacao (signer)
      await transacao.wait()
      saldo_nft = await carteirinhaNFTcontract.balanceOf(wallet) // verifica se apos a mintagem, acrescentou 1 CNFT a carteira solicitada
      set_owner_wallet = document.querySelector("#set_owner_wallet") 
      set_owner_wallet.textContent = `A carteira ${wallet} agora possui ${saldo_nft} CNFT. Para ver na metamask, adicione o token ${hash_contrato_deployado}`;
      document.querySelector("#input_transfer_from_sender").value = wallet
    }
  }
  */

  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  async function getNome() {
    setNome(await contractObject.name())
  }

  return (
    <div className="App">
      <button onClick={connectMetamask}>
      {wallet ? "Conectado: " + String(wallet) : "Conectar"}
      </button>
      <br></br>
      <br></br>

      <button onClick={getSaldo}>Saldo Matic</button>
      <p>{String(balance)}</p>
      <br></br>

      <button onClick={deployContract}>Deployar Contrato</button>
      <div>{deployedContract ? `Sucesso! link do comprovante: https://polygonscan.com/address/${deployedContract}` : `Clique no botao acima para fazer o deploy do contrato direto na blockchain...`}</div>
      <br></br>

      <button onClick={getSaldoNft}>Saldo CNFT</button>
      <p>{String(balanceOf)}</p>
      <br></br>

      <input type="text" placeholder="Digite a carteira para o mint..."></input>
      <br></br>
      <button onClick={mintNft}>Mint CNFT</button>

      <br></br>
      <br></br>
      <button onClick={getNome}>Nome do Token</button>
      <p>{nome}</p>
    </div>
  );
  
}

export default CallContract;
