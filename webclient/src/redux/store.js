import createStore from "redux-zero";
import CONFIG from "../config";

const initialState = { environment: "mainnet0", config: CONFIG["mainnet0"]};
const store = createStore(initialState);

export default store;

