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
import { Status } from "./pages/Status";

const App = () => {
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>(null);
  const [version, setVersion] = useState("1.0.0")

  useEffect(() => {
    window.electron.getVersion().then(version => {
      setVersion(version);
    })

    window.electron.getDownloadStatus().then(res => {
      setDownloadStatus(res)
    })

    window.electron.getSettings().then((res) => {
      const mode = res.darkMode as boolean;
      if (mode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    });
    window.electron.listenForDownloads((status) => setDownloadStatus(status));
    window.electron.listenForErrors((error) => toast.error(error))
  }, []);

  return (
    <HashRouter>
      <div className="flex w-screen">
        <Menu version={version} downloadStatus={downloadStatus} />
        <div className="main p-4 overflow-auto overflow-x-hidden h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/query" element={<Query />} />
            <Route
              path="/downloads"
              element={<Downloads downloadStatus={downloadStatus} />}
            />
            <Route path="/status" element={<Status />} />
          </Routes>
        </div>
        <ToastContainer autoClose={2500} />
      </div>
    </HashRouter>
  );
};

export default App;
