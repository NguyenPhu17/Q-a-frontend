// components/forum/CommentForm.jsx
import React, { useState } from 'react';

export default function CommentForm({ onSubmit }) {
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        onSubmit(content);
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring"
                rows="3"
                placeholder="Nhập bình luận..."
            />
            <button
                type="submit"
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
                Gửi bình luận
            </button>
        </form>
    );
}
