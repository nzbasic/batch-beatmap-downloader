/**
 * This file will automatically be loaded by electron and run in the "preload-scripts" context with Node.js API access (even though its in the renderer).
 * This is your "priveleged entry to frontend"
 * To learn more about the differences between the "preload-scripts" and the "renderer" context in
 * Electron, visit:
 *
 * https://www.electronjs.org/docs/tutorial/process-model#preload-scripts
 */

import "./bridges/main";
