import { combineReducers } from 'redux';

import interests from "@redux-store/interests";
import investmentList from "@redux-store/investments-list";
import stakeholders from "@redux-store/stakeholders";
import users from "@redux-store/users";

export default combineReducers({
  users,
  interests,
  stakeholders,
  investmentList
});
