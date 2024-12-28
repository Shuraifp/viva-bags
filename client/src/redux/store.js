import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {persistReducer, persistStore} from "redux-persist";
import storage from "redux-persist/lib/storage";
import cartWishlistReducer from './cartwishlistSlice'

const rootReducer = combineReducers({cartWishlist: cartWishlistReducer })

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['cartWishlist']
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer ,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
})
export const persistor = persistStore(store)