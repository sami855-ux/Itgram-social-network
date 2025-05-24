import { createSlice } from "@reduxjs/toolkit"

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    onlineUsers: [],
    messages: [],
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload
    },
    setMessages: (state, action) => {
      state.messages = action.payload
    },
    // Add this new reducer for deleting messages
    deleteMessage: (state, action) => {
      state.messages = state.messages.filter(
        (message) => message._id !== action.payload
      )
    },
  },
})

// Export the new action
export const { setOnlineUsers, setMessages, deleteMessage } = chatSlice.actions
export default chatSlice.reducer
