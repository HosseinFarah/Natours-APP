/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const deleteReviewsByAdmin = async (reviewId) => {
  try {
    const res = await axios({
      method: 'delete',
      url: `/api/v1/reviews/${reviewId}`,
    });
    if (res.status === 204) {
      showAlert('success', 'Review Succssfully deleted!');
      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
    }
  } catch (err) {
    showAlert('danger', err.response.data.message);
  }
};
