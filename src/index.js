import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "antd/dist/antd.css";
import "./index.css";
import Router from "./router";
import store from "./store"; //引入redux里的store
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
