import { useState } from 'react';
import { ethers } from "ethers";

// Criando funcao principal que sera chamada pelo react no index.js para interagir com contrato
const CallContract = () => {

  // Declarando variaveis globais constante obrigatorias utilizando o ethersjs para acessar as funcoes posteriormente
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const abi = require("../../abiByteCode/abi.json")

  // Criando useState() react para retornar na tela a informacao coletada da blockchain
  let [nome, setNome] = useState("")
  let [signer, setSigner] = useState(provider.getSigner())
  let [wallet, setWallet] = useState(localStorage.getItem("wallet"))
  let [balance, setBalance] = useState("")
  let [deployedContract, setDeployedContract] = useState(false)
  let [contractObject, setContractObject] = useState(new ethers.Contract(localStorage.getItem("contract_address"), abi, provider)) // ja comecamos com o ultimo contrato deployado na memoria
  let [balanceOf, setBalanceOf] = useState("")
  let [textInput, setTextInput] = useState(wallet)

  // Conectar Carteira Metamask
  const connectMetamask = async () => {    
    // Requisitando permissao ao usuario para conexao da metamask junto ao script e contrato
    provider.send("eth_requestAccounts", []);
    signer = provider.getSigner(); // requisicao de assinatura para conectar na metamask, caso nao esteja conectado
    localStorage.setItem("wallet", await signer.getAddress()) // captura a wallet em um DB local
    setSigner(await signer) // atualiza estado do signer para conectado, assim podemos chamar as outras funcoes que exige assinatura
    setWallet(await signer.getAddress()) // Pega o endereco da carteira conectada
  }

  // Pegar saldo matic
  const getSaldo = async () =>  {
    const balance_wei = await signer.getBalance()
    balance = await ethers.utils.formatEther(balance_wei) // converte de wei pra ether (divide por 1e18)
    localStorage.setItem("balance", await balance)
    setBalance(await balance)
  }
  
  // Minta carteirinha e guarda hash do endereco em uma variavel
  const deployContract = async () =>  {
    // copiando e colando bytecode da polygonscan (necessario apenas para fazer deploy) - o bytecode eh o codigo fonte do contrato transformado em linguagem de maquina, que eh a linguagem que o EVM executa
    const ContractByteCode = require("../../abiByteCode/byteCode.json")
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
  const getSaldoNft = async () =>  {
    setBalanceOf(await contractObject.balanceOf(wallet))
  }

  const mintNft = async (props) => {
    const transaction = await contractObject.connect(signer).safeMint(textInput) //executa a funcao de mint do contrato. Para funcoes que mudam o estado da blockchain, eh necessario uma assinatura confirmacao (signer)
    await transaction.wait()
    //saldo_nft = await contractObject.balanceOf(textInput) // verifica se apos a mintagem, acrescentou 1 CNFT a carteira solicitada
  }

  const userInput = (props) => {
    setTextInput(props.target.value)
  }
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

      <input type="text" placeholder="Digite a carteira para o mint..." value={textInput} onChange={userInput}></input>
      <br></br>
      <button onClick={mintNft}>Mint CNFT</button>

      <br></br>
      <br></br>
      <button onClick={getNome}>Nome do Token</button>
      <p>{nome}</p>
    </div>
  );  
}

export default CallContract