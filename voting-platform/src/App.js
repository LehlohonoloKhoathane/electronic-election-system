import React from 'react';  // Ensure React is imported
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
import AdminPage from './components/adminPage/adminPage';
import ManageDatabase from './components/manageDatabase/manageDatabase';
import ElectionTypeSelector from './components/electionTypeSelector/electionTypeSelector';
import UserPage from './components/userPage/userPage';
import Loader from './components/loader/loader';  // Import the Loader component

function App() {
  // State to manage loading state
  const [loading, setLoading] = React.useState(true);

  // Simulate loading for demo purposes (e.g., after data fetch or initial load)
  React.useEffect(() => {
    setTimeout(() => setLoading(false), 3000); // Simulate a 3-second loading time
  }, []);

  return (
    <Router>
      <div className="App">
        {loading ? (
          // Only show the loader while loading
          <Loader loading={loading} />
        ) : (
          <>
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} /> {/* Home as the landing page */}
                <Route path="/results" element={<Results />} />
                <Route path="/addElectionType" element={<AddElectionType />} />
                <Route path="/addCandidates" element={<AddCandidates />} />
                <Route path="/adminPage" element={<AdminPage />} />
                <Route path="/candidates" element={<Candidates />} />
                <Route path="/register" element={<Register />} />
                <Route path="/userPage" element={<UserPage />} />
                <Route path="/electionTypeSelector" element={<ElectionTypeSelector />} />
                <Route path="/manageDatabase" element={<ManageDatabase />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgotPassword" element={<ForgotPassword />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
              <ToastContainer />
            </main>
            <footer className="footerApp">
              <Footer />
            </footer>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
