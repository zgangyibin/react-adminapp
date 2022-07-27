import { combineReducers, createStore } from "redux";
// combinReducers合并多个reducer
import userReducer from "./userReducer";

const reducerStore = combineReducers({
  //合并reducer
  user: userReducer,
});
const store = createStore(reducerStore); //创建store
export default store;
