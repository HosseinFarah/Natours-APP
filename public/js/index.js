/* eslint-disable */
import { logIn, logOut, signUp } from './login';
import { userSettings, forgetPassword, resetPassword } from './userSettings';
import { adminController, DeleteUserByAdmin } from './updateUser';
import { showMap } from './mapbox';
import { bookTour } from './bookTour';
import { deleteReview, updateReview } from './myReviews';
import { deleteReviewsByAdmin } from './manageReviews';
import { deleteBooking } from './manageBookings';
import { deleteTourByAdmin } from './manageTours';

//signup
const signupForm = document.querySelector('.form--signUp');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const data = {
      name,
      email,
      password,
      passwordConfirm,
    };
    document.querySelector('.btn--signup').textContent = 'Processing ...';
    await signUp(data);
    document.getElementById('password').value = '';
    document.getElementById('passwordConfirm').value = '';
    document.querySelector('.btn--signup').textContent = 'Signup';
  });
}

//logIN
const loginForm = document.querySelector('.form-login');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--login').textContent = 'Processing ...';
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    await logIn(email, password);
    document.querySelector('.btn--login').textContent = 'Login';
  });
}

//forgetPassword
const forgetPasswordForm = document.querySelector('.form--forgotpassword');
if (forgetPasswordForm) {
  forgetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    document.querySelector('.btn--forgotpassword').textContent =
      'Processing ...';
    await forgetPassword(email);
    document.querySelector('.btn--forgotpassword').textContent =
      'Send reset link';
  });
}
//resetPassword
const resetPasswordForm = document.querySelector('.form--resetpassword');
if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const tokenId = document.getElementById('token').innerHTML;
    const data = {
      password,
      passwordConfirm,
    };
    await resetPassword(data, tokenId);
  });
}

//logOut
const logOutBtn = document.querySelector('.nav__el--logout');
if (logOutBtn) {
  logOutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    await logOut();
  });
}

//userSettings
//user-Data
const userDataForm = document.querySelector('.form-user-data');
if (userDataForm) {
  userDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn-data').textContent = 'Updatting ...';
    const data = new FormData();
    data.append('name', document.getElementById('name').value);
    data.append('email', document.getElementById('email').value);
    data.append('photo', document.getElementById('photo').files[0]);
    await userSettings('data', data);
    document.querySelector('.btn-data').textContent = 'Save settings';
  });
}

//user-Password
const userPasswordForm = document.querySelector('.form-user-password');
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn-password').textContent = 'Updatting ...';
    const currentPassword = document.getElementById('currentPassword').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const data = {
      currentPassword,
      password,
      passwordConfirm,
    };
    await userSettings('password', data);
    document.getElementById('currentPassword').value = '';
    document.getElementById('password').value = '';
    document.getElementById('passwordConfirm').value = '';
    document.querySelector('.btn-password').textContent = 'Save password';
  });
}

//ADMIN controllers
//update User by ADMIN
const userInfoForm = document.querySelector('.form-user-info');
if (userInfoForm) {
  userInfoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', document.getElementById('name').value);
    data.append('role', document.getElementById('role').value);
    data.append('email', document.getElementById('email').value);
    data.append('photo', document.getElementById('photo').files[0]);
    const userId = document.getElementById('userId').innerHTML;
    await adminController(userId, data);
  });
}
// delete User by ADMIN
const deleteUserBtns = document.querySelectorAll('.table-link.danger');
deleteUserBtns.forEach((deleteBtn) => {
  if (deleteBtn) {
    deleteBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const confirmed = confirm('Are you sure you want to delete this user?');
      const { userId } = e.target.closest('.table-link.danger').dataset;
      if (confirmed) {
        await DeleteUserByAdmin(userId);
      }
    });
  }
});

// Delete review by ADMIN

const reviewsBtn = document.querySelectorAll('.table-delete-review');
reviewsBtn.forEach((reviewBtn) => {
  if (reviewBtn) {
    reviewBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const { reviewId } = e.target.closest('.table-delete-review').dataset;
      const confirmation = confirm(
        'Are you sure you want to delete this review?',
      );
      if (confirmation) {
        await deleteReviewsByAdmin(reviewId);
      }
    });
  }
});

// Delete Booking by ADMIN

const getBookingDelBtns = document.querySelectorAll('.table-booking-delete');
getBookingDelBtns.forEach((delBtn) => {
  if (delBtn) {
    delBtn.addEventListener('click', async (e) => {
      const { bookingId } = e.target.closest('.table-booking-delete').dataset;
      const confirmation = confirm('Are you sure to delete this booking?');
      if (confirmation) {
        await deleteBooking(bookingId);
      }
    });
  }
});

//Delete Tour by ADMIN
const deletTourBtns = document.querySelectorAll('.table-tour-delete');
deletTourBtns.forEach((btn) => {
  if (btn) {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const { tourId } = e.target.closest('.table-tour-delete').dataset;
      const confirmation = confirm('Are you sure to delete this tour?');
      if (confirmation) {
        await deleteTourByAdmin(tourId);
      }
    });
  }
});

// book a Tour

const bookTourBtn = document.getElementById('book-tour');
if (bookTourBtn) {
  bookTourBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const { tourId } = e.target.dataset;
    e.target.textContent = 'Proccessing ...';
    await bookTour(tourId);
  });
}
// update Review
const reviewForm = document.querySelector('.review-info');
console.log(reviewForm);
if (reviewForm) {
  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn-review').textContent = 'Updatting ...';
    const review = document.getElementById('review').value;
    console.log(review);
    const rating = document.getElementById('rating').value;
    const reviewId = document.getElementById('reviewId').innerHTML;
    const tour = document.getElementById('tourId').innerHTML;
    await updateReview(review, rating, tour, reviewId);
    document.querySelector('.btn-review').textContent = 'Save';
  });
}

// Delete Review

const deleteReviewBtns = document.querySelectorAll('.table-link.review');
deleteReviewBtns.forEach((deleteBtn) => {
  if (deleteBtn) {
    deleteBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const { reviewId } = e.target.closest('.table-link.review').dataset;
      const confirmation = confirm(
        'Are you sure you want to delete this review?',
      );
      if (confirmation) {
        await deleteReview(reviewId);
      }
    });
  }
});

//showMap
const locations = JSON.parse(
  document.querySelector('.map-data').dataset.locations,
);
if (locations) {
  showMap(locations);
}
