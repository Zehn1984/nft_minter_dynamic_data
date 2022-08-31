import axios from 'axios';
import { useEffect, useState } from 'react';

async function getBalance(address){
  return axios.get('https://api.polygonscan.com/api',
  {
    params: {
      module: 'account',
      action:'balance',
      address: address,
      apikey: 'E39BMRTCT3ECSQ6WFPHW9ANVGU2QZ1QFAK'
    }
  })
}

function ReactAxios() {
  const [balance , setbalance] = useState(0)

  useEffect(() => {
    async function fetchData(){
      const val = await getBalance('0x9f35A48f96086891aF2Aa633789888268488e4D2')
      console.log(val.data)
      setbalance(val.data)
    }
  fetchData()
  },[]  )

  return (
    <div>
      <h1>{balance.result}</h1><br/>
    </div>
  );
}

export default ReactAxios;