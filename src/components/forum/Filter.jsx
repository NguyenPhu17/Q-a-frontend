import React from 'react';
import { Button } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

export default function Filter({ onFilter }) {
  return (
    <Button
      block
      icon={<FilterOutlined />}
      onClick={onFilter}
      className="!bg-white !text-gray-800 !border-gray-300 hover:!bg-gray-200 hover:!shadow-lg transition duration-300 transform hover:-translate-y-1 rounded-xl py-4 font-semibold shadow-md border"
    >
      Lọc
    </Button>
  );
}
