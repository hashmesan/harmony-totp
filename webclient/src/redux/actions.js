import CONFIG from "../config";

/* actions.js */
const actions = (store) => ({
  setEnvironment: (state, value) => {
    localStorage.setItem("environment", value);
    return { environment: value, config: CONFIG[value] };
  },

  setLocation: (state, value) => ({
    location: value,
  }),

  setOnboardingStep: (state, value) => ({
    onboardingStep: value,
  }),

  setUser: (state, value) => ({
    user: value,
  }),

  setValidity: (state, value) => ({
    formValidity: value,
  }),

  setWallet: (state, value) => ({
    wallet: value,
  }),

  addGuardian: (state, value) => {
    return {
      ...state,
      guardians: [...state.guardians, value],
    };
  },

  setONE: (state, value) => ({
    ONElatestPrice: value,
  }),

  setHoldingTokens: (state, value) => {
    return {
      ...state,
      holdingTokens: [...state.holdingTokens, value],
    };
  },
});

export default actions;
