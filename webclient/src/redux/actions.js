import CONFIG from "../config";

/* actions.js */
const actions = store => ({
    setEnvironment: (state, value)  => {
      localStorage.setItem("environment", value);
      return { environment: value, config: CONFIG[value] };      
    },

    confirmMetasign: (state, message) => {
      return { ...state, showSignModal: true, confirmMessage: message}
    },
    cancelConfirm: (state) =>{
      return {... state, showSignModal: false}
    }
  });
  
export default actions;