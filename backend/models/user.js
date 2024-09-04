import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  uniqueId: { type: String, unique: true },
  role: {
    type: String,
    enum: ['user', 'admin', 'telecaller'],
    default: "user",
    immutable: true,
  },
  createdAt: {
    type: Date, 
    // luxury@zprincesssaffron.com
    default: Date.now,
  },
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
