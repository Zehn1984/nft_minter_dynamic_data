import { useState } from 'react';

function Contador() {
  const [contador, setContador] = useState(1)

  function adicionarContador() {
    setContador(contador + 1)
  }
  return (
    <div className="App">
      <div>{contador}</div>
      <button onClick={adicionarContador}>Adicionar</button>
    </div>
  );
}

export default Contador;
