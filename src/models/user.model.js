const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    nickName: {
      type: String,
      default: null,
      required: true,
    },
    email: {
      type: String,
      default: null,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    role: {
      type: String,
      required: true,
      default:'user',
      enum:['user','admin']
    },
    active: {
      type: Boolean,
      default: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {timestamps: true,}
);
module.exports = mongoose.model("User", userSchema);
