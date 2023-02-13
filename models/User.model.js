const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "Username is required"],
      unique: true,
      minlength: 4,
      maxlength: 20,
      match: [
        /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]$/,
        "Usernames can contain characters a-z, 0-9, underscores and periods. The username cannot start with a period nor end with a period. It must also not have more than one period sequentially."
      ]
    },
    userType: String,
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."]
    },
    password: {
      type: String,
      required: [true, "Password is required"]
    },
    profilePicture: {
      type: String,
      default: ""
    },
    info: {
      bio: {
        type: String,
        maxlength: 200,
        default: ""
      },
      birthday: {
        type: Date
      },
      gender: {
        type: String,
        default: "unspecified",
        enum: ["male", "female", "unspecified"]
      }
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    dateJoined: {
      type: Date,
      default: Date.now,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
