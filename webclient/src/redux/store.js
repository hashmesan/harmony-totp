import createStore from "redux-zero";
import CONFIG from "../config";

const initialState = {
  environment: localStorage.getItem("environment") || "mainnet0",
  config: CONFIG[localStorage.getItem("environment") || "mainnet0"],
  location: "",
  onboardingStep: null,
  user: {
    userName: "",
    userPassword: "",
    userEmail: "",
    userCountryOfResidence: "",
  },
};

const store = createStore(initialState);

export default store;
