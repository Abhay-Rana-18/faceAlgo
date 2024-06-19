import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    chatName: {
        type: String,
        required: true,
        trim: true
    },
    users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
      ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message'
    }
});

let Chat:any;
try {
    Chat = mongoose.model("chat");
} catch(e) {
    Chat = mongoose.model("chat", chatSchema);
}

export {Chat};
