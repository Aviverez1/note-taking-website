import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import '../../styles/Auth.css';

function CategoryManager() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
            setCategories(snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
        });
        return () => unsubscribe();
    }, []);

    const addCategory = async (e) => {
        e.preventDefault();
        if (newCategory.trim() === '') return;
        await addDoc(collection(db, 'categories'), { name: newCategory.trim() });
        setNewCategory('');
    };

    const deleteCategory = async (id) => {
        await deleteDoc(doc(db, 'categories', id));
    };

    return (
        <div className="category-manager">
            <h2>Manage Categories</h2>
            <form onSubmit={addCategory} className="category-form">
                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name"
                />
                <button type="submit">Add Category</button>
            </form>
            <ul className="category-list">
                {categories.map(category => (
                    <li key={category.id} className="category-item">
                        {category.name}
                        <button onClick={() => deleteCategory(category.id)} className="delete-category">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CategoryManager;