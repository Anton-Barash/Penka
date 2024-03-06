import "./App.css";
import BinanceData from "./modul/BinanceData";
import "./locales/i18n";
import RootLayout from "./RootLayout";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BinanceData></BinanceData>
        <RootLayout></RootLayout>
      </header>
    </div>
  );
}

export default App;
