import './header.css'
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className='heading'>
            <nav>
                <div className="logo">Voting Platform</div>
                <ul className="nav-links">
                    <li><Link to="/results">Results</Link></li>
                    <li><Link to="/candidates">Candidates</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;