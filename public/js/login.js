/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
export const logIn = async (email, password) => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
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
    showAlert('error', err.response.data.message);
  }
};
export const logOut = async () => {
  try {
    const res = await axios({
      method: 'get',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Successfully loged out!');
      window.setTimeout(() => {
        location.reload(true);
        location.assign('/')
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

export const signUp =async (data)=>{
  try {
    const res = await axios({
      method: 'post',
      url: 'http://127.0.0.1:3000/api/v1/users/signup',
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
    console.log(err);
    showAlert('error', err.response.data.message);
  }
}