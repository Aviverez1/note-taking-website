import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, collection, addDoc, onSnapshot, serverTimestamp, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import '../../styles/Notes.css';

function NoteEditor() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            navigate('/');
            return;
        }

        const fetchCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
            setCategories(snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
        });

        if (id === 'new') return () => fetchCategories();

        const noteRef = doc(db, 'notes', id);
        const unsubscribeNote = onSnapshot(noteRef, (doc) => {
            if (doc.exists()) {
                const noteData = doc.data();
                setTitle(noteData.title);
                setContent(noteData.content);
                setCategory(noteData.category || '');
            } else {
                console.log("No such document!");
                navigate('/notes');
            }
        }, (error) => {
            console.error("Error fetching note:", error);
        });

        return () => {
            fetchCategories();
            if (id !== 'new') unsubscribeNote();
        };
    }, [id, navigate]);

    const handleChange = async (e) => {
        const { name, value } = e.target;
        const user = auth.currentUser;
        if (!user) return;

        if (name === 'title') setTitle(value);
        if (name === 'content') setContent(value);
        if (name === 'category') setCategory(value);

        if (id !== 'new') {
            try {
                const noteRef = doc(db, 'notes', id);
                await updateDoc(noteRef, {
                    [name]: value,
                    lastEditedBy: user.email,
                    updatedAt: serverTimestamp()
                });
            } catch (error) {
                console.error("Error updating note:", error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) {
            console.error("No user logged in");
            return;
        }
        const currentTime = new Date();
        const noteData = {
            title,
            content,
            category,
            lastEditedBy: user.email,
            updatedAt: serverTimestamp(),
        };

        try {
            if (id === 'new') {
                noteData.createdAt = serverTimestamp();
                noteData.createdBy = user.email;
                noteData.versions = [{
                    title,
                    content,
                    editedBy: user.email,
                    editedAt: currentTime
                }];
                await addDoc(collection(db, 'notes'), noteData);
            } else {
                const noteRef = doc(db, 'notes', id);
                const newVersion = {
                    title,
                    content,
                    editedBy: user.email,
                    editedAt: currentTime
                };
                await updateDoc(noteRef, {
                    ...noteData,
                    versions: arrayUnion(newVersion)
                });
            }
            navigate('/notes');
        } catch (error) {
            console.error("Error saving note:", error);
        }
    };

    return (
        <div className="note-editor">
            <h2>{id === 'new' ? 'Create New Note' : 'Edit Note'}</h2>
            <form onSubmit={handleSubmit} className="note-form">
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={title}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    <select
                        id="category"
                        name="category"
                        value={category}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        name="content"
                        value={content}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>
                <div className="note-actions">
                    <button type="submit" className="btn btn-primary">Save Note</button>
                    {id !== 'new' && (
                        <Link to={`/note/${id}/history`} className="btn btn-secondary">View History</Link>
                    )}
                </div>
            </form>
        </div>
    );
}

export default NoteEditor;