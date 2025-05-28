import React from 'react';
import { useParams } from 'react-router-dom';

const GroupDetail = () => {
  const { id } = useParams();

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chi tiết nhóm #{id}</h1>
      <p>Hiển thị chi tiết của nhóm ở đây...</p>
    </div>
  );
};

export default GroupDetail;