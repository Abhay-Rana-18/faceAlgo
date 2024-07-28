import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
    value: chatData;
}
type chatData = {
    chatName: string,
    users: Array<any>
}

const initialState: InitialState = {
    value: {
        chatName: "",
        users: []
    }
};

export const chats = createSlice({
    name: "chats",
    initialState,
    reducers: {
        
    }
});