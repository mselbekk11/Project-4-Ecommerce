import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // name of the user
    email: { type: String, required: true, unique: true }, // email of the user
    password: { type: String, required: true }, // password of the user
    isAdmin: { type: Boolean, required: true, default: false }, // if the user is an admin
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  // compare entered password with the hashed password
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  // if the password is not modified, move on
  if (!this.isModified('password')) {
    next();
  }

  // if the password is modified, hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
