import { useContext } from "react";
import { StatusContext } from "../context/StatusProvider";

export const useStatus = () => useContext(StatusContext)
