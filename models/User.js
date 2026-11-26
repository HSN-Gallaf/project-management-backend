const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email address"],
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "manager", "user"],
      default: "user",
    },
    profileImage: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
