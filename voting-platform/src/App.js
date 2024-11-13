// import logo from './logo.svg';
import './App.css';
import Header from './components/header/header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Results from './components/results/results';
import Candidates from './components/candidates/candidates';
import Footer from './components/footer/footer';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
        <Header />
        <main>
          <Routes>
            <Route path="/results" element={<Results />} />
            <Route path="/candidates" element={<Candidates />} />
          </Routes>
        </main>
        <Footer />
        </header>
      </div>
    </Router>
  );
}

export default App;
