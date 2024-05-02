import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
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
    
});

let User: any;
try {
  User = mongoose.model('users')
} catch (error) {
  User = mongoose.model('users', userSchema);
}

// export const User = mongoose.model('User', userSchema);
export {User};