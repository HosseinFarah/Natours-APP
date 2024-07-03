/* eslint-disable */
import axios from "axios";
import {showAlert} from './alerts.js'

export const deleteBooking=async bookingId=>{
    try {
        const res = await axios({
          method: 'delete',
          url: `http://127.0.0.1:3000/api/v1/bookings/${bookingId}`,
        });
        if (res.status === 204) {
          showAlert('success', 'Review Succssfully deleted!');
          window.setTimeout(() => {
            location.reload(true);
          }, 1000);
        }
      } catch (err) {
        showAlert('error', err.response.data.message);
      }
}