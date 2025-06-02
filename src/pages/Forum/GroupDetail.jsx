import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Modal, Button, Table, Popconfirm, message } from 'antd';
import {
  getGroupById,
  getAcceptedMembers,
  getPendingMembers,
  updateMemberStatus,
  deleteMember,
} from '../../services/groupService';

import { getCurrentUser } from '../../services/authService'; // giả sử có hàm này để lấy người đăng nhập

const GroupDetail = () => {
  const { id: groupId } = useParams();
  const [groupInfo, setGroupInfo] = useState(null);
  const [acceptedMembers, setAcceptedMembers] = useState([]);
  const [pendingMembers, setPendingMembers] = useState([]);
  const [isAcceptedModalOpen, setAcceptedModalOpen] = useState(false);
  const [isPendingModalOpen, setPendingModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchGroupInfo();
    fetchCurrentUser();
  }, [groupId]);

  useEffect(() => {
  if (currentUser && groupInfo) {
    console.log('currentUser.id:', currentUser.id);
    console.log('groupInfo.owner.id:', groupInfo.owner?.id);
    console.log('isOwner:', currentUser.id === groupInfo.owner?.id);
  }
}, [currentUser, groupInfo]);

  const fetchGroupInfo = async () => {
    try {
      const res = await getGroupById(groupId);
      setGroupInfo(res.data);
    } catch (err) {
      console.error('Không thể lấy thông tin nhóm');
      message.error('Lấy thông tin nhóm thất bại');
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await getCurrentUser();
      console.log('Current user data:', res.data);
      setCurrentUser(res.data.data);
    } catch (err) {
      console.error('Không thể lấy thông tin người dùng');
    }
  };

  const fetchAcceptedMembers = async () => {
    try {
      const res = await getAcceptedMembers(groupId);
      setAcceptedMembers(res.data || []);
    } catch (err) {
      console.error('Lỗi lấy thành viên đã duyệt:', err);
      message.error('Lỗi lấy thành viên đã duyệt');
    }
  };

  const fetchPendingMembers = async () => {
    try {
      const res = await getPendingMembers(groupId);
      setPendingMembers(res.data || []);
    } catch (err) {
      console.error('Lỗi lấy thành viên chờ duyệt:', err);
      message.error('Lỗi lấy thành viên chờ duyệt');
    }
  };

  const handleAccept = async (userId) => {
    try {
      await updateMemberStatus(groupId, userId, 'accepted');
      message.success('Đã duyệt thành viên');
      fetchPendingMembers();
      fetchAcceptedMembers();
    } catch (err) {
      message.error('Lỗi duyệt thành viên');
    }
  };

  const handleReject = async (userId) => {
    try {
      await updateMemberStatus(groupId, userId, 'rejected');
      message.success('Đã từ chối thành viên');
      fetchPendingMembers();
    } catch (err) {
      message.error('Lỗi từ chối thành viên');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteMember(groupId, userId);
      message.success('Đã xóa thành viên');
      fetchAcceptedMembers();
    } catch (err) {
      message.error('Lỗi xóa thành viên');
    }
  };

  const isOwner = currentUser && groupInfo && currentUser.id === groupInfo.owner?.id;

  const acceptedColumns = [
    {
      title: 'STT',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Họ tên',
      dataIndex: ['user', 'name'],
    },
    {
      title: 'Email',
      dataIndex: ['user', 'email'],
    },
  ];

  if (isOwner) {
    acceptedColumns.push({
      title: 'Hành động',
      render: (_, record) => (
        <Popconfirm
          title="Xóa thành viên này?"
          onConfirm={() => handleDelete(record.user_id)}
        >
          <Button type="link" danger>
            Xóa
          </Button>
        </Popconfirm>
      ),
    });
  }

  const pendingColumns = [
    {
      title: 'Họ tên',
      dataIndex: ['user', 'name'],
    },
    {
      title: 'Email',
      dataIndex: ['user', 'email'],
    },
    {
      title: 'Hành động',
      render: (_, record) => (
        <>
          <Button onClick={() => handleAccept(record.user_id)} type="link">
            Duyệt
          </Button>
          <Button onClick={() => handleReject(record.user_id)} type="link" danger>
            Từ chối
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chi tiết nhóm: {groupInfo?.name}</h1>
      <p>Mô tả: {groupInfo?.description}</p>
      <p>Người tạo: {groupInfo?.owner?.name} ({groupInfo?.owner?.email})</p>
      <p>Số thành viên: {groupInfo?.member_count}</p>
      <p>Ngày tạo: {new Date(groupInfo?.created_at).toLocaleDateString()}</p>

      <div className="space-x-4 my-4">
        <Button
          onClick={() => {
            fetchAcceptedMembers();
            setAcceptedModalOpen(true);
          }}
        >
          Xem danh sách thành viên
        </Button>
        {isOwner && (
          <Button
            onClick={() => {
              fetchPendingMembers();
              setPendingModalOpen(true);
            }}
            type="primary"
          >
            Xem yêu cầu tham gia
          </Button>
        )}
      </div>

      <Modal
        title="Thành viên nhóm"
        open={isAcceptedModalOpen}
        onCancel={() => setAcceptedModalOpen(false)}
        footer={null}
        width={700}
      >
        <Table
          dataSource={acceptedMembers}
          columns={acceptedColumns}
          rowKey="id"
          pagination={false}
        />
      </Modal>

      <Modal
        title="Yêu cầu tham gia nhóm"
        open={isPendingModalOpen}
        onCancel={() => setPendingModalOpen(false)}
        footer={null}
        width={700}
      >
        <Table
          dataSource={pendingMembers}
          columns={pendingColumns}
          rowKey="id"
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default GroupDetail;
