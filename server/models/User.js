const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    uniqueCaseInsensitive: true,
    validate: [/^[a-zA-Z0-9_]+$/, 'Username must contain only Characters, Numbers and Underscores'],
  },
  email: {
    type: String,
    unique: true,
    required: true,
    uniqueCaseInsensitive: true,
    validate: [validator.isEmail, "The email you've entered is invalid, Please try again."],
  },
  password: {
    type: String,
    select: false,
    required: true,
    unique: false,
    minlength: [6, 'Password is too short'],
    maxlength: [100, 'Password is too long'],
    validate: [/^[^ ]+$/],
  },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
}, { timestamps: true });

// UserSchema.pre('save', async function (next) {
//   if (this.isNew) {
//     try {
//       const hashedPassword = await bcrypt.hash(this.password, 10);
//       this.password = hashedPassword;
//       next();
//     } catch (error) {
//       next(error);
//     }
//   }
// });

UserSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

UserSchema.statics.comparePasswords = async (password, hashedPassword) => (
  bcrypt.compare(password, hashedPassword)
);

UserSchema.statics.createUser = async function (userInput) {
  const userExist = await this.findByEmail(userInput.email);

  if (userExist) {
    throw new Error('User already exists.');
  }

  const hashedPassword = await bcrypt.hash(userInput.password, 10);

  const user = new this({
    ...userInput,
    password: hashedPassword,
  });

  return user.save();
};

UserSchema.statics.login = async function (userInput) {
  let user = await this.findByEmail(userInput.email).select('+password');

  if (!user) {
    throw new Error('User does not exists.');
  }

  if (!await this.comparePasswords(userInput.password, user.password)) {
    throw new Error('Incorrect password.');
  }

  user = await user.toJSON();
  console.log(user);
  delete user.password;
  return user;
};

UserSchema.plugin(uniqueValidator, { message: '{PATH} already exists' });

module.exports = mongoose.model('User', UserSchema);
