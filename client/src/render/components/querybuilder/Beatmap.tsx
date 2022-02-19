import { BeatmapDetails } from "../../../models/api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useState } from "react";

interface PropTypes {
  details: BeatmapDetails;
}

export const Beatmap = ({ details }: PropTypes) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center hover:underline hover:cursor-pointer"
      >
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        <span>
          {details.Artist} - {details.Title} [{details.Version}] by{" "}
          {details.Creator}
        </span>
      </div>

      {expanded && (
        <div className="flex flex-col ml-6 text-sm">
          <span>Status: {details.Approved}</span>
          <span>Stars: {details.Stars}</span>
          <span>AR: {details.Ar}</span>
          <span>OD: {details.Od}</span>
          <span>HP: {details.Hp}</span>
          <span>CS: {details.Cs}</span>
          <span>BPM: {details.Bpm}</span>
          <span>Total Length: {details.TotalLength}</span>
          <span>Drain Time: {details.HitLength}</span>
          <span>Genre: {details.Genre}</span>
          <span>Language: {details.Language}</span>
          <span>Source: {details.Source}</span>
          <span>Tags: {details.Tags}</span>
        </div>
      )}
    </div>
  );
};
