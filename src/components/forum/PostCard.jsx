import React, { useRef, useState, useEffect } from "react";
import { AiFillLike, AiFillDislike, AiFillEdit, AiFillDelete } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import Hashtags from "./Hashtags";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

const PostCard = ({ post, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    setExpanded(false);
    setClamped(false);

    const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
    const maxHeight = 2 * lineHeight;

    if (element.scrollHeight > maxHeight) {
      setClamped(true);
    }
  }, [post.content]);

  return (
    <div className="bg-white rounded-3xl shadow-md p-3 sm:p-5 mb-6 hover:shadow-lg transition-shadow duration-300">
      <div className="absolute top-3 right-3 flex space-x-2">
        <button
          onClick={() => onEdit(post)}
          className="text-blue-600 hover:text-blue-800"
          aria-label="Sửa bài viết"
        >
          <AiFillEdit size={20} />
        </button>
        <button
          onClick={() => onDelete(post.id)}
          className="text-red-600 hover:text-red-800"
          aria-label="Xóa bài viết"
        >
          <AiFillDelete size={20} />
        </button>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-3 pb-3">
        <img
          src={post.User?.avt || 'default.jpg'}
          alt={`${post.User?.name || 'Người dùng'} avatar`}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shadow-sm border border-gray-300"
        />
        <div className="flex flex-col justify-center leading-tight">
          <p className="text-sm sm:text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer mb-0.5">
            {post.User?.name}
            <br />
            <span className="text-xs text-gray-500 leading-none">{new Date(post.created_at).toLocaleDateString("vi-VN")}</span>
          </p>
        </div>
      </div>

      <h3 className="font-bold text-base sm:text-lg mb-2 text-gray-800 mt-0">
        {post.title}
      </h3>

      <div className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
        <div
          ref={contentRef}
          className={
            !expanded && clamped
              ? "line-clamp-2 transition-all duration-300"
              : "transition-all duration-300"
          }
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              ul: ({ node, ...props }) => <ul className="list-disc pl-6" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-6" {...props} />,
              li: ({ node, ...props }) => <li className="mb-1" {...props} />,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
        {clamped && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 text-blue-600 hover:underline focus:outline-none text-xs sm:text-sm font-semibold cursor-pointer"
          >
            {expanded ? "Thu gọn" : "Xem thêm"}
          </button>
        )}
      </div>

      <Hashtags tags={post.tags?.map(tag => tag.name)} />

      <div className="flex space-x-4 sm:space-x-8 text-xs sm:text-sm mt-4">
        <button className="flex items-center gap-1 text-blue-600 transition-transform duration-200 hover:scale-110 hover:-translate-y-1">
          <AiFillLike size={20} /> <span>{post.likes ?? 0}</span>
        </button>
        <button className="flex items-center gap-1 text-red-600 transition-transform duration-200 hover:scale-110 hover:-translate-y-1">
          <AiFillDislike size={20} /> <span>{post.dislikes ?? 0}</span>
        </button>
        <button className="flex items-center gap-1 text-green-600 transition-transform duration-200 hover:scale-110 hover:-translate-y-1">
          <BiCommentDetail size={20} /> <span>{post.comments ?? 0}</span>
        </button>
      </div>

    </div>
  );
};

export default PostCard;
