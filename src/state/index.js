import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import blockReducer from "./block";

const store = configureStore({
  devTools: process.env.NODE_ENV !== "production",
  reducer: {
    block: blockReducer,
  },
});

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export const useAppDispatch = () => useDispatch();

export default store;
