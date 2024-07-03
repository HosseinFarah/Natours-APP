/* eslint-disable */
import axios from "axios";
import {showAlert} from './alerts'

export const deleteTourByAdmin= async tourId=>{
    try {
        const res = await axios({
          method: 'delete',
          url: `http://127.0.0.1:3000/api/v1/tours/${tourId}`,
        });
        if (res.status === 204) {
          showAlert('success', 'Tour Succssfully deleted!');
          window.setTimeout(() => {
            location.reload(true);
          }, 1000);
        }
      } catch (err) {
        console.log(err);
        showAlert('error', err.response.data.message);
      }
}