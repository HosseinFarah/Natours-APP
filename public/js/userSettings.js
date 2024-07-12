/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const userSettings = async (type, data) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updatemypassword'
        : '/api/v1/users/updateme';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type} successfully updated`);
      window.setTimeout(() => {
        location.reload(true);
      }, 500);
    }
  } catch (err) {
    showAlert('danger', err.response.data.message);
  }
};

export const forgetPassword = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotpassword',
      data: {
        email,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', `Reset password link successfuly sent to ${email}`);
      window.setInterval(() => {
        location.assign('/login');
      }, 1000);
    }
  } catch (err) {
    showAlert('danger', err.response.data.message);
  }
};

export const resetPassword = async (data, tokenId) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetpassword/${tokenId}`,
      data,
    });
    if (res.data.status === 'success') {
      showAlert(
        'success',
        'Password Successfully updated! Log in to site automatically',
      );
      window.setTimeout(() => {
        location.reload(true);
        location.assign('/me');
      }, 1500);
    }
  } catch (err) {
    showAlert('danger', err.response.data.message);
  }
};

export const createNewUserByAdmin = async (data) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/users/',
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'User Successfully added');
      windows.setTimeout(() => {
        location.reload(true);
      }, 2000);
    }
  } catch (err) {
    showAlert('danger', err.response.data.message);
  }
};
