import React from 'react';

const groups = [
  { name: 'React Việt Nam', description: 'Cộng đồng React cho người Việt' },
  { name: 'Frontend Devs', description: 'Nơi chia sẻ về HTML, CSS, JS' },
  { name: 'UI/UX Designers', description: 'Giao lưu thiết kế UI đẹp mắt' },
];

export default function GroupSuggestions() {
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Gợi ý nhóm</h3>
      <ul className="space-y-4">
        {groups.map((group, index) => (
          <li key={index}>
            <p className="font-semibold">{group.name}</p>
            <p className="text-sm text-gray-500">{group.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
