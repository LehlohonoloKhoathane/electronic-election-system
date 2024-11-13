// import logo from './logo.svg';
import './App.css';
import Header from './components/header/header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Results from './components/results/results';
import Candidates from './components/candidates/candidates';
import Footer from './components/footer/footer';
import Register from './components/register/register';
import Login from './components/login/login';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        {/* <header className="App-header"> */}
        <main>
          <Routes>
            <Route path="/results" element={<Results />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Footer />
        {/* </header> */}
      </div>
    </Router>
  );
}

export default App;
