const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    unique: [true, 'Name must be unique.'],
    minlength: [3, 'Name must be at least 3 characters long.'],
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: [true, 'Email must be unique.'],
    match: [
      /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
      'Invalid email address.',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    validate: {
      validator: function (password) {
        return password.length >= 8;
      },
      message: 'Password must be at least 8 characters long.',
    },
  },
  imgUrl: {
    type: String,
    validate: {
      validator: function (value) {
        return validator.isURL(value, {
          protocols: ['http', 'https'],
          require_protocol: true,
        });
      },
      message: 'Invalid profile picture URL.',
    },
  },
  belt: {
    type: Boolean,
  },
  degree: {
    type: Boolean,
  },
  role: {
    type: String,
    required: [true, 'Role is required.'],
    enum: ['teacher', 'student'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('user', userSchema);
