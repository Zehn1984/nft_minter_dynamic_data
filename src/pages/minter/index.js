import { useState } from 'react';
import { ethers } from "ethers";

// Criando funcao principal que sera chamada pelo react no index.js para interagir com contrato
const Minter = () => {

  if (!localStorage.getItem("first_load")) {
    localStorage.setItem("first_load", true)
    localStorage.setItem("contract_address", "")
    localStorage.setItem("balanceOf", "")
    localStorage.setItem("wallet", "")    
  }

  window.onload = function() {
    if(!window.location.hash) {
      window.location = window.location + '#loaded';
      setTimeout(() => {window.location.reload()}, 1500)
    }
  }

  // Declarando variaveis globais constante obrigatorias utilizando o ethersjs para acessar as funcoes posteriormente
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const abi = require("../../abiByteCode/abi.json")

  // Criando useState() react para retornar na tela a informacao coletada da blockchain
  let [signer, setSigner] = useState(provider.getSigner())
  let [wallet, setWallet] = useState(localStorage.getItem("wallet"))
  let [saldoInicial, setSaldoInicial] = useState(false)
  let [balance, setBalance] = useState("")
  let [deployedContract, setDeployedContract] = useState(localStorage.getItem("contract_address") ? localStorage.getItem("contract_address") : "")
  let [contractObject, setContractObject] = useState(localStorage.getItem("contract_address") ? new ethers.Contract(localStorage.getItem("contract_address"), abi, provider) : "") // ja comecamos com o ultimo contrato deployado na memoria  
  let [balanceOf, setBalanceOf] = useState("")
  let [mintInput, setMintInput] = useState(wallet)
  let [conquistaInput, setConquistaInput] = useState("")
  let [conquistaAdicionada, setConquistaAdicionada] = useState("")
  let [historico, setHistorico] = useState("")
  let [gastoTaxas, setGastoTaxas] = useState(0)
  let [firstTimePressed, setFirstTimePressed] = useState(false)
  let [txHashDeploy, setTxHashDeploy] = useState("")
  
  // Conectar Carteira Metamask
  const connectMetamask = async () => {    
        // Requisitando permissao ao usuario para conexao da metamask junto ao script e contrato    
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner(); // requisicao de assinatura para conectar na metamask, caso nao esteja conectado
    setSigner(await signer) // atualiza estado do signer para conectado, assim podemos chamar as outras funcoes que exige assinatura
    setWallet(await signer.getAddress()) // Pega o endereco da carteira conectada
    getSaldo()
    localStorage.setItem("wallet", await signer.getAddress()) // captura a wallet em um DB local
  }

  // Executa a funcao de saldo para saber quantos Matic e CNFT tem na carteira
  const getSaldo = async () =>  {
    const balance_wei = await signer.getBalance()
    balance = await ethers.utils.formatEther(balance_wei) // converte de wei pra ether (divide por 1e18)
    localStorage.setItem("balance", await balance)
    setBalance(await balance)
    if (!firstTimePressed) {
      saldoInicial = await ethers.utils.formatEther(balance_wei)
      setSaldoInicial(await saldoInicial)
      console.log(`Saldo inicial: R$ ${((await saldoInicial) * 0.90 * 5).toFixed(2)}`)      
    }    
    if (localStorage.getItem("contract_address") !== "") {
      setBalanceOf(await contractObject.balanceOf(wallet))
    }
    let taxas = parseFloat(await saldoInicial) - parseFloat(await balance)
    setGastoTaxas(await taxas)
    setFirstTimePressed(true)
  }
  
  // Minta carteirinha e guarda hash do endereco em uma variavel
  const deployContract = async () =>  {
    if (wallet === "") {alert("Primeiro conecte sua carteira!")} else {
      // copiando e colando bytecode da polygonscan (necessario apenas para fazer deploy) - o bytecode eh o codigo fonte do contrato transformado em linguagem de maquina, que eh a linguagem que o EVM executa
      const ContractByteCode = require("../../abiByteCode/byteCode.json")
      const factory = new ethers.ContractFactory(abi, ContractByteCode, signer) //para deploy, eh necessario a abi, o bytecode e a assinatura da metamask conectada
      const contrato = await factory.deploy(); //executa a funcao de deploy de fato
      const dados_deploy = await contrato.deployTransaction.wait();
      console.log(`Contrato deployado com sucesso da blockchain! Endereco do contrato: ${dados_deploy.contractAddress} e o txhash da transacao: ${dados_deploy.hash}`)
      deployedContract = await dados_deploy.contractAddress
      contractObject = await new ethers.Contract(deployedContract, abi, provider)

      localStorage.setItem("contract_address", await deployedContract)
      localStorage.setItem("balanceOf", await contractObject.balanceOf(wallet))
      //localStorage.setItem("lerHistoricoCarteirinha", await contractObject.lerHistoricoCarteirinha())

      setDeployedContract(await deployedContract)
      setContractObject(await contractObject) // Agora ContractObject eh um objeto que interage com as funcoes do contrato. pra chamar a funcao de nome por exemplo basta usar contractObject.name()
      setMintInput(wallet)
      setTxHashDeploy(await dados_deploy.transactionHash)
      alert(`Contrato ${deployedContract} deployado com sucesso!`)
      getSaldo()
    }
  }

  // Minta o NFT a uma carteira, ou seja, define um dono ao NFT.
  const mintNft = async () => {
    if (deployedContract === "") {alert("Primeiro faca o deploy do contrato!")} else {
      const transaction = await contractObject.connect(signer).safeMint(mintInput) //executa a funcao de mint do contrato. Para funcoes que mudam o estado da blockchain, eh necessario uma assinatura confirmacao (signer)
      await transaction.wait()
      getSaldo()
    }
  }

  const aoDigitarMint = (props) => {
    setMintInput(props.target.value)
  }

  const adicionarConquista = async () => {
    if (deployedContract === "") {alert("Primeiro faca o deploy do contrato!")} else {
      const data = parseInt(`${new Date().getDate()}${new Date().getMonth()}${new Date().getFullYear()}`) // captura a data do momento para adicionar junto a blockchain nos parametros da funcao adicionarConquista
      const transaction = await contractObject.connect(signer).adicionarConquistaHistorico(conquistaInput.toString(), data, 0)
      await transaction.wait()
      console.log(await transaction.hash)
      alert("Conquista adicionada com sucesso!")
      setConquistaAdicionada(await transaction.hash)
      getSaldo()
    }
  }

  const aoDigitarConquista = (props) => {
    setConquistaInput(props.target.value)
  }

  // Ler historico da carteirinha
  async function getHistorico() {
    if (deployedContract === "") {
      alert("Primeiro faca o deploy do contrato!")
    } 
    else if (conquistaAdicionada === "") {
      alert("Primeiro adicione uma conquista!")
    }
    else {
      setHistorico(await contractObject.consultarHistorico())
    }
  }

  return (
    <div className="App">
            
      <div className="div_carteirinha" >
        <h2>Gerador Carteirinha NFT</h2>
        
        <div className="div_carteirinha_mint" > 
          <button onClick={connectMetamask}>
          {wallet ? "Conectado: " + String(wallet): "Conectar"}
          </button>
          
          <p>{"Matic: " + String(balance) + " | R$ " + parseFloat(balance * 0.90 * 5).toFixed(2)}</p>
          <br/>Quantidade CNFT:
          <h1>{String(balanceOf)}</h1>
        </div>  
        
        <br></br>

          <button onClick={deployContract}>Deployar Contrato</button>
          <br></br>
          <p>Ultimo contrato deployado: </p><a href={"https://polygonscan.com/address/" + String(deployedContract)} target="_blank">{deployedContract ? "Ultimo contrato deployado: " + String(deployedContract) : ""}</a>
          <br></br>
          <p>Comprovante: </p> <a href={"https://polygonscan.com/tx/" + String(txHashDeploy)} target="_blank">{txHashDeploy ? "Comprovante (TxHash): " + String(txHashDeploy) : ""}</a>
          <br></br>
          <p>Carteira Destino Mint: </p>
          <input className="input_contrato" type="text" placeholder="Digite a carteira para o mint..." value={mintInput} onChange={aoDigitarMint}></input>
          <br></br>
          <br></br>
          <button onClick={mintNft}>Mint CNFT</button>
          <br></br>
          <br></br>

          <div className="div_carteirinha_mint" >
          <br></br>            
            <input type="text" placeholder="Digite a conquista..." value={conquistaInput} onChange={aoDigitarConquista}></input>
            <br></br>
            <button onClick={adicionarConquista}>Adicionar Conquista</button>
            <br></br>
            <a href={"https://polygonscan.com/tx/" + String(conquistaAdicionada)} target="_blank">{conquistaAdicionada ? "Comprovante (TxHash): " + String(conquistaAdicionada) : ""}</a>
            <br></br>
            <br></br>

            <button onClick={getHistorico}>Ver historico de conquistas</button><br/>
            <p>{String(historico)}</p>
            <br></br>
          </div>
          <p>Custo Total: </p>
          <h1>{gastoTaxas ? "R$ " + (gastoTaxas * 0.90 * 5).toFixed(2) : "R$ 0.00"}</h1>

      </div>
      
    </div>
  );  
}

export default Minter