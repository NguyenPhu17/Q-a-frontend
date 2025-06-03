import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";

export default function PostActions({ likes, dislikes, comments, onLike, onDislike, userVote }) {
  return (
    <div className="flex space-x-6 text-sm mt-4">
      <span
        onClick={(e) => {
          e.stopPropagation();
          onLike?.();
        }}
        className={`flex items-center gap-1 cursor-pointer select-none ${userVote === "like" ? "text-blue-800 font-semibold" : "text-blue-600"
          }`}
        title="Thích"
      >
        <AiFillLike size={20} />
        {likes}
      </span>

      <span
        onClick={(e) => {
          e.stopPropagation();
          onDislike?.();
        }}
        className={`flex items-center gap-1 cursor-pointer select-none ${userVote === "dislike" ? "text-red-800 font-semibold" : "text-red-600"
          }`}
        title="Không thích"
      >
        <AiFillDislike size={20} />
        {dislikes}
      </span>

      <span
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-1 text-green-600 cursor-pointer select-none"
        title="Bình luận"
      >
        <BiCommentDetail size={20} />
        {comments}
      </span>
    </div>
  );
}
