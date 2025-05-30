import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

export default function CommentSection({ postId, onCommentCountChange, onCommentAdded }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const errorToastShown = useRef(false);

    const user = React.useMemo(() => {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : {};
    }, []);

    const fetchComments = useCallback(async () => {
        try {
            const res = await fetch(`http://localhost:8000/api/comment/${postId}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });
            const data = await res.json();
            setComments(data.comments || []);
            onCommentCountChange && onCommentCountChange(data.comments?.length || 0);
        } catch (err) {
            if (!errorToastShown.current) {
                toast.error('Lỗi khi tải bình luận', { autoClose: 1000 });
                errorToastShown.current = true;
            }
        }
    }, [postId, onCommentCountChange]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const res = await fetch(`http://localhost:8000/api/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify({ post_id: postId, content: newComment }),
            });

            const result = await res.json();
            if (res.ok) {
                await fetchComments();
                setNewComment('');
                toast.success('Gửi bình luận thành công!', { autoClose: 1000 });
                onCommentAdded && onCommentAdded();
            } else {
                toast.error(result.message || 'Gửi bình luận thất bại', { autoClose: 1000 });
            }
        } catch (err) {
            toast.error('Lỗi gửi bình luận', { autoClose: 1000 });
        }
        setNewComment('');
    };

    const handleEditComment = async (id, newContent) => {
        try {
            const res = await fetch(`http://localhost:8000/api/comment/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify({ content: newContent }),
            });

            if (res.ok) {
                setComments(prev =>
                    prev.map(comment =>
                        comment.id === id ? { ...comment, content: newContent } : comment
                    )
                );
                toast.success('Sửa bình luận thành công', { autoClose: 1000 });
            } else {
                const data = await res.json();
                toast.error(data.message || 'Không thể sửa bình luận', { autoClose: 1000 });
            }
        } catch (err) {
            toast.error('Lỗi sửa bình luận', { autoClose: 1000 });
        }
    };

    const handleDeleteComment = async (id) => {
        try {
            const res = await fetch(`http://localhost:8000/api/comment/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });

            if (res.ok) {
                setComments(prev => prev.filter(comment => comment.id !== id));
                toast.success('Xóa bình luận thành công', { autoClose: 1000 });
            } else {
                const data = await res.json();
                toast.error(data.message || 'Không thể xóa bình luận', { autoClose: 1000 });
            }
        } catch (err) {
            toast.error('Lỗi xóa bình luận', { autoClose: 1000 });
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-md p-4 border space-y-4 -mt-5">
            <CommentForm
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onSubmit={handleSubmitComment}
                user={user}
            />

            <hr className="border-gray-300" />

            {comments.length > 0 ? (
                [...comments]
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .map((cmt) => {
                        const isOwner = Number(cmt.User?.id || cmt.user_id) === Number(user.id);
                        return (
                            <CommentItem
                                key={cmt.id}
                                comment={cmt}
                                isOwner={isOwner}
                                onEdit={handleEditComment}
                                onDelete={handleDeleteComment}
                            />
                        );
                    })
            ) : (
                <p className="text-gray-500 italic text-center">Chưa có bình luận nào.</p>
            )}
        </div>
    );
}
