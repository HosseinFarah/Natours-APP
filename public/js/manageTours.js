/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const deleteTourByAdmin = async (tourId) => {
  try {
    const res = await axios({
      method: 'delete',
      url: `/api/v1/tours/${tourId}`,
    });
    if (res.status === 204) {
      showAlert('success', 'Tour Succssfully deleted!');
      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
    }
  } catch (err) {
    showAlert('danger', err.response.data.message);
  }
};

export const createNewTour = async (
  name,
  duration,
  maxGroupSize,
  difficulty,
  price,
  summary,
  description,
  imageCover,
  images,
  startLocation,
  startDates,
  locations
) => {
  try {
    const form = new FormData()
    form.append('imageCover',imageCover)

    const res = await axios({
      method: 'POST',
      url: '/api/v1/tours',
      data: {
        name,
        duration,
        maxGroupSize,
        difficulty,
        price,
        summary,
        description,
        imageCover:form,
        images,
        startDates,
        startLocation,
        locations
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Tour Successfully Added');
      window.setTimeout(() => {
        location.assign('/manage-tours');
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert('danger', err.response.data.message);
  }
};
