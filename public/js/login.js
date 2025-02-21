/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
export const logIn = async (email, password) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', `Successfully logged in!`);
      window.setTimeout(() => {
        location.assign('/');
      }, 2000);
    }
  } catch (err) {
    showAlert('danger', err.response.data.message);
  }
};
export const logOut = async () => {
  try {
    const res = await axios({
      method: 'get',
      url: '/api/v1/users/logout',
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Successfully loged out!');
      window.setTimeout(() => {
        location.reload(true);
        location.assign('/')
      }, 1500);
    }
  } catch (err) {
    showAlert('danger', err.response.data.message);
  }
};

export const signUp =async (data)=>{
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/users/signup',
      data
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Account created successfully! You will enter the site automatically');
      window.setTimeout(() => {
        location.reload(true);
        location.assign('/me')
      }, 1500);
    }
  } catch (err) {
    showAlert('danger', err.response.data.message);
  }
}