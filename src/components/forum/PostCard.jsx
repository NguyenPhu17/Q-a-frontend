import React from "react";
import { useNavigate } from "react-router-dom";
import PostContent from "./PostContent";

const PostCard = ({ post }) => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <div
        className="cursor-pointer"
        onClick={() => navigate(`/forum/post/${post.id}`)}
      >
        <PostContent post={post} commentCount={post.comment_count} showFullContent={false} />
      </div>
    </div>
  );
};

export default PostCard;
