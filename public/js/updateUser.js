/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const adminController = async (userId, data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/${userId}`,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'User Updated.');
      window.setTimeout(() => {
        location.reload(true);
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const DeleteUserByAdmin = async (userId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/users/${userId}`,
    });
    if (res.status === 204) {
      showAlert('success', 'User deleted!');
      window.setTimeout(() => {
        location.reload(true);
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
