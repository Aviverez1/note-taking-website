import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import '../../styles/Notes.css';

function NoteList() {
    const [notes, setNotes] = useState([]);
    const [categories, setCategories] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribeNotes = onSnapshot(collection(db, 'notes'), (snapshot) => {
            const notesList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNotes(notesList);
        });

        const unsubscribeCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
            const categoriesObj = {};
            snapshot.docs.forEach(doc => {
                categoriesObj[doc.id] = doc.data().name;
            });
            setCategories(categoriesObj);
        });

        return () => {
            unsubscribeNotes();
            unsubscribeCategories();
        };
    }, []);

    const filteredNotes = selectedCategory
        ? notes.filter(note => note.category === selectedCategory)
        : notes;

    const handleDeleteNote = async (e, noteId) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                await deleteDoc(doc(db, 'notes', noteId));
            } catch (error) {
                console.error("Error deleting note: ", error);
            }
        }
    };

    return (
        <div>
            <div className="notes-header">
                <h2 className="notes-title">Collaborative Notes</h2>
                <div className="category-filter">
                    <label htmlFor="category-filter">Filter by category: </label>
                    <select
                        id="category-filter"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {Object.entries(categories).map(([id, name]) => (
                            <option key={id} value={id}>{name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="notes-container">
                <div className="note-card create-note-card" onClick={() => navigate('/note/new')}>
                    +
                </div>
                {filteredNotes.map(note => (
                    <div key={note.id} className="note-card" onClick={() => navigate(`/note/${note.id}`)}>
                        <div className="note-title">{note.title}</div>
                        <div className="note-content">{note.content}</div>
                        <div className="note-footer">
                            <span className="note-category">{categories[note.category] || 'Uncategorized'}</span>
                            <span>Edited by: {note.lastEditedBy}</span>
                        </div>
                        <button className="delete-note" onClick={(e) => handleDeleteNote(e, note.id)}>×</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NoteList;