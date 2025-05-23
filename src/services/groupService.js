import axios from 'axios';

const API_BASE = 'http://localhost:3009/api/groups';

const getToken = () => localStorage.getItem('token');

export const getAllGroups = () =>
  axios.get(API_BASE, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });

export const createGroup = (groupData) =>
  axios.post(API_BASE, groupData, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
