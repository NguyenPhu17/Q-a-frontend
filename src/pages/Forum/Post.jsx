import React, { useState } from 'react';
import SearchBar from '../../components/forum/SearchBar';
import Filter from '../../components/forum/Filter';
import CreatePost from '../../components/forum/CreatePost';
import PostList from '../../components/forum/PostList';
import PostForm from '../../components/forum/PostForm';

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
    dislikes: 4,        
    comments: 12,
  },
  {
    id: 2,
    avatar: 'https://i.pravatar.cc/40?img=18',
    name: 'Trần Thị B',
    date: '2025-05-21',
    topic: 'CSS Grid hay Flexbox?',
    content:
      'Bạn nên dùng Grid khi thiết kế layout tổng thể và dùng Flexbox khi cần sắp xếp các thành phần theo hàng hoặc cột. Bài viết này sẽ giúp bạn phân biệt rõ hơn.',
    hashtags: ['CSS', 'Grid', 'Flexbox'],
    likes: 22,
    dislikes: 2,
    comments: 5,
  },
  {
    id: 3,
    avatar: 'https://i.pravatar.cc/40?img=24',
    name: 'Lê Văn C',
    date: '2025-05-22',
    topic: 'Viết JavaScript sạch và dễ bảo trì',
    content:
      'Dùng const/let thay var, viết function nhỏ, sử dụng destructuring, và đặt tên biến rõ ràng là các nguyên tắc cơ bản giúp code JavaScript dễ đọc và bảo trì hơn.',
    hashtags: ['JavaScript', 'Clean Code'],
    likes: 15,
    dislikes: 1,
    comments: 3,
  },
  {
    id: 4,
    avatar: 'https://i.pravatar.cc/40?img=7',
    name: 'Phạm Minh D',
    date: '2025-05-23',
    topic: 'Tổng quan về Tailwind CSS',
    content:
      'Tailwind CSS là một framework utility-first giúp bạn xây dựng giao diện nhanh chóng mà không cần viết CSS thủ công. Trong bài viết này, tôi sẽ giới thiệu cách hoạt động, cấu trúc class và tips sử dụng hiệu quả Tailwind trong dự án thực tế. Từ đó, bạn có thể giảm đáng kể thời gian phát triển front-end và dễ dàng tái sử dụng component.',
    hashtags: ['TailwindCSS', 'Frontend'],
    likes: 41,
    dislikes: 6,
    comments: 9,
  },
  {
    id: 5,
    avatar: 'https://i.pravatar.cc/40?img=11',
    name: 'Đỗ Thị E',
    date: '2025-05-24',
    topic: 'Cách tổ chức dự án React chuyên nghiệp',
    content:
      'Một dự án React chuyên nghiệp cần có cấu trúc rõ ràng, tách biệt giữa component, hooks, services và assets. Bài viết này trình bày một mô hình thư mục được dùng trong các công ty lớn để quản lý dự án React quy mô vừa và lớn.',
    hashtags: ['React', 'Project Structure'],
    likes: 58,
    dislikes: 8,
    comments: 16,
  },
  {
    id: 6,
    avatar: 'https://i.pravatar.cc/40?img=5',
    name: 'Ngô Quốc F',
    date: '2025-05-24',
    topic: 'Sử dụng useEffect đúng cách',
    content: 'Đừng quên cleanup khi dùng useEffect!',
    hashtags: ['React', 'useEffect'],
    likes: 12,
    dislikes: 0,
    comments: 2,
  },
  {
    id: 7,
    avatar: 'https://i.pravatar.cc/40?img=28',
    name: 'Hoàng Thị G',
    date: '2025-05-25',
    topic: 'Node.js cơ bản cho người mới bắt đầu',
    content:
      'Node.js là môi trường chạy JavaScript phía server phổ biến hiện nay. Bài viết này sẽ giúp bạn hiểu rõ về cách cài đặt, sử dụng các module cơ bản và xây dựng API đơn giản.',
    hashtags: ['Node.js', 'Backend', 'JavaScript'],
    likes: 39,
    dislikes: 7,
    comments: 14,
  },
  {
    id: 8,
    avatar: 'https://i.pravatar.cc/40?img=9',
    name: 'Phan Văn H',
    date: '2025-05-26',
    topic: 'TypeScript và lợi ích khi sử dụng',
    content:
      'TypeScript giúp bạn viết code có kiểu dữ liệu rõ ràng, giảm lỗi runtime và dễ dàng bảo trì dự án lớn. Hãy cùng khám phá những tính năng nổi bật của TypeScript.',
    hashtags: ['TypeScript', 'JavaScript'],
    likes: 27,
    dislikes: 3,
    comments: 7,
  },
  {
    id: 9,
    avatar: 'https://i.pravatar.cc/40?img=2',
    name: 'Trương Minh I',
    date: '2025-05-26',
    topic: 'Git cơ bản và các lệnh thường dùng',
    content:
      'Git là hệ thống quản lý phiên bản phổ biến nhất hiện nay. Bài viết này sẽ hướng dẫn bạn các lệnh cơ bản như commit, branch, merge và cách giải quyết xung đột.',
    hashtags: ['Git', 'Version Control'],
    likes: 33,
    dislikes: 4,
    comments: 8,
  },
  {
    id: 10,
    avatar: 'https://i.pravatar.cc/40?img=17',
    name: 'Lê Thị J',
    date: '2025-05-27',
    topic: 'Các tips nâng cao trong React Hooks',
    content:
      'React Hooks giúp bạn viết component gọn hơn và quản lý state hiệu quả. Trong bài này, tôi sẽ chia sẻ các tips nâng cao như custom hooks, tối ưu useEffect và quản lý side-effects.',
    hashtags: ['React', 'Hooks', 'Advanced'],
    likes: 45,
    dislikes: 5,
    comments: 10,
  },
];

export default function PostPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

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
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans relative">
      {/* HEADER */}
      <div className="sticky top-[-35px] bg-gray-100 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          <div className="sm:col-span-2">
            <SearchBar search={search} setSearch={setSearch} />
          </div>
          <div className="sm:col-span-1 flex justify-end gap-3">
            <Filter onFilter={handleFilter} />
            <CreatePost onCreate={handleCreatePost} />
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

      <div className={`max-w-4xl mx-auto px-6 pb-6 mt-4 transition-all duration-200 ${showForm ? 'blur-sm pointer-events-none' : ''}`}>
        <PostList posts={filteredPosts} />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <PostForm onClose={handleCloseForm} />
        </div>
      )}
    </div>
  );
}