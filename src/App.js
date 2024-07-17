import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import NoteList from './components/Notes/NoteList';
import NoteEditor from './components/Notes/NoteEditor';
import NoteHistory from './components/Notes/NoteHistory';
import CategoryManager from './components/Categories/CategoryManager';
import Navbar from './components/Navbar';
import './styles/Notes.css';
import './styles/Auth.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
      <Router>
        <div className="App">
          {user && <Navbar />}
          <Routes>
            <Route path="/" element={user ? <Navigate to="/notes" /> : <Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/notes" element={user ? <NoteList /> : <Navigate to="/" />} />
            <Route path="/note/:id" element={user ? <NoteEditor /> : <Navigate to="/" />} />
            <Route path="/note/:id/history" element={user ? <NoteHistory /> : <Navigate to="/" />} />
            <Route path="/categories" element={user ? <CategoryManager /> : <Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;