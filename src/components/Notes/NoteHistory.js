import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import '../../styles/Notes.css';

function NoteHistory() {
    const [versions, setVersions] = useState([]);
    const [currentNote, setCurrentNote] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNoteHistory = async () => {
            const noteRef = doc(db, 'notes', id);
            const noteSnap = await getDoc(noteRef);
            if (noteSnap.exists()) {
                const noteData = noteSnap.data();
                setCurrentNote(noteData);
                setVersions(noteData.versions ? [...noteData.versions].reverse() : []);
            } else {
                console.log("No such document!");
                navigate('/notes');
            }
        };

        fetchNoteHistory();
    }, [id, navigate]);

    const revertToVersion = async (version, versionNumber) => {
        if (window.confirm(`Are you sure you want to revert to version ${versionNumber}?`)) {
            try {
                const noteRef = doc(db, 'notes', id);
                await updateDoc(noteRef, {
                    title: version.title,
                    content: version.content,
                    updatedAt: new Date()
                });
                navigate(`/note/${id}`);
            } catch (error) {
                console.error("Error reverting version:", error);
            }
        }
    };

    const isCurrentVersion = (version) => {
        return currentNote &&
            version.title === currentNote.title &&
            version.content === currentNote.content;
    };

    return (
        <div className="note-history">
            <h2>Version History</h2>
            {versions.map((version, index) => (
                <div key={index} className="version-item">
                    <h3>Version {versions.length - index}</h3>
                    <p>Title: {version.title}</p>
                    <p>Edited by: {version.editedBy}</p>
                    <p>Edited at: {version.editedAt instanceof Date ? version.editedAt.toLocaleString() : new Date(version.editedAt.seconds * 1000).toLocaleString()}</p>
                    <button
                        onClick={() => revertToVersion(version, versions.length - index)}
                        disabled={isCurrentVersion(version)}
                    >
                        {isCurrentVersion(version) ? 'Current Version' : 'Revert to this version'}
                    </button>
                </div>
            ))}
        </div>
    );
}

export default NoteHistory;