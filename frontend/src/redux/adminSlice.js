import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// Async thunk to fetch admin stats
export const fetchAdminStats = createAsyncThunk(
  "admin/fetchStats",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/stats`,
        {
          withCredentials: true,
        }
      )
      console.log(res.data)
      return res.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to fetch admin stats"
      })
  },
})

export default adminSlice.reducer
