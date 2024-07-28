import mongoose, { Model, ObjectId } from 'mongoose';

export interface IUser extends Document {
  _id: ObjectId,
  email: string;
  password: string;
  gender: string;
  imageUrl: string;
  // Add other fields as necessary
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "admin",
  },
  email: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["single", "relationship", "married"],
  },
  password: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true
  },
  imageUrl: {
    type: String,
    require: true
  },
  description: {
    type: String,
    default: "",
  }
});

let User: Model<IUser>;
try {
  User = mongoose.model<IUser>("users");;
} catch (error) {
  User = mongoose.model<IUser>('users', userSchema);
}

// export const User = mongoose.model('User', userSchema);
export { User };