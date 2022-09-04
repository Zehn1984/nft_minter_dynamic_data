import './App.css';
import Minter from './pages/minter';
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <main>
        <Routes> 
          
          <Route path="/" element={<Minter />} /> 
        </Routes>        
      </main>
    </div>
  );
}

export default App;
