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

    return (
        <div className="mt-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
                Bình luận ({comments.length})
            </h2>

            <CommentForm
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onSubmit={handleSubmitComment}
                user={user}
            />

            <div className="space-y-6 mt-6">
                {comments.length > 0 ? (
                    comments.map((cmt) => (
                        <CommentItem key={cmt.id} comment={cmt} />
                    ))
                ) : (
                    <p className="text-gray-500 italic text-center">Chưa có bình luận nào.</p>
                )}
            </div>
        </div>
    );
}
