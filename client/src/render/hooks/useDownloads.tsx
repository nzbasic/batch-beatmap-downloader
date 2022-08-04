import { useContext } from "react";
import { DownloadsContext } from "../context/DownloadProvider";

export const useDownloads = () => useContext(DownloadsContext)
