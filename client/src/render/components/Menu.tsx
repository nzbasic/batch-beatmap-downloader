import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/bbd.svg";
import HomeIcon from "@mui/icons-material/Home";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import StorageIcon from '@mui/icons-material/Storage';
import HistoryIcon from '@mui/icons-material/History';
import { DownloadStatus } from "../../models/api";

interface PropTypes {
  downloadStatus: DownloadStatus;
  version: string
}

export const Menu = ({ version, downloadStatus }: PropTypes) => {
  const { pathname } = useLocation();

  const closeApp = () => {
    window.electron.quit();
  };

  const pages = [
    { link: "/", title: "Home", icon: <HomeIcon /> },
    { link: "/query", title: "Map Search", icon: <SearchIcon /> },
    { link: "/downloads", title: "Downloads", icon: <DownloadIcon /> },
    { link: "/status", title: "Server Status", icon: <StorageIcon /> },
    { link: "/changelog", title: "Change Log", icon: <HistoryIcon /> }
  ];

  return (
    <div
      id="menu"
      className="w-52 flex flex-col h-screen bg-monokai-light text-white dark:bg-monokai-dark shadow"
    >
      <img className="m-4" src={Logo} />
      <div className="text-sm self-center items-center flex flex-col">
        <span className="">Batch Beatmap Downloader</span>
        <span>by nzbasic</span>
        <span className="text-xs">v{version}</span>
      </div>
      <div className="flex flex-col justify-between h-screen mt-4">
        <div className="flex flex-col">
          {pages.map(({ link, title, icon }) => (
            <Link
              key={link}
              to={link}
              className={`${
                pathname === link
                  ? "bg-monokai-dark dark:bg-monokai-light"
                  : "dark:hover:bg-monokai-light hover:bg-monokai-dark"
              }
                 font-medium text-lg py-3 text-center`}
            >
              <div className="flex items-center justify-between mx-4">
                {title}
                {icon}
              </div>
            </Link>
          ))}
        </div>
        <div
          onClick={() => closeApp()}
          className="flex items-center justify-between hover:bg-red-500 hover:cursor-pointer font-medium text-lg py-3 px-4"
        >
          <span>Exit</span>
          <CloseIcon />
        </div>
      </div>
    </div>
  );
};
