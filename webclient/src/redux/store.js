import createStore from "redux-zero";
import CONFIG, { getLocalWallet } from "../config";
import SmartVault from "../../../lib/smartvault_lib";

const environment = localStorage.getItem("environment") || "mainnet0";
const wallet = JSON.parse(getLocalWallet(environment, false)) || {};

// TODO: Make sure state is stored for next session - continuing for example onboarding
const initialState = {
  environment: environment,
  config: CONFIG[environment],
  location: "landing",
  onboardingStep: 1,
  user: {
    userName: "",
    userPassword: "",
    userEmail: "",
    userCountryOfResidence: "",
  },
  formValidity: {
    name: false,
    password: null,
    email: null,
    countryOfResidence: null,
    emailOTP: null,
    TOTP: null,
    step1: null,
    step2: null,
  },
  guardians: wallet.guardians || [],
  friends: wallet.friends || [],
  fundingSources: [
    {
      type: "bank",
      name: "UBS Personal Account",
      uid: "CH 28 001 940064475000CH 28 001 9400644750000",
      limit: 100000,
      ccy: "CHF",
      owner: "nobankuser1",
    },
    {
      type: "wallet",
      name: "Harmony ONE wallet",
      uid: "one1qrgrp4mcdt8ha2kfn7m7tph5udv2j576qd2eun",
      limit: 5000,
      ccy: "ONE",
      owner: "nobankuser1",
    },
  ],
  fundingSources: [
    {
      type: "bank account",
      name: "UBS Personal Account",
      uid: "CH 28 001 940064475000CH 28 001 9400644750000",
      limit: 100000,
      ccy: "CHF",
      owner: "nobankuser1",
    },
    {
      type: "crypto wallet",
      name: "Harmony ONE wallet",
      uid: "one1qrgrp4mcdt8ha2kfn7m7tph5udv2j576qd2eun",
      limit: 5000,
      ccy: "ONE",
      owner: "nobankuser1",
    },
  ],
  wallet: {
    isAvailable: null,
    error: "",
    rentPrice: null,
  },
  ONElatestPrice: null,
  holdingTokens: [],
};

const store = createStore(initialState);

export default store;
