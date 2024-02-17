import { combineReducers } from 'redux';

import products from "@redux-store/products";
import users from "@redux-store/users";

export default combineReducers({
  products,
  users
});
