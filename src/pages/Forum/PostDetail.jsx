import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import PostContent from '../../components/forum/PostContent';
import CommentForm from '../../components/forum/CommentForm';
import CommentItem from '../../components/forum/CommentItem';
import PostForm from '../../components/forum/PostForm';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const currentUserId = Number(localStorage.getItem('userId'));
    const errorToastShown = useRef(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const postRes = await fetch(`http://localhost:8000/api/post/detail/${id}`, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                const postData = await postRes.json();
                setPost(postData.data);

                const commentRes = await fetch(`http://localhost:8000/api/post/${id}/comment`, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                const commentData = await commentRes.json();
                setComments(commentData.data || []);
            } catch (err) {
                console.error('Lỗi khi tải bài viết hoặc bình luận:', err);
                if (!errorToastShown.current) {
                    toast.error('Lỗi khi tải bài viết hoặc bình luận', { autoClose: 1000 });
                    errorToastShown.current = true;
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const res = await fetch(`http://localhost:8000/api/post/${id}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify({ content: newComment }),
            });

            const result = await res.json();
            if (res.ok) {
                setComments((prev) => [...prev, result.data]);
                setNewComment('');
                toast.success('Gửi bình luận thành công!', { autoClose: 1000 });
            } else {
                toast.error(result.message || 'Gửi bình luận thất bại', { autoClose: 1000 });
            }
        } catch (err) {
            console.error('Lỗi gửi bình luận:', err);
            toast.error('Lỗi gửi bình luận', { autoClose: 1000 });
        }
    };

    const handleUpdate = async (formData) => {
        try {
            const tags = formData.hashtags ? formData.hashtags.trim().split(/\s+/) : [];

            const res = await fetch(`http://localhost:8000/api/post/${post.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify({
                    title: formData.title,
                    content: formData.content,
                    tags,
                }),
            });

            const result = await res.json();

            if (res.ok) {
                setPost((prev) => ({
                    ...result.data,
                    User: prev.User,
                }));
                setEditing(false);
                toast.success('Cập nhật bài viết thành công!', { autoClose: 1000 });
            } else {
                toast.error('Cập nhật thất bại: ' + (result.message || 'Lỗi không xác định', { autoClose: 1000 }));
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            toast.error('Lỗi khi cập nhật bài viết', { autoClose: 1000 });
        }
    };

    const handleDelete = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                const handleConfirm = async () => {
                    try {
                        const res = await fetch(`http://localhost:8000/api/post/${post.id}`, {
                            method: 'DELETE',
                            headers: {
                                Authorization: 'Bearer ' + localStorage.getItem('token'),
                            },
                        });

                        if (res.ok) {
                            toast.success('Xoá thành công', { autoClose: 1000 });
                            navigate('/forum');
                        } else {
                            const result = await res.json();
                            toast.error(result.message || 'Xoá thất bại', { autoClose: 1000 });
                        }
                    } catch (error) {
                        console.error('Xoá thất bại:', error);
                        toast.error('Xoá thất bại', { autoClose: 1000 });
                    }
                    onClose();
                };

                return (
                    <div
                        style={{
                            background: 'white',
                            padding: 20,
                            borderRadius: 8,
                            maxWidth: 400,
                            margin: 'auto',
                            textAlign: 'center',
                        }}
                    >
                        <h2 style={{ marginBottom: 15 }}>Xác nhận</h2>
                        <p style={{ marginBottom: 25 }}>Bạn có chắc chắn muốn xoá bài viết này?</p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                            <button
                                onClick={handleConfirm}
                                style={{
                                    flex: 1,
                                    padding: '10px 0',
                                    borderRadius: 5,
                                    border: 'none',
                                    backgroundColor: '#ef4444', // đỏ
                                    color: 'white',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                }}
                            >
                                Có
                            </button>

                            <button
                                onClick={onClose}
                                style={{
                                    flex: 1,
                                    padding: '10px 0',
                                    borderRadius: 5,
                                    border: '1px solid #aaa',
                                    backgroundColor: 'white',
                                    color: '#333',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                }}
                            >
                                Không
                            </button>
                        </div>
                    </div>
                );
            },
        });
    };

    if (loading) {
        return <div className="text-center text-gray-500 py-8">Đang tải bài viết...</div>;
    }

    if (!post) {
        return <div className="text-center text-red-500 py-8">Không tìm thấy bài viết.</div>;
    }

    const isOwner = currentUserId === post.user_id;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-sm text-blue-600 hover:underline"
            >
                ← Quay lại
            </button>

            <PostContent
                post={post}
                showFullContent={true}
                isOwner={isOwner}
                onEdit={() => setEditing(true)}
                onDelete={handleDelete}
            />

            {editing && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <PostForm
                        initialData={{
                            title: post.title,
                            content: post.content,
                            hashtags: post.tags?.map((tag) => tag.name).join(' ') || '',
                        }}
                        onClose={() => setEditing(false)}
                        onSubmit={handleUpdate}
                    />
                </div>
            )}

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Bình luận ({comments.length})</h2>

                <CommentForm
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onSubmit={handleSubmitComment}
                />

                <div className="space-y-4 mt-4">
                    {comments.length > 0 ? (
                        comments.map((cmt) => <CommentItem key={cmt.id} comment={cmt} />)
                    ) : (
                        <p className="text-gray-500">Chưa có bình luận nào.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
