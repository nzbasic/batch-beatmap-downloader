import { Menu } from "./components/Menu";
import "./index.css";
import { Query } from "./pages/Query";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Downloads } from "./pages/Downloads";
import { Home } from "./pages/Home";
import { useEffect, useState } from "react";
import { DownloadStatus } from "../models/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>(null);

  useEffect(() => {
    window.electron.getSettings().then((res) => {
      const mode = res.darkMode as boolean;
      document.documentElement.classList.toggle("dark", mode);
    });
    window.electron.listenForDownloads((status) => setDownloadStatus(status));
    window.electron.listenForErrors((error) => toast.error(error))
  }, []);

  return (
    <HashRouter>
      <div className="flex w-screen">
        <Menu downloadStatus={downloadStatus} />
        <div className="main p-4 overflow-auto overflow-x-hidden h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/query" element={<Query />} />
            <Route
              path="/downloads"
              element={<Downloads downloadStatus={downloadStatus} />}
            />
          </Routes>
        </div>
        <ToastContainer autoClose={1000} />
      </div>
    </HashRouter>
  );
};

export default App;
