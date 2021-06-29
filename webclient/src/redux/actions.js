import CONFIG from "../config";

/* actions.js */
const actions = store => ({
    setEnvironment: (state, value)  => ({ environment: value, config: CONFIG[value] }),
  });
  
export default actions;