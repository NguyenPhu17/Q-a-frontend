import React, { useRef, useEffect, useState } from "react";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { FaEdit, FaTrash } from "react-icons/fa";
import Hashtags from "./Hashtags";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export default function PostContent({ post, showFullContent = true, isOwner, onEdit, onDelete, commentCount }) {
    const contentRef = useRef(null);
    const [expanded, setExpanded] = useState(showFullContent);
    const [clamped, setClamped] = useState(false);

    useEffect(() => {
        if (!contentRef.current) return;
        const element = contentRef.current;

        if (showFullContent) {
            setClamped(false);
            return;
        }

        const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
        const maxHeight = 2 * lineHeight;

        if (element.scrollHeight > maxHeight) {
            setClamped(true);
        }
    }, [post.content, showFullContent]);

    return (
        <div className="bg-white rounded-3xl shadow-md p-5 border mb-6 relative">
            {isOwner && (
                <div className="absolute top-4 right-4 flex space-x-3">
                    <button
                        onClick={onEdit}
                        title="Sửa bài viết"
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <FaEdit size={20} />
                    </button>
                    <button
                        onClick={onDelete}
                        title="Xoá bài viết"
                        className="text-red-600 hover:text-red-800"
                    >
                        <FaTrash size={20} />
                    </button>
                </div>
            )}

            <div className="flex items-center space-x-3 pb-3">
                <img
                    src={post.User?.avt || "/default.jpg"}
                    alt={`${post.User?.name || "Ẩn danh"} avatar`}
                    className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-300"
                />
                <div className="leading-tight">
                    <p className="font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer mb-0.5">
                        {post.User?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                        {new Date(post.created_at).toLocaleDateString("vi-VN")}
                    </p>
                </div>
            </div>

            <h3 className="font-bold text-lg mb-2 text-gray-800">{post.title}</h3>

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
                {!showFullContent && clamped && (
                    <button
                        onClick={() => setExpanded(true)}
                        className="mt-1 text-blue-600 hover:underline focus:outline-none text-xs font-semibold"
                    >
                        Xem thêm
                    </button>
                )}
            </div>

            <Hashtags tags={post.tags?.map(tag => tag.name)} />

            <div className="flex space-x-6 text-sm mt-4">
                <span className="flex items-center gap-1 text-blue-600">
                    <AiFillLike size={20} />
                    {post.likes ?? 0}
                </span>
                <span className="flex items-center gap-1 text-red-600">
                    <AiFillDislike size={20} />
                    {post.dislikes ?? 0}
                </span>
                <span className="flex items-center gap-1 text-green-600">
                    <BiCommentDetail size={20} />
                    {commentCount ?? post.comment_count ?? 0}
                </span>
            </div>
        </div>
    );
}
