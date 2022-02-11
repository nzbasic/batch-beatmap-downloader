/**
 * This file will automatically be loaded by electron and run in the "renderer" context with no access to Node.js APIs (except thru the contextBridge).
 * This is your "frontend"
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 */

import ReactDOM from "react-dom";
import App from "./render/App";
import "./render/index.css";

function render() {
  ReactDOM.render(App(), document.getElementById("root"));
}

render();
