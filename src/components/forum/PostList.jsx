import React, { useState } from "react";
import PostCard from "./PostCard";
import PostForm from "./PostForm";

export default function PostList({ posts, setPosts }) {
  const [editingPost, setEditingPost] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (post) => {
    setEditingPost({
      ...post,
      hashtags: Array.isArray(post.tags) ? post.tags.map(tag => tag.name).join(" ") : ""
    });
    setShowForm(true);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá bài viết này?")) return;

    try {
      const res = await fetch(`http://localhost:8000/api/post/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== postId));
      } else {
        alert("Xoá thất bại");
      }
    } catch (error) {
      console.error("Xoá thất bại:", error);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const res = await fetch(`http://localhost:8000/api/post/${editingPost.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
        }),
      });

      if (res.ok) {
        const updatedPost = await res.json();
        setPosts((prev) =>
          prev.map((p) => (p.id === editingPost.id ? updatedPost.data : p))
        );
        setShowForm(false);
        setEditingPost(null);
      } else {
        alert("Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
    }
  };

  return (
    <div>
      {Array.isArray(posts) &&
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={123}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}

      {showForm && (
        <PostForm
          initialData={editingPost}
          onClose={() => setShowForm(false)}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
}
