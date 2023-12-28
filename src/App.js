
import './App.css';
import BinanceData from './modul/BinanceData';

const axios = require('axios');

function App() {




  return (
    <div className="App">
      <header className="App-header">
        <BinanceData></BinanceData>


      </header>
    </div>
  );
}

export default App;
