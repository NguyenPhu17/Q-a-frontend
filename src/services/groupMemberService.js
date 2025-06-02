import axios from 'axios';
import axiosInstance from './axiosInstance';

export const joinGroup = (groupId) =>
  axiosInstance.post('/group_member/join_group', {
    groupId: groupId  
  });

export const getPendingMembers = (groupId) =>
  axios.get(`/api/group_member/pending_member/${groupId}`);

export const getAcceptedMembers = (groupId) =>
  axios.get(`/api/group_member/accepted_member/${groupId}`);

export const updateMemberStatus = (groupId, userId, accepted) =>
  axios.put(`/api/group_member/update_accepted/${groupId}`, {
    user_id: userId,
    accepted,
  });

export const deleteMember = (userId) =>
  axios.delete(`/api/group_member/delete_rejected/${userId}`);
