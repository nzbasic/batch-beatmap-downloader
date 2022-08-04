import { useContext } from "react";
import { SettingsContext } from "../context/SettingsProvider";

export const useSettings = () => useContext(SettingsContext)
