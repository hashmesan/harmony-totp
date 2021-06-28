import createStore from "redux-zero";

const initialState = { environment: "mainnet0" };
const store = createStore(initialState);

export default store;

