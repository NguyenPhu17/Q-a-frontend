import React, { useRef, useState, useEffect } from "react";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import Hashtags from "./Hashtags";

const PostCard = ({ post }) => {
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
      <div className="flex items-center space-x-2 sm:space-x-3 pb-3">
        <img
          src={post.avatar}
          alt={`${post.name} avatar`}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shadow-sm border border-gray-300"
        />
        <div className="flex flex-col justify-center leading-tight">
          <p className="text-sm sm:text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer mb-0.5">
            {post.name}
            <br />
            <span className="text-xs text-gray-500 leading-none">{post.date}</span>
          </p>
        </div>
      </div>

      <h3 className="font-bold text-base sm:text-lg mb-2 text-gray-800 mt-0">
        {post.topic}
      </h3>

      <div className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
        <p
          ref={contentRef}
          className={
            !expanded && clamped
              ? "line-clamp-2 transition-all duration-300"
              : "transition-all duration-300"
          }
        >
          {post.content}
        </p>
        {clamped && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 text-blue-600 hover:underline focus:outline-none text-xs sm:text-sm font-semibold cursor-pointer"
          >
            {expanded ? "Thu gọn" : "Xem thêm"}
          </button>
        )}
      </div>

      <Hashtags tags={post.hashtags} />

      <div className="flex space-x-4 sm:space-x-8 text-xs sm:text-sm mt-4">
        <button className="flex items-center gap-1 text-blue-600 transition-transform duration-200 hover:scale-110 hover:-translate-y-1">
          <AiFillLike size={20} /> <span>{post.likes}</span>
        </button>
        <button className="flex items-center gap-1 text-red-600 transition-transform duration-200 hover:scale-110 hover:-translate-y-1">
          <AiFillDislike size={20} /> <span>{post.dislikes ?? 0}</span>
        </button>
        <button className="flex items-center gap-1 text-green-600 transition-transform duration-200 hover:scale-110 hover:-translate-y-1">
          <BiCommentDetail size={20} /> <span>{post.comments}</span>
        </button>
      </div>

    </div>
  );
};

export default PostCard;
