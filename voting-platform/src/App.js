// import logo from './logo.svg';
import './App.css';
import Header from './components/header/header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Results from './components/results';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
        <Header />
        <main>
          <Routes>
            <Route path="/results" element={<Results />} />
          </Routes>
        </main>
          <p>
            King Khoathan
          </p>
        </header>
      </div>
    </Router>
  );
}

export default App;
