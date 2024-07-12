/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51PVU58BSDGsdvPKiqS5EKajjHNNwIXC7SqhpsN2Sjq06Qo4179gm4JBXaLjlegpgj7lCVisN9VJudm0rCisSgvF500pkWadjMw',
);

export const bookTour = async (tourId) => {
  try {
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`,
    );
    await stripe.redirectToCheckout({
      sessionId: session.data.data.session.id,
    });
  } catch (err) {
    showAlert('danger', err);
  }
};
