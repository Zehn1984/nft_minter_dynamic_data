import { useState } from 'react';
import { ethers } from "ethers";

// Criando funcao principal que sera chamada pelo react no index.js para interagir com contrato
const Minter = () => {

  // Caso seja um novo usuario, define um valor padrao para os localStorages para nao bugar o codigo com retornos nulos
  if (!localStorage.getItem("first_load")) {
    localStorage.setItem("first_load", true)
    localStorage.setItem("contract_address", "")
    localStorage.setItem("balanceOf", "")
    localStorage.setItem("txHashConquista", "")
    localStorage.setItem("txHashDeploy", "")
    localStorage.setItem("txHashMint", "")
    localStorage.setItem("wallet", "")
    localStorage.setItem("saldoInicial", 0)
  }

  // Devido a um tempo de delay (bug), entre setar o localStorage e carregar a metamask
  // Foi criado essa parte do codigo para dar refresh na pagina apos 1,5 segs, para conectar a metamask com o localstorage, ja setado
  window.onload = function() {
    if(!window.location.hash) {
      window.location = window.location + '#loaded';
      setTimeout(() => {window.location.reload()}, 1500)
    }
  }

  // Declarando variaveis globais constantes obrigatorias utilizando o ethersjs para acessar as funcoes posteriormente
  const provider = new ethers.providers.Web3Provider(window.ethereum) // Especifica que o provedor (walletApp) utilizado sera a Metamask
  const abi = require("../../abiByteCode/abi.json") // Carrega o codigo fonte do contrato solidity em formato Json

  // Criando useState() react para retornar na tela a informacao coletada da blockchain
  let [signer, setSigner] = useState(provider.getSigner())
  let [wallet, setWallet] = useState(localStorage.getItem("wallet"))
  let [balance, setBalance] = useState("")
  
  let [saldoInicial, setSaldoInicial] = useState(localStorage.getItem("saldoInicial"))
  let [gastoTaxas, setGastoTaxas] = useState(localStorage.getItem("gastoTaxas")) 

  let [mintInput, setMintInput] = useState(wallet)
  let [conquistaInput, setConquistaInput] = useState("")

  let [txHashConquista, settxHashConquista] = useState(localStorage.getItem("txHashConquista"))
  let [txHashDeploy, setTxHashDeploy] = useState(localStorage.getItem("txHashDeploy"))
  let [txHashMint, setTxHashMint] = useState(localStorage.getItem("txHashMint"))
  
  let [deployedContract, setDeployedContract] = useState(localStorage.getItem("contract_address"))
  let [contractObject, setContractObject] = useState(localStorage.getItem("contract_address") ? new ethers.Contract(localStorage.getItem("contract_address"), abi, provider) : "") // ja comecamos com o ultimo contrato deployado na memoria  
  let [balanceOf, setBalanceOf] = useState("")
  let [historico, setHistorico] = useState("")


  
  // Conectar Carteira Metamask
  const connectMetamask = async () => {    
        // Requisitando permissao ao usuario para conexao da metamask junto ao script e contrato    
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner(); // requisicao de assinatura para conectar na metamask, caso nao esteja conectado
    setSigner(await signer) // atualiza estado do signer para conectado, assim podemos chamar as outras funcoes que exige assinatura
    setWallet(await signer.getAddress()) // Pega o endereco da carteira conectada
    getSaldo()
    localStorage.setItem("wallet", await signer.getAddress()) // captura a wallet em um DB local (cookie/cache)
  }

  // Executa a funcao de saldo para saber quantos Matic e CNFT tem na carteira
  const getSaldo = async () =>  {
    const balance_wei = await signer.getBalance()
    balance = await ethers.utils.formatEther(balance_wei) // converte de wei pra ether (divide por 1e18)
    localStorage.setItem("balance", await balance)
    setBalance(await balance)
    // Se for a primeira vez que executa o getSaldo...
    if (deployedContract === "") {
      saldoInicial = await ethers.utils.formatEther(balance_wei)
      localStorage.setItem("saldoInicial", await saldoInicial)
      setSaldoInicial(await saldoInicial)
      console.log(`Saldo inicial: R$ ${((await saldoInicial) * 0.90 * 5).toFixed(2)}`)      
    }    
    if (localStorage.getItem("contract_address") !== "") {
      setBalanceOf(await contractObject.balanceOf(wallet))
    }
    let taxas = parseFloat(localStorage.getItem("saldoInicial") - parseFloat(await balance))
    setGastoTaxas(await taxas)
  }
  
  // Minta carteirinha e guarda hash do endereco em uma variavel
  const deployContract = async () =>  {
    if (wallet === "") {alert("Primeiro conecte sua carteira!")} else {
      // copiando e colando bytecode da polygonscan (necessario apenas para fazer deploy) - o bytecode eh o codigo fonte do contrato transformado em linguagem de maquina, que eh a linguagem que o EVM executa
      const ContractByteCode = require("../../abiByteCode/byteCode.json")
      const factory = new ethers.ContractFactory(abi, ContractByteCode, signer) //para deploy, eh necessario a abi, o bytecode e a assinatura da metamask conectada
      const contrato = await factory.deploy(); //executa a funcao de deploy de fato
      const dados_deploy = await contrato.deployTransaction.wait();
      console.log(`Contrato deployado com sucesso da blockchain! Endereco do contrato: ${dados_deploy.contractAddress} e o txhash da transacao: ${dados_deploy.transactionash}`)
      deployedContract = await dados_deploy.contractAddress
      contractObject = await new ethers.Contract(deployedContract, abi, provider)

      localStorage.setItem("contract_address", await deployedContract)
      localStorage.setItem("balanceOf", await contractObject.balanceOf(wallet))
      localStorage.setItem("txHashDeploy", await dados_deploy.transactionHash)

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
      localStorage.setItem("txHashMint", await transaction.hash)
      setTxHashMint(await transaction.hash)
      getSaldo()
    }
  }
  
  // Captura o que eh digitado no campo de texto do mint e joga para a variavel mintInput para usar no backend
  const aoDigitarMint = (props) => {
    setMintInput(props.target.value)
  }

  // Funcao que adiciona conquista, ou qualquer outra informacao, dentro da blockchain
  const adicionarConquista = async () => {
    if (deployedContract === "") {alert("Primeiro faca o deploy do contrato!")} else {
      const data = parseInt(`${new Date().getDate()}${new Date().getMonth()}${new Date().getFullYear()}`) // captura a data do momento para adicionar junto a blockchain nos parametros da funcao adicionarConquista
      const transaction = await contractObject.connect(signer).adicionarConquistaHistorico(conquistaInput.toString(), data, 0) // chama a funcao de fato, passa os parametros e salva em um objeto
      await transaction.wait()
      alert("Conquista adicionada com sucesso!")
      localStorage.setItem("txHashConquista", await transaction.hash)
      settxHashConquista(await transaction.hash)
      getSaldo()
    }
  }

  // Captura o que eh digitado no campo de texto de adicionar conquista para usar no backend
  const aoDigitarConquista = (props) => {
    setConquistaInput(props.target.value)
  }

  // Ler historico da carteirinha
  async function getHistorico() {
    if (deployedContract === "") {
      alert("Primeiro faca o deploy do contrato!")
    } 
    else if (txHashConquista === "") {
      alert("Primeiro adicione uma conquista!")
    }
    else {
      setHistorico(await contractObject.consultarHistorico())
    }
  }

  // Reseta o cache/cookies localStorage e da refresh na pagina
  const resetCache = () => {
    localStorage.clear()
    window.location.reload()
  }

  const dadosAdicionais = async () => {
    if (deployedContract !== "") {      
      const nomeToken = await contractObject.name()
      const symbol = await contractObject.symbol()
      const devWallet = await contractObject.owner()
      let donoToken = "FACA O MINT PARA DEFINIR O DONO"
      if (txHashMint !== "") {
        donoToken = await contractObject.ownerOf(0)
      }      
      alert(`Nome do token: ${nomeToken}.\nSimbolo: ${symbol}\nDevWallet: ${devWallet}\nDono: ${donoToken}`)
    } else {
      alert("Faca o deploy do contrato primeiro!")
    }
  }

  // Retorna o que vai aparecer no front end usando JSX (mistura de JS com HTML)
  // Basicamente, JSX vc escreve em HTML e quando precisa chamar alguma codigo em JS vc evoca os brackets {}
  return (
    <div className="App">
            
      <div className="div_carteirinha" >
        <h1>Gerador Carteirinha NFT</h1>
        
        <div className="div_carteirinha_mint" > 
          <button onClick={connectMetamask}>
          {balance ? "Conectado: " + String(wallet): "Conectar"}
          </button>          
          <p>{"Matic: " + String(balance) + " | R$ " + parseFloat(balance * 0.90 * 5).toFixed(2)}</p>
          <br/>Quantidade CNFT:
          <h1>{String(balanceOf)}</h1>
        </div>  
        
        <br></br>
        <button onClick={deployContract}>Deployar Contrato</button>
        <br></br>
        <p>Ultimo contrato deployado: </p> <a className="comprovantes" href={"https://polygonscan.com/address/" + String(deployedContract)} target="_blank">{deployedContract ? String(deployedContract) : ""}</a>
        <br></br>
        <p>Comprovante (txHash): </p> <a className="comprovantes" href={"https://polygonscan.com/tx/" + String(txHashDeploy)} target="_blank">{txHashDeploy ? String(txHashDeploy) : ""}</a>
        <br></br>
        <p>Carteira Destino Mint: </p>
        <input className="input_contrato" type="text" placeholder="Digite a carteira para o mint..." value={mintInput} onChange={aoDigitarMint}></input>
        <br></br>
        <br></br>
        <button onClick={mintNft}>Mint CNFT</button>
        <br></br>
        <p>Comprovante (txHash): </p> <a className="comprovantes" href={"https://polygonscan.com/tx/" + String(txHashMint)} target="_blank">{txHashMint ? String(txHashMint) : ""}</a>
        <br></br>
        <br></br>
      
        <br></br>            
        <input type="text" placeholder="              Digite a conquista..." value={conquistaInput} onChange={aoDigitarConquista}></input>
        <br></br>
        <br></br>
        <button onClick={adicionarConquista}>Adicionar Conquista</button>
        <br></br>
        <p>Comprovante (txHash): </p> <a className="comprovantes" href={"https://polygonscan.com/tx/" + String(txHashConquista)} target="_blank">{txHashConquista ? String(txHashConquista) : ""}</a>
        <br></br>
        <br></br>

        <button onClick={getHistorico}>Ver historico de conquistas</button><br/>
        <p>{String(historico)}</p>
        <br></br>

        <div className="div_carteirinha_mint" >          
          <p>Custo Acumulado: </p>
          <h1>{gastoTaxas ? "R$ " + (gastoTaxas * 0.90 * 5).toFixed(2) : ""}</h1>
          <br></br>

          <button onClick={dadosAdicionais}>Dados adicionais</button><br/>
          <br></br>
          
          <button onClick={resetCache}>Limpar cache</button><br/>
          <br></br>
        </div>

      </div>
      
    </div>
  );  
}

//exporta essa funcao gigante por padrao, para poder ser chamada como um componente react na pagina App.
export default Minter