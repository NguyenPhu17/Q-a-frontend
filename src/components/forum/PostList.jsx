import React from "react";
import PostCard from "./PostCard";

export default function PostList({ posts }) {
  return (
    <div>
      {Array.isArray(posts) &&
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
          />
        ))}
    </div>
  );
}
