import { useState } from 'react';
import { toast } from 'react-toastify';

export default function CommentItem({ comment, onEdit, onDelete, isOwner }) {
    const user = comment.User || {};
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);

    const getRelativeTime = (dateString) => {
        const now = new Date();
        const commentDate = new Date(dateString);
        const diff = (now - commentDate) / 1000;
        if (diff < 60) return 'Vừa xong';
        if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
        return `${Math.floor(diff / 86400)} ngày trước`;
    };

    const handleUpdate = () => {
        if (!isOwner) {
            toast.error('Bạn không có quyền sửa comment này');
            return;
        }
        onEdit(comment.id, editedContent);
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (!isOwner) {
            toast.error('Bạn không có quyền xóa comment này');
            return;
        }
        onDelete(comment.id);
    };

    return (
        <div className="flex items-start space-x-3 w-full">
            <img
                src={user.avt || '/default-avatar.png'}
                alt={user.name || 'Ẩn danh'}
                className="w-9 h-9 rounded-full object-cover"
            />
            <div className="flex-1">
                <div className="bg-gray-100 px-4 py-2 rounded-2xl inline-block w-auto max-w-[800px] break-words">
                    <div className="text-sm font-semibold text-gray-800 flex items-center space-x-1">
                        <span>{user.name || 'Ẩn danh'}</span>
                        {comment.isAuthor && (
                            <span className="flex items-center text-blue-500 text-xs font-medium ml-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6 3.536 3.536-6 6H9v-3.536z" />
                                </svg>
                                Tác giả
                            </span>
                        )}
                    </div>
                    <div className="text-sm text-gray-800 whitespace-pre-line break-all">
                        {isEditing ? (
                            <textarea
                                className="w-full p-1 text-sm rounded-md border mt-1"
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                            />
                        ) : (
                            comment.content
                        )}
                    </div>
                </div>

                <div className="text-xs text-gray-500 mt-1 ml-2 flex items-center space-x-3">
                    <span>{getRelativeTime(comment.created_at)}</span>

                    <span className="text-gray-400">·</span>
                    <button className="text-blue-500 hover:text-blue-700">Reply</button>

                    {isOwner && (
                        <>
                            <span className="text-gray-400">·</span>
                            {isEditing ? (
                                <>
                                    <button className="text-green-600 hover:text-green-800" onClick={handleUpdate}>
                                        Lưu
                                    </button>
                                    <button className="text-gray-600 hover:text-gray-800" onClick={() => setIsEditing(false)}>
                                        Hủy
                                    </button>
                                </>
                            ) : (
                                <button className="text-green-500 hover:text-green-700" onClick={() => setIsEditing(true)}>
                                    Sửa
                                </button>
                            )}

                            <span className="text-gray-400">·</span>
                            <button className="text-red-500 hover:text-red-700" onClick={handleDelete}>
                                Xóa
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
