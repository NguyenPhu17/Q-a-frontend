import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Modal, Button, Table, Popconfirm, message } from 'antd';
import axiosInstance from '../../services/axiosInstance';

const GroupDetail = () => {
  const { id } = useParams(); // groupId
  const [groupName, setGroupName] = useState('');
  const [acceptedMembers, setAcceptedMembers] = useState([]);
  const [pendingMembers, setPendingMembers] = useState([]);

  const [isAcceptedModalOpen, setAcceptedModalOpen] = useState(false);
  const [isPendingModalOpen, setPendingModalOpen] = useState(false);

  useEffect(() => {
    fetchGroupInfo();
  }, [id]);

  const fetchGroupInfo = async () => {
    try {
      const res = await axiosInstance.get(`/group/${id}`);
      setGroupName(res.data.name || 'Chi tiết nhóm');
    } catch (err) {
      console.error('Không thể lấy thông tin nhóm');
    }
  };

  const fetchAcceptedMembers = async () => {
    try {
      const res = await axiosInstance.get(`/group_member/accepted_member/${id}`);
      setAcceptedMembers(res.data || []);
    } catch (err) {
      console.error('Lỗi lấy thành viên đã duyệt:', err);
    }
  };

  const fetchPendingMembers = async () => {
  try {
    const res = await axiosInstance.get(`/group_member/pending_member/${id}`);
    console.log('Pending data:', res.data); // <- Xem có fullName/email không
    setPendingMembers(res.data || []);
  } catch (err) {
    console.error('Lỗi lấy thành viên chờ duyệt:', err);
  }
};

  const handleAccept = async (userId) => {
    try {
      await axiosInstance.put(`/group_member/update_accepted/${id}`, {
        userId,
        status: 'accepted',
      });
      message.success('Đã duyệt thành viên');
      fetchPendingMembers();
      fetchAcceptedMembers();
    } catch (err) {
      message.error('Lỗi duyệt');
    }
  };

  const handleReject = async (userId) => {
    try {
      await axiosInstance.put(`/group_member/update_accepted/${id}`, {
        userId,
        status: 'rejected',
      });
      message.success('Đã từ chối');
      fetchPendingMembers();
    } catch (err) {
      message.error('Lỗi từ chối');
    }
  };

  const handleDelete = async (memberId) => {
    try {
      await axiosInstance.delete(`/group_member/delete_rejected/${memberId}`);
      message.success('Đã xóa');
      fetchAcceptedMembers();
    } catch (err) {
      message.error('Lỗi xóa thành viên');
    }
  };

  const pendingColumns = [
      {
        title: 'Họ tên',
        dataIndex: ['user', 'name'], // đúng theo key trong backend trả ra
      },
      {
        title: 'Email',
        dataIndex: ['user', 'email'],
      },
      {
        title: 'Hành động',
        render: (text, record) => (
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

  const acceptedColumns = [
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
        render: (text, record) => (
          <Popconfirm
            title="Xóa thành viên này?"
            onConfirm={() => handleDelete(record.user_id)}
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        ),
      },
    ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chi tiết nhóm: {groupName}</h1>
      <div className="space-x-4">
        <Button
          onClick={() => {
            fetchAcceptedMembers();
            setAcceptedModalOpen(true);
          }}
        >
          Xem danh sách thành viên
        </Button>
        <Button
          onClick={() => {
            fetchPendingMembers();
            setPendingModalOpen(true);
          }}
          type="primary"
        >
          Xem yêu cầu tham gia
        </Button>
      </div>

      {/* Modal thành viên đã duyệt */}
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
        />
      </Modal>

      {/* Modal thành viên chờ duyệt */}
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
        />
      </Modal>
    </div>
  );
};

export default GroupDetail;
