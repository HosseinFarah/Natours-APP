const express = require('express');
const router = express.Router();
const {
  signUp,
  logIn,
  forgotPassword,
  resetPassword,
  updateMyPassword,
  protect,
  updateMe,
  uploadUserImage,
  resizeUploadUserImage,
  deleteMe,
  getMe,
  logOut,
  restrictTo,
} = require('./../controllers/authController');
const {
  getUsers,
  newUser,
  getUser,
  updateUser,
  deleteUser,
  uploadUserPhoto,
  resizeUploadUserPhoto,
} = require('../controllers/userController');
router.get('/me', protect, getMe, getUser);
router.post('/signup', signUp);
router.post('/login', logIn);
router.post('/forgotpassword', forgotPassword);
router.patch('/resetpassword/:tokenId', resetPassword);

router.patch('/updatemypassword', protect, updateMyPassword);
router.patch(
  '/updateme',
  protect,
  uploadUserImage,
  resizeUploadUserImage,
  updateMe,
);
router.delete('/deleteme', protect, deleteMe);
router.get('/logout', logOut);

router
  .route('/')
  .get(protect, restrictTo('admin', 'lead-guide'), getUsers)
  .post(protect, restrictTo('admin'), newUser);
router
  .route('/:id')
  .get(protect, restrictTo('admin'), getUser)
  .patch(
    protect,
    restrictTo('admin'),
    uploadUserPhoto,
    resizeUploadUserPhoto,
    updateUser,
  )
  .delete(protect, restrictTo('admin'), deleteUser);

module.exports = router;
