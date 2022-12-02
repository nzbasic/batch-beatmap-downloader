import React from "react";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import StorageIcon from '@mui/icons-material/Storage';
import HistoryIcon from '@mui/icons-material/History';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import classNames from 'classnames';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Logo from "../../assets/bbd.svg";

interface PropTypes {
  version: string
}

export const Menu = ({ version }: PropTypes) => {
  const { pathname } = useLocation();

  const pages = [
    { link: "/", title: "Home", icon: <HomeIcon /> },
    { link: "/query", title: "Map Search", icon: <SearchIcon /> },
    { link: "/downloads", title: "Downloads", icon: <DownloadIcon /> },
    { link: "/status", title: "Server Status", icon: <StorageIcon /> },
    { link: "/changelog", title: "Change Log", icon: <HistoryIcon /> },
  ];

  const links = [
    { link: "https://discord.gg/3nj6cKzynK", title: "Discord" },
    { link: "https://www.buymeacoffee.com/nzbasic", title: "Donate" },
  ]

  return (
    <div
      id="menu"
      className="w-52 flex flex-col h-screen bg-monokai-light text-white dark:bg-monokai-dark shadow"
    >
      <img className="m-4" src={Logo as string} />
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
              className={classNames("font-medium text-lg py-3 text-center",
                { "bg-monokai-dark dark:bg-monokai-light": pathname === link },
                { "dark:hover:bg-monokai-light hover:bg-monokai-dark": pathname !== link },
            )}>
              <div className="flex items-center justify-between mx-4">
                {title}
                {icon}
              </div>
            </Link>
          ))}
          {links.map(({ link, title }) => (
            <button
              key={title}
              onClick={() => window.electron.openUrl(link)}
              className="font-medium text-lg py-3 text-center dark:hover:bg-monokai-light hover:bg-monokai-dark"
            >
              <div className="flex items-center justify-between mx-4">
                {title}
                <OpenInNewIcon />
              </div>
            </button>
          ))}
        </div>
        {/* <div
          onClick={() => closeApp()}
          className="flex items-center justify-between hover:bg-red-500 hover:cursor-pointer font-medium text-lg py-3 px-4"
        >
          <span>Exit</span>
          <CloseIcon />
        </div> */}
      </div>
    </div>
  );
};
