// import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from 'redux-thunk';
// import {AuthReducer,loginSlice} from "./login/reducer";
import AuthReducer from "./login/reducer";
import { composeWithDevTools } from "redux-devtools-extension"
import { configureStore,combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer,createTransform } from 'redux-persist'
import storage from 'redux-persist/lib/storage/session'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { encryptTransform } from 'redux-persist-transform-encrypt';

const persistConfig = {
  key: 'root',
  storage,
  transforms:[
    encryptTransform({
      secretKey: process.env.REACT_APP_KEY || "",
      onError: function (error) {
        // Handle the error.
      },
    }),
  ]
}

// const store = configureStore({
//   reducer: {
//     AuthReducer: AuthReducer,
//   },
// })
const rootReducer = combineReducers({ 
  AuthReducer: AuthReducer,
  // stateReconciler: hardSet
})


const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})

export const persistor = persistStore(store)
// export store;