import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";

import { PersistedStore } from "./store/store";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={PersistedStore.getStore()}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
