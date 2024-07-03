const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name must have a value!'],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email must have a value!'],
    validate: [validator.isEmail, 'Please Enter valid email format!'],
  },
  password: {
    type: String,
    minlength: [8, 'Password must have at least 8 characters'],
    required: [true, 'Password must have a value!'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Password confirmation must have a value!'],
    minlength: [8, 'Password confirmation must have at least 8 characters'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Password must be the same!',
    },
    select: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    default: 'user',
    enum: {
      values: ['admin', 'lead-guide', 'guide', 'user'],
    },
    message: 'Invalid Role!',
  },
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next;
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.methods.isPasswordCorrect = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 2000;
  next();
});
userSchema.methods.isPasswordChanged = function (jwtTimeStamp) {
  if (this.passwordChangedAt) {
    const passwordChangedAtTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return jwtTimeStamp <= passwordChangedAtTimeStamp;
  }
  return false;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
