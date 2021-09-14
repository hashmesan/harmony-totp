import { initializeApp } from "firebase/app";
import "firebase/auth";

import { CONFIG } from "./config";
const { firebaseConfig } = CONFIG;

console.log("config: ", firebaseConfig);

export const app = initializeApp(firebaseConfig);
export const auth = app.auth();
const db = app.firestore();
