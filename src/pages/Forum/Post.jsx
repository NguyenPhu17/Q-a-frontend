import React, { useState } from 'react';
import SearchBar from '../../components/forum/SearchBar';
import Filter from '../../components/forum/Filter';
import CreatePost from '../../components/forum/CreatePost';
import PostList from '../../components/forum/PostList';
import GroupSuggestions from '../../components/forum/GroupSuggestions';

const postsData = [
  {
    id: 1,
    avatar: 'https://i.pravatar.cc/40?img=12',
    name: 'Nguyễn Văn A',
    date: '2025-05-20',
    topic: 'Mẹo tối ưu React hiệu suất cao',
    content:
      'Chia sẻ các kỹ thuật giúp tăng tốc render trong React như React.memo, useCallback, useMemo và tránh re-render không cần thiết trong component.',
    hashtags: ['React', 'Performance', 'Hooks'],
    likes: 34,
    comments: 12,
  },
  {
    id: 2,
    avatar: 'https://i.pravatar.cc/40?img=25',
    name: 'Trần Thị B',
    date: '2025-05-21',
    topic: 'CSS Grid vs Flexbox: Khi nào dùng gì?',
    content:
      'Phân tích sâu về sự khác nhau giữa CSS Grid và Flexbox, cũng như khi nào nên chọn công cụ nào để thiết kế layout frontend hiệu quả.',
    hashtags: ['CSS', 'Grid', 'Flexbox'],
    likes: 21,
    comments: 7,
  },
  {
    id: 3,
    avatar: 'https://i.pravatar.cc/40?img=30',
    name: 'Lê Văn C',
    date: '2025-05-22',
    topic: 'Tối ưu hình ảnh trong website',
    content:
      'Giới thiệu các kỹ thuật tối ưu hình ảnh như lazy loading, định dạng WebP, responsive images.',
    hashtags: ['Image', 'Web', 'Performance'],
    likes: 15,
    comments: 4,
  },
];

export default function PostPage() {
  const [search, setSearch] = useState('');

  const filteredPosts = postsData.filter((post) => {
    const s = search.toLowerCase();
    return (
      post.topic.toLowerCase().includes(s) ||
      post.content.toLowerCase().includes(s) ||
      post.hashtags.some((tag) => tag.toLowerCase().includes(s))
    );
  });

  const handleFilter = () => {
    alert('Chức năng lọc đang phát triển!');
  };

  const handleCreatePost = () => {
    alert('Chức năng tạo bài viết đang phát triển!');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Top: Search & Buttons */}
      <div className="max-w-7xl mx-auto px-6 pt-0 pb-2 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2">
          <SearchBar search={search} setSearch={setSearch} />
        </div>
        <div className="col-span-1">
          <div className="flex gap-3 w-full">
            <Filter onFilter={handleFilter} />
            <CreatePost onCreate={handleCreatePost} />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2 flex items-center my-2">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-gray-500 font-semibold whitespace-nowrap">Danh sách bài viết</span>
          <hr className="flex-grow border-gray-300" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-3 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5 max-h-[600px] overflow-y-auto hide-scrollbar postlist-scroll-area">
          <PostList posts={filteredPosts} />
        </div>
        <div className="lg:col-span-1">
          <GroupSuggestions />
        </div>
      </div>
    </div>
  );
}
