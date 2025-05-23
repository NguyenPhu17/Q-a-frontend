import React, { useState, useEffect } from 'react';
import { getAllGroups, createGroup } from '../../services/groupService';
import { Modal } from 'antd'; // Nếu dùng Ant Design

const Group = () => {
  const [groups, setGroups] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userRole = localStorage.getItem('role'); // 'student' | 'lecturer' | 'admin'

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
  try {
    const res = await getAllGroups();
    console.log('res.data:', res.data, '| typeof:', typeof res.data);
    setGroups(res.data.data);
  } catch (err) {
    console.error('Lỗi khi lấy nhóm:', err);
  }
};

  const handleSubmit = async () => {
    try {
      const res = await createGroup(formData);
      setGroups(prev => [...prev, res.data]);
      setFormData({ name: '', description: '' });
      setIsModalOpen(false);
    } catch (err) {
      console.error('Lỗi tạo nhóm:', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Danh sách nhóm</h1>
        {userRole === 'lecturer' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Tạo nhóm
          </button>
        )}
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div key={group.id} className="border p-4 rounded shadow bg-white">
            <h3 className="text-lg font-semibold">{group.name}</h3>
            <p className="text-gray-600">{group.description}</p>
          </div>
        ))}
      </div>

      {/* Modal tạo nhóm */}
      <Modal
        title="Tạo nhóm mới"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText="Tạo"
        cancelText="Hủy"
      >
        <input
          type="text"
          placeholder="Tên nhóm"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          placeholder="Mô tả nhóm"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
      </Modal>
    </div>
  );
};

export default Group;
