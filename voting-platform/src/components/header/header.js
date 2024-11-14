import './header.css'
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className='heading'>
            <nav className='heading-navs'>
                <div className="logo">Voting Platform</div>
                <ul className="nav-links">
                    <li><Link to="/results">View Results</Link></li>
                    <li><Link to="/candidates">Candidates</Link></li>
                    <li><Link className='login' to="/login">Login</Link></li>
                    <li className='register'><Link to="/register">Register as voter</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;