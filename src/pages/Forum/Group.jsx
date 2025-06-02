"use client"

import { useState, useEffect } from "react"
import { Card, Button, Modal, Form, Input, message, Row, Col, Typography, Space, Tag, Avatar } from "antd"
import { PlusOutlined, EditOutlined, UserOutlined, TeamOutlined, EyeOutlined, ClockCircleOutlined } from "@ant-design/icons"
import { getAllGroups, getGroupsOfLecturer, createGroup } from "../../services/groupService"
import { joinGroup } from "../../services/groupMemberService"
import { useNavigate } from "react-router-dom"

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

const Group = () => {
  const [groups, setGroups] = useState([])
  const [myGroups, setMyGroups] = useState([])
  const [loading, setLoading] = useState(false)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()

  // Lấy role từ localStorage (hoặc có thể từ context/auth)
  const userRole = typeof window !== "undefined" ? localStorage.getItem("role") : null

  useEffect(() => {
    if(userRole === "lecturer") {
      fetchMyGroups()
    }
    fetchGroups()
  }, [userRole])

  const fetchGroups = async () => {
    try {
      setLoading(true)
      const response = await getAllGroups()
      setGroups(response.data.data || [])
    } catch (error) {
      message.error("Không thể tải danh sách nhóm")
    } finally {
      setLoading(false)
    }
  }

  const fetchMyGroups = async () => {
    try {
      const response = await getGroupsOfLecturer()
      setMyGroups(response.data.data || [])
    } catch (error) {
      console.error("Error fetching my groups:", error)
    }
  }

  const handleCreateGroup = async (values) => {
    try {
      await createGroup(values)
      message.success("Tạo nhóm thành công!")
      setCreateModalVisible(false)
      form.resetFields()
      fetchGroups()
      fetchMyGroups()
    } catch (error) {
      message.error("Không thể tạo nhóm")
    }
  }

  const handleJoinGroup = async (groupId) => {
    try {
      await joinGroup(groupId)
      message.success("Đã gửi yêu cầu tham gia nhóm!")
      // Cập nhật trạng thái nhóm đã gửi yêu cầu (nếu bạn muốn)
      setGroups(prev => prev.map(g => g.id === groupId ? { ...g, status: "pending" } : g))
    } catch (error) {
      if (error.response?.status === 400) {
        message.warning("Bạn đã gửi yêu cầu hoặc là thành viên trong nhóm")
      } else {
        message.error("Không thể gửi yêu cầu tham gia")
      }
    }
  }

const handleViewGroup = (group) => {
  const isOwner = isGroupOwnedByLecturer(group.id)
  const isStudent = userRole === "student"

  if (isStudent && group.status !== "accepted") {
    message.warning("Bạn chưa được duyệt vào nhóm này!")
    return
  }

  navigate(`/forum/group/${group.id}`)
}

  // Kiểm tra xem nhóm có thuộc nhóm của giảng viên hiện tại không
  const isGroupOwnedByLecturer = (groupId) => {
    return myGroups.some(g => g.id === groupId)
  }

  const GroupCard = ({ group }) => {
    const isOwner = isGroupOwnedByLecturer(group.id)
    return (
      <Card
        className="group-card"
        hoverable
        style={{
          marginBottom: 16,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
        }}
        bodyStyle={{ padding: "20px" }}
        actions={[
          <Button key="view" type="text" icon={<EyeOutlined />} onClick={() => handleViewGroup(group)}>
            Xem chi tiết
          </Button>,

          // Nếu user là student thì hiện nút tham gia
          userRole === "student" && !isOwner && (
            group.status === "accepted" ? (
              <Button key="joined" disabled type="default" icon={<TeamOutlined />}>
                Đã tham gia
              </Button>
            ) : group.status === "pending" ? (
              <Button key="pending" disabled type="default" icon={<ClockCircleOutlined />}>
                Đã gửi yêu cầu
              </Button>
            ) : (
              <Button key="join" type="primary" icon={<TeamOutlined />} onClick={() => handleJoinGroup(group.id)}>
                Tham gia
              </Button>
            )
          ),

          // Nếu là lecturer mà không phải chủ nhóm thì không hiện nút tham gia (lecturer không join nhóm của người khác)
        ].filter(Boolean)}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <Avatar
            size={64}
            icon={<TeamOutlined />}
            style={{
              backgroundColor: "#1890ff",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Title level={4} style={{ margin: "0 0 8px 0", color: "#1890ff" }}>
              {group.name}
            </Title>
            <Paragraph ellipsis={{ rows: 2, expandable: true }} style={{ margin: "0 0 12px 0", color: "#666" }}>
              {group.description}
            </Paragraph>
            <Space size="middle">
              {isOwner && (
                <Tag color="gold" icon={<UserOutlined />}>
                  Quản trị viên
                </Tag>
              )}
              <Text type="secondary">
                <TeamOutlined /> Nhóm học tập
              </Text>
            </Space>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: 12,
            marginBottom: 24,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
                Quản lý nhóm học tập
              </Title>
              <Text type="secondary">Tham gia và quản lý các nhóm học tập của bạn</Text>
            </div>

            {/* Chỉ show nút tạo nhóm với lecturer */}
            {userRole === "lecturer" && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={() => setCreateModalVisible(true)}
                style={{ borderRadius: 8 }}
              >
                Tạo nhóm mới
              </Button>
            )}
          </div>
        </div>

        {/* Groups Grid */}
        <Row gutter={[16, 16]}>
          {groups.map((group) => (
            <Col xs={24} sm={12} lg={8} key={group.id}>
              <GroupCard group={group} />
            </Col>
          ))}
        </Row>

        {/* Empty State */}
        {groups.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "white",
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <TeamOutlined style={{ fontSize: 64, color: "#d9d9d9", marginBottom: 16 }} />
            <Title level={3} type="secondary">
              Chưa có nhóm nào
            </Title>
            <Text type="secondary">Hãy tạo nhóm đầu tiên để bắt đầu học tập cùng nhau</Text>
          </div>
        )}

        {/* Create Group Modal */}
        <Modal
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <TeamOutlined style={{ color: "#1890ff" }} />
              Tạo nhóm mới
            </div>
          }
          open={createModalVisible}
          onCancel={() => {
            setCreateModalVisible(false)
            form.resetFields()
          }}
          footer={null}
          width={600}
        >
          <Form form={form} layout="vertical" onFinish={handleCreateGroup} style={{ marginTop: 20 }}>
            <Form.Item name="name" label="Tên nhóm" rules={[{ required: true, message: "Vui lòng nhập tên nhóm!" }]}>
              <Input placeholder="Nhập tên nhóm..." size="large" style={{ borderRadius: 8 }} />
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô tả nhóm"
              rules={[{ required: true, message: "Vui lòng nhập mô tả nhóm!" }]}
            >
              <TextArea rows={4} placeholder="Mô tả về mục đích và hoạt động của nhóm..." style={{ borderRadius: 8 }} />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
              <Space>
                <Button
                  onClick={() => {
                    setCreateModalVisible(false)
                    form.resetFields()
                  }}
                >
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" style={{ borderRadius: 8 }}>
                  Tạo nhóm
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>

      <style jsx>{`
        .group-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </div>
  )
}

export default Group
