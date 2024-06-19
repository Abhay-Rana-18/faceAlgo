import mongoose from "mongoose";

const msgSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chat"
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    content: {
        type: String,
        trim: true
    },
    time: {
        type: "String"
    }
});

let Message:any;
try {
    Message = mongoose.model("message");
} catch(e) {
    Message = mongoose.model("message", msgSchema);
}

export {Message};
