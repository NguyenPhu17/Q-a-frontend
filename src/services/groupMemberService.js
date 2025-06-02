import axiosInstance from './axiosInstance';

// Gửi yêu cầu tham gia nhóm
export const joinGroup = (groupId) =>
  axiosInstance.post('/group_member/join_group', { groupId });

// Lấy danh sách thành viên chờ duyệt
export const getPendingMembers = (groupId) =>
  axiosInstance.get(`/group_member/pending_member/${groupId}`);

// Lấy danh sách thành viên đã duyệt
export const getAcceptedMembers = (groupId) =>
  axiosInstance.get(`/group_member/accepted_member/${groupId}`);

// Cập nhật trạng thái thành viên (accepted/rejected)
export const updateMemberStatus = (groupId, userId, status) =>
  axiosInstance.put(`/group_member/update_accepted/${groupId}`, {
    userId,
    status,
  });

// Xóa thành viên (hoặc xóa yêu cầu bị từ chối)
export const deleteMember = (userId) =>
  axiosInstance.delete(`/group_member/delete_rejected/${userId}`);

// Lấy thông tin nhóm theo id (giả sử đã có)
export const getGroupById = (groupId) =>
  axiosInstance.get(`/groups/${groupId}`);