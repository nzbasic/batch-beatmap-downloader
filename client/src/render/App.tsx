import { Menu } from "./components/layout/Menu";
import "./index.css";
import { Query } from "./pages/Query";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Downloads } from "./pages/Downloads";
import { Home } from "./pages/Home";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Status } from "./pages/Status";
import { Changelog } from "./pages/Changelog";
import React from "react";

const App = () => {
  const [version, setVersion] = useState("1.0.0")

  useEffect(() => {
    window.electron.getVersion().then(version => {
      setVersion(version);
    })

    window.electron.listenForErrors((error) => toast.error(error))
  }, []);

  return (
    <HashRouter>
      <div className="flex w-screen">
        <div id="modal" className="absolute top-0 left-0 w-screen h-screen bg-gray-300/30 z-50 flex items-center justify-center hidden" />
        <Menu version={version} />
        <div className="main p-4 overflow-auto overflow-x-hidden h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/query" element={<Query />} />
            <Route
              path="/downloads"
              element={<Downloads />}
            />
            <Route path="/status" element={<Status />} />
            <Route path="/changelog" element={<Changelog />} />
          </Routes>
        </div>
        <ToastContainer autoClose={2500} />
      </div>
    </HashRouter>
  );
};

export default App;
