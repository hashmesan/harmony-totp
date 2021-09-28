import createStore from "redux-zero";
import CONFIG from "../config";

const initialState = {
  environment: localStorage.getItem("environment") || "mainnet0",
  config: CONFIG[localStorage.getItem("environment") || "mainnet0"],
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
  guardians: [
    {
      hns: "tamas-kovacs.crazy.one",
      address: "0xA17DCDD308190a352Bb20b67B98F3122Bf1deD18",
      canRestoreAccount: true,
      canApproveTransaction: false,
      amountOfTransToApprove: 0,
    },
  ],
  friends: [
    {
      hns: "renaissancebank.crazy.one",
      address: "0x95992308694De3574a09F2955B3751a3D6eF2eEB",
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
