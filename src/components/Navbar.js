import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import '../styles/Auth.css';

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/notes" className="navbar-brand">NoteApp</Link>
                <div className="navbar-links">
                    <Link to="/notes">Notes</Link>
                    <Link to="/categories">Categories</Link>
                    <a href="#" onClick={handleLogout}>Logout</a>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;