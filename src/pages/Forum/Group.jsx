import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllGroups, getGroupsOfLecturer, createGroup } from '../../services/groupService';
import { joinGroup } from '../../services/groupMemberService';
import { Modal, message } from 'antd';

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
      const res = userRole === 'lecturer'
        ? await getGroupsOfLecturer()
        : await getAllGroups();
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

  const handleJoinGroup = async (groupId) => {
  try {
    await joinGroup(groupId);
    message.success('Đã gửi yêu cầu tham gia nhóm');

    // Cập nhật trạng thái trong danh sách nhóm
    setGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId ? { ...group, hasRequested: true } : group
      )
    );
  } catch (err) {
    const msg = err.response?.data?.message;

    if (msg === 'Ban da gui yeu cau hoac la thanh vien trong nhom') {
      message.warning('Bạn đã gửi yêu cầu hoặc đã là thành viên của nhóm này.');
    } else {
      message.error('Gửi yêu cầu thất bại');
    }

    console.error('Lỗi khi tham gia nhóm:', err.response || err);
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
          <div
            key={group.id}
            className="border p-4 rounded shadow bg-white hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold">{group.name}</h3>
            <p className="text-gray-600">{group.description}</p>

            <div className="mt-2">
              <Link
                to={`/forum/group/${group.id}`}
                className="text-blue-600 hover:underline mr-4"
              >
                Xem chi tiết
              </Link>
              {userRole === 'student' && (
                group.hasRequested ? (
                  <span className="text-gray-500">Đã gửi yêu cầu</span>
                ) : (
                  <button
                    onClick={() => handleJoinGroup(group.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Tham gia
                  </button>
                )
              )}
            </div>
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
