import React from 'react';

export default function CommentItem({ comment }) {
    return (
        <div className="p-4 bg-gray-50 border rounded">
            <p className="text-gray-800 whitespace-pre-line">{comment.content}</p>
            <p className="text-sm text-gray-500 mt-1">
                {comment.name || 'Ẩn danh'} • {new Date(comment.createdAt).toLocaleString()}
            </p>
        </div>
    );
}
