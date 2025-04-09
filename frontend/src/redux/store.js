import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { createTransform } from "redux-persist"
import authSlice from "./authSlice.js"
import postSlice from "./postSlice.js"
import socketSlice from "./socketSlice.js"
import chatSlice from "./chatSlice.js"
import rtnSlice from "./rtnSlice.js"
import storySlice from "./storySlice.js"

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"
import storage from "redux-persist/lib/storage"

const socketTransform = createTransform(
  (inboundState, key) => {
    if (key === "socketio") {
      const { socket, ...rest } = inboundState
      return rest
    }
    return inboundState
  },
  (outboundState) => outboundState,
  { whitelist: ["socketio"] }
)

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  transforms: [socketTransform],
}

const rootReducer = combineReducers({
  auth: authSlice,
  post: postSlice,
  socketio: socketSlice,
  chat: chatSlice,
  realTimeNotification: rtnSlice,
  story: storySlice,
})

// Transform to remove `socket` before persisting

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          "socketio/setSocket",
        ],
        ignoredPaths: [
          "socketio.socket", // ignore this part of state
        ],
      },
    }),
})
export default store
