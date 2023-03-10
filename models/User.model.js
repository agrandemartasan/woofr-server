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
      maxlength: 20
    },
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
      default:
        "https://res.cloudinary.com/dr2lhtfs8/image/upload/v1678463678/woofr/default-pfp_qqf5kv.jpg"
    },
    info: {
      locationByParish: {
        type: String,
        required: true
      },
      bio: {
        type: String,
        maxlength: 200,
        default: ""
      },
      birthday: {
        type: String,
        required: true
      },
      gender: {
        type: String,
        default: "unspecified",
        enum: ["male", "female", "unspecified"],
        required: true
      },
      breed: {
        type: String,
        default: "unspecified",
        required: true
      },
      isNeuteredOrSpayed: {
        type: Boolean,
        default: false,
        required: true
      },
      isVaccinated: {
        type: Boolean,
        default: false,
        required: true
      },
      isTrained: {
        type: Boolean,
        default: false,
        required: true
      },
      size: {
        type: String,
        default: "unspecified",
        enum: [
          "unspecified",
          "Small (Up to 14 kg)",
          "Medium (Between 14-28kg)",
          "Large (Between 28–42kg)",
          "Extra Large (Over 42kgs)"
        ],
        required: true
      }
    },
    invitesSent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invite"
      }
    ],
    invitesReceived: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invite"
      }
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    chats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
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
