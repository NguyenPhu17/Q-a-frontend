import React, { useState, useEffect } from 'react';
import SearchBar from '../../components/forum/SearchBar';
import Filter from '../../components/forum/Filter';
import CreatePost from '../../components/forum/CreatePost';
import PostList from '../../components/forum/PostList';
import PostForm from '../../components/forum/PostForm';

export default function PostPage() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/post/public", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      setPosts(data.data || []);
    } catch (error) {
      console.error('Lỗi khi lấy bài viết:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (formData) => {
    try {
      const tags = formData.hashtags ? formData.hashtags.trim().split(/\s+/) : [];
      const payload = { ...formData, tags };

      const res = await fetch("http://localhost:8000/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log('Create post response:', result);

      if (res.ok) {
        setPosts(prevPosts => [result.data, ...prevPosts]);
        setShowCreateForm(false);
      } else {
        alert('Tạo bài viết thất bại: ' + (result.message || 'Lỗi không xác định'));
      }
    } catch (error) {
      console.error('Lỗi tạo bài viết:', error);
      alert('Tạo bài viết thất bại do lỗi mạng');
    }
  };

  const handleFilter = () => {
    alert('Chức năng lọc đang phát triển!');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans relative">
      <div className="sticky top-[-35px] bg-gray-100 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          <div className="sm:col-span-2">
            <SearchBar search={search} setSearch={setSearch} />
          </div>
          <div className="sm:col-span-1 flex justify-end gap-3">
            <Filter onFilter={handleFilter} />
            <CreatePost onCreate={() => setShowCreateForm(true)} />
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-6 pb-2">
          <div className="flex items-center">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-4 text-gray-500 font-semibold whitespace-nowrap">
              Danh sách bài viết
            </span>
            <hr className="flex-grow border-gray-300" />
          </div>
        </div>
      </div>

      <div
        className={`max-w-4xl mx-auto px-6 pb-6 mt-4 transition-all duration-200 ${showCreateForm ? 'blur-sm pointer-events-none' : ''
          }`}
      >
        <PostList posts={posts} setPosts={setPosts} />
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <PostForm
            onClose={() => setShowCreateForm(false)}
            onSubmit={handleCreatePost}
          />
        </div>
      )}
    </div>
  );
}