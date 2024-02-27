import mongoose, { Schema } from "mongoose";

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      require: true,
    },
    phone: {
      type: Number,
      require: false,
    },
    full_name: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: false,
    },
    whatsapp: {
      type: Number,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    profile_image: {
      type: String,
      require: false,
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
