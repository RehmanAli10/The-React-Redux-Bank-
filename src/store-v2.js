import { createStore } from "redux";
import accountReducer from "./features/account/accountSlice";
import cutomerReducer from "./features/customer/customerSlice";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  customer: cutomerReducer,
  account: accountReducer,
});

const store = createStore(rootReducer);

export { store };
