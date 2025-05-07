import ReactDOM from "react-dom/client"

import { PersistGate } from "redux-persist/integration/react"
import { Toaster } from "./components/ui/sonner.jsx"
import { persistStore } from "redux-persist"
import { Provider } from "react-redux"
import store from "./redux/store.js"
import App from "./App.jsx"
import "./index.css"

let persistor = persistStore(store)

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
      <Toaster />
    </PersistGate>
  </Provider>
)
