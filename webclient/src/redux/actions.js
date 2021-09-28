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
  updateGuardian: (state, value) => {
    const index = state.guardians.findIndex(
      (guardian) => guardian.hns == value.hns
    );
    const tempArray = [...state.guardians];
    tempArray[index] = value;
    return {
      ...state,
      guardians: tempArray,
    };
  },
  deleteGuardian: (state, value) => {
    return {
      ...state,
      guardians: state.guardians.filter(({ hns }) => hns !== value.hns),
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

  addFriend: (state, value) => {
    return {
      ...state,
      friends: [...state.friends, value],
    };
  },
  deleteFriend: (state, value) => {
    return {
      ...state,
      friends: state.friends.filter(({ hns }) => hns !== value.hns),
    };
  },

  addFundingSource: (state, value) => {
    return {
      ...state,
      fundingSources: [...state.fundingSources, value],
    };
  },
  updateFundingSource: (state, value) => {
    const index = state.fundingSources.findIndex(
      (fundingSource) => fundingSource.uid == value.uid
    );
    const tempArray = [...state.fundingSources];
    tempArray[index] = value;
    return {
      ...state,
      fundingSources: tempArray,
    };
  },
  deleteFundingSource: (state, value) => {
    return {
      ...state,
      fundingSources: state.fundingSources.filter(
        ({ uid }) => uid !== value.uid
      ),
    };
  },
});

export default actions;
