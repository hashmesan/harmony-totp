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
});

export default actions;
