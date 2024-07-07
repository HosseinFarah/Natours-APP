/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const updateReview = async (review, rating, tour, reviewId) => {
  try {
    const res = await axios({
      method: 'Patch',
      url: `/api/v1/reviews/${reviewId}`,
      data: {
        review,
        rating,
        tour,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Review successfully updated!');
      window.setInterval(() => {
        location.reload(true);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const res = await axios({
      method: 'delete',
      url: `/api/v1/reviews/${reviewId}`,
    });
    if (res.status === 204) {
      showAlert('success', 'Review Deleted');
      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const createNewReviewByBookedUser = async (
  review,
  rating,
  tour,
) => {
  try {
    const res = await axios({
      method: 'post',
      url: `/api/v1/reviews/`,
      data: {
        review,
        rating,
        tour
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Review successfully submited!');
      window.setInterval(() => {
        location.reload(true);
      }, 2000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
