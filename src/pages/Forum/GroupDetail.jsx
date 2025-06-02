"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {
  Card,
  Button,
  Table,
  Modal,
  Popconfirm,
  message,
  Avatar,
  Tag,
  Space,
  Divider,
  Row,
  Col,
  Typography,
} from "antd"
import {
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  MailOutlined,
  CrownOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons"

import {
  getGroupById,
  getAcceptedMembers,
  getPendingMembers,
  updateMemberStatus,
  deleteMember,
} from "../../services/groupService"
import { getCurrentUser } from "../../services/authService"

const { Title, Text, Paragraph } = Typography

const GroupDetail = () => {
  const { id: groupId } = useParams()
  const [groupInfo, setGroupInfo] = useState(null)
  const [acceptedMembers, setAcceptedMembers] = useState([])
  const [pendingMembers, setPendingMembers] = useState([])
  const [isAcceptedModalOpen, setAcceptedModalOpen] = useState(false)
  const [isPendingModalOpen, setPendingModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGroupInfo()
    fetchCurrentUser()
  }, [groupId])

  const fetchGroupInfo = async () => {
    try {
      const res = await getGroupById(groupId)
      setGroupInfo(res.data)
    } catch (err) {
      console.error("Không thể lấy thông tin nhóm")
      message.error("Lấy thông tin nhóm thất bại")
    } finally {
      setLoading(false)
    }
  }

  const fetchCurrentUser = async () => {
    try {
      const res = await getCurrentUser()
      setCurrentUser(res.data.data)
    } catch (err) {
      console.error("Không thể lấy thông tin người dùng")
    }
  }

  const fetchAcceptedMembers = async () => {
    try {
      const res = await getAcceptedMembers(groupId)
      setAcceptedMembers(res.data || [])
    } catch (err) {
      console.error("Lỗi lấy thành viên đã duyệt:", err)
      message.error("Lỗi lấy thành viên đã duyệt")
    }
  }

  const fetchPendingMembers = async () => {
    try {
      const res = await getPendingMembers(groupId)
      setPendingMembers(res.data || [])
    } catch (err) {
      console.error("Lỗi lấy thành viên chờ duyệt:", err)
      message.error("Lỗi lấy thành viên chờ duyệt")
    }
  }

  const handleAccept = async (userId) => {
    try {
      await updateMemberStatus(groupId, userId, "accepted")
      message.success("Đã duyệt thành viên")
      fetchPendingMembers()
      fetchAcceptedMembers()
    } catch (err) {
      message.error("Lỗi duyệt thành viên")
    }
  }

  const handleReject = async (userId) => {
    try {
      await updateMemberStatus(groupId, userId, "rejected")
      message.success("Đã từ chối thành viên")
      fetchPendingMembers()
    } catch (err) {
      message.error("Lỗi từ chối thành viên")
    }
  }

  const handleDelete = async (userId) => {
    try {
      await deleteMember(groupId, userId)
      message.success("Đã xóa thành viên")
      fetchAcceptedMembers()
    } catch (err) {
      message.error("Lỗi xóa thành viên")
    }
  }

  const isOwner = currentUser && groupInfo && currentUser.id === groupInfo.owner?.id

  const acceptedColumns = [
    {
      title: "STT",
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: "Thành viên",
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div>{record.user?.name}</div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              <MailOutlined /> {record.user?.email}
            </Text>
          </div>
        </Space>
      ),
    },
  ]

  if (isOwner) {
    acceptedColumns.push({
      title: "Hành động",
      render: (_, record) => (
        <Popconfirm
          title="Xóa thành viên này?"
          onConfirm={() => handleDelete(record.user_id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button type="text" danger icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Popconfirm>
      ),
      width: 100,
    })
  }

  const pendingColumns = [
    {
      title: "Thành viên",
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div>{record.user?.name}</div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              <MailOutlined /> {record.user?.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small" icon={<CheckOutlined />} onClick={() => handleAccept(record.user_id)}>
            Duyệt
          </Button>
          <Button danger size="small" icon={<CloseOutlined />} onClick={() => handleReject(record.user_id)}>
            Từ chối
          </Button>
        </Space>
      ),
      width: 150,
    },
  ]

  if (loading) {
    return (
      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        <Card loading={loading} />
      </div>
    )
  }

  if (!groupInfo) {
    return (
      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        <Card>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Text type="secondary">Không tìm thấy thông tin nhóm</Text>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <Card>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <Title level={2} style={{ margin: 0 }}>
                {groupInfo.name}
              </Title>
              {isOwner && (
                <Tag color="gold" icon={<CrownOutlined />} style={{ marginTop: "8px" }}>
                  Chủ nhóm
                </Tag>
              )}
            </div>
          </div>

          {groupInfo.description && (
            <Paragraph style={{ marginTop: "16px", fontSize: "16px" }}>{groupInfo.description}</Paragraph>
          )}
        </div>

        <Divider />

        {/* Group Info */}
        <Row gutter={[24, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={24} md={12}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div>
                <Text strong>Người tạo nhóm:</Text>
                <div style={{ marginTop: "8px" }}>
                  <Space>
                    <Avatar icon={<UserOutlined />} />
                    <div>
                      <div>{groupInfo.owner?.name}</div>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        <MailOutlined /> {groupInfo.owner?.email}
                      </Text>
                    </div>
                  </Space>
                </div>
              </div>
            </Space>
          </Col>

          <Col xs={24} md={12}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div>
                <Space size="large">
                  <div>
                    <TeamOutlined style={{ marginRight: "8px" }} />
                    <Text strong>{groupInfo.member_count}</Text> thành viên
                  </div>
                  <div>
                    <CalendarOutlined style={{ marginRight: "8px" }} />
                    <Text>Tạo ngày {new Date(groupInfo.created_at).toLocaleDateString("vi-VN")}</Text>
                  </div>
                </Space>
              </div>
            </Space>
          </Col>
        </Row>

        <Divider />

        {/* Action Buttons */}
        <Space size="middle">
          <Button
            type="default"
            icon={<TeamOutlined />}
            onClick={() => {
              fetchAcceptedMembers()
              setAcceptedModalOpen(true)
            }}
          >
            Xem thành viên ({groupInfo.member_count})
          </Button>

          {isOwner && (
            <Button
              type="primary"
              icon={<UserOutlined />}
              onClick={() => {
                fetchPendingMembers()
                setPendingModalOpen(true)
              }}
            >
              Yêu cầu tham gia
            </Button>
          )}
        </Space>
      </Card>

      {/* Members Modal */}
      <Modal
        title={`Thành viên nhóm (${acceptedMembers.length})`}
        open={isAcceptedModalOpen}
        onCancel={() => setAcceptedModalOpen(false)}
        footer={null}
        width={800}
      >
        <Table dataSource={acceptedMembers} columns={acceptedColumns} rowKey="id" pagination={false} size="middle" />
      </Modal>

      {/* Pending Requests Modal */}
      <Modal
        title={`Yêu cầu tham gia (${pendingMembers.length})`}
        open={isPendingModalOpen}
        onCancel={() => setPendingModalOpen(false)}
        footer={null}
        width={800}
      >
        <Table dataSource={pendingMembers} columns={pendingColumns} rowKey="id" pagination={false} size="middle" />
        {pendingMembers.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Text type="secondary">Không có yêu cầu tham gia nào</Text>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default GroupDetail
