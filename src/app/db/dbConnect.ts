import mongoose from "mongoose";


let connected = false;

export async function ensureDbConnect() {
    if (connected) {
        return;
    }
    await mongoose.connect('mongodb+srv://abhay18:lvxpPiCuRe0n2wEF@atlascluster.vmitatq.mongodb.net/faceAlgo?retryWrites=true&w=majority');
    connected = true;
}
