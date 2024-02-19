import { combineReducers } from 'redux';

import interests from "@redux-store/interests";
import products from "@redux-store/products";
import users from "@redux-store/users";

export default combineReducers({
  products,
  users,
  interests
});
