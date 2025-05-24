import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const BASE_URL = "api/v1/notifications"

// Get current user's ID from your auth slice or pass as param to thunk
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/${BASE_URL}/${userId}`,
        {
          withCredentials: true,
        }
      )
      console.log(data)
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch notifications"
      )
    }
  }
)

export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (notifId, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/${BASE_URL}/${notifId}`,
        {
          withCredentials: true,
        }
      )
      return notifId
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to delete notification"
      )
    }
  }
)

export const markNotificationRead = createAsyncThunk(
  "notifications/markRead",
  async (notifId, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/${BASE_URL}/read/${notifId}`,
        {
          withCredentials: true,
        }
      )
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to mark as read")
    }
  }
)

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (userId, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState()
      const unreadNotifs = state.notifications.items.filter((n) => !n.isRead)
      const requests = unreadNotifs.map((n) =>
        axios.patch(
          `${import.meta.env.VITE_BASE_URL}/${BASE_URL}/read/${n._id}`,
          {
            withCredentials: true,
          }
        )
      )

      await Promise.all(requests)
      // Refetch or update local state manually
      dispatch(fetchNotifications(userId))
    } catch (err) {
      return rejectWithValue("Failed to mark all as read")
    }
  }
)

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.items = state.items.filter((n) => n._id !== action.payload)
      })

      // Mark one as read
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const idx = state.items.findIndex((n) => n._id === action.payload._id)
        if (idx !== -1) {
          state.items[idx] = action.payload
        }
      })
  },
})

export default notificationSlice.reducer
