import axiosInstance from './axiosInstance';

// Lấy tất cả nhóm
export const getAllGroups = () =>
  axiosInstance.get('/groups');

// Lấy nhóm theo id
export const getGroupById = (groupId) =>
  axiosInstance.get(`/groups/${groupId}`);

// Lấy nhóm của giảng viên
export const getGroupsOfLecturer = () =>
  axiosInstance.get('/groups/lecture');

// Tạo nhóm mới
export const createGroup = (groupData) =>
  axiosInstance.post('/groups', groupData);

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
export const deleteMember = (groupId, userId) =>
  axiosInstance.delete(`/group_member/delete_rejected/${groupId}/${userId}`);