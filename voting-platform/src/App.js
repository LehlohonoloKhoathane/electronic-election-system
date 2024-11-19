import './App.css';
import Header from './components/header/header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Results from './components/results/results';
import Candidates from './components/candidates/candidates';
import Footer from './components/footer/footer';
import Register from './components/register/register';
import Login from './components/login/login';
import Profile from './components/profile/profile';
import Home from './components/home/home'; // Import Home component
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddCandidates from './components/addCandidates/addCandidates';
import AddElectionType from './components/addElectionTypes/addElectionTypes';
import ForgotPassword from './components/forgotPassword/forgotPassword';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} /> {/* Home as the landing page */}
            <Route path="/results" element={<Results />} />
            <Route path="/addElectionType" element={<AddElectionType />} />
            <Route path="/addCandidates" element={<AddCandidates />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <ToastContainer />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
