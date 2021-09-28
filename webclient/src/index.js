import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { Provider } from "redux-zero/react";
import store from "./redux/store";

import AccountProvider from "./context/SmartvaultContext";
import { AuthProvider } from "./context/FirebaseAuthContext";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

import "./custom.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import bootstrap from "bootstrap";

Number.prototype.toFixedNoRounding = function (n) {
  const reg = new RegExp("^-?\\d+(?:\\.\\d{0," + n + "})?", "g");
  const a = this.toString().match(reg)[0];
  const dot = a.indexOf(".");
  if (dot === -1) {
    // integer, insert decimal dot and pad up zeros
    return a + "." + "0".repeat(n);
  }
  const b = n - (a.length - dot) + 1;
  return b > 0 ? a + "0".repeat(b) : a;
};

const sushiGraphClient = new ApolloClient({
  uri: "https://sushi.graph.t.hmny.io/subgraphs/name/sushiswap/harmony-exchange",
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={sushiGraphClient}>
      <AuthProvider>
        <AccountProvider>
          <App />
        </AccountProvider>
      </AuthProvider>
    </ApolloProvider>
  </Provider>,
  document.getElementById("container")
);
