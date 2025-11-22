import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import ingredientsReducer from './slices/ingredientsSlice/ingredientsSlice';
import burgerConstructorReducer from './slices/burgerConstructorSlice/burgerConstructorSlice';
import orderReducer from './slices/orderSlice/orderSlice';
import ordersFeedReducer from './slices/ordersFeed/ordersFeedSlice';
import profileOrdersReducer from './slices/profileOrdersSlice/profileOrdersSlice';
import userReducer from './slices/userSlice/userSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  order: orderReducer,
  feed: ordersFeedReducer,
  profileOrders: profileOrdersReducer,
  user: userReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
