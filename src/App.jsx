import "./App.css";
import BinanceData from "./modul/BinanceData";
import "./locales/i18n";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import RootLayout from "./RootLayout";

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
