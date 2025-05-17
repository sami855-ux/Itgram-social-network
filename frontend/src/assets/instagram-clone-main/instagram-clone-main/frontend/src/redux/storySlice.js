import { createSlice } from "@reduxjs/toolkit"

const storySlice = createSlice({
  name: "story",
  initialState: {
    stories: [],
  },
  reducers: {
    setStory: (state, action) => {
      state.stories = action.payload
    },
  },
})

export const { setStory } = storySlice.actions
export default storySlice.reducer
