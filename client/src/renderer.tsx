/**
 * This file will automatically be loaded by electron and run in the "renderer" context with no access to Node.js APIs (except thru the contextBridge).
 * This is your "frontend"
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 */

import React from "react";
import ReactDOM from "react-dom";
import App from "./render/App";
import DownloadsProvider from "./render/context/DownloadProvider";
import SettingsProvider from "./render/context/SettingsProvider";
import StatusProvider from "./render/context/StatusProvider";
import "./render/index.css";

function render() {
  ReactDOM.render(
    <StatusProvider>
      <DownloadsProvider>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </DownloadsProvider>
    </StatusProvider>,
    document.getElementById("root")
  );
}

render();
