import isNumber from "is-number";
import React from "react";
import Switch from "react-switch";
import Select from "react-select";
import { QueryOrder } from "../../../models/api";
import { NumericInput } from "../util/NumericInput";

interface PropTypes {
  limit: number | undefined;
  updateLimit: (n: number | undefined) => void;
  order: QueryOrder | undefined;
  updateOrder: (order: QueryOrder | undefined) => void;
}

const orderOptions = [
  { value: "approvedDate", label: "Approved Date" },
  { value: "bpm", label: "BPM" },
  { value: "stars", label: "Star Rating" },
  { value: "favouriteCount", label: "Favorite Count" },
  { value: "passCount", label: "Pass Count" },
  { value: "playCount", label: "Play Count" },
  { value: "maxCombo", label: "Max Combo" },
  { value: "hitLength", label: "Hit Length" },
  { value: "totalLength", label: "Total Length" },
  { value: "lastUpdate", label: "Last Update Date" },
  { value: "hp", label: "HP" },
  { value: "cs", label: "CS" },
  { value: "od", label: "OD" },
  { value: "ar", label: "AR" },
  { value: "size", label: "File Size" },
  { value: "id", label: "Beatmap Id" },
  { value: "setId", label: "Beatmap Set Id" },
];

const directionOptions = [
  { value: "DESC", label: "High to Low" },
  { value: "ASC", label: "Low to High" },
]

const defaultLimit = 10;
const defaultOrder = {
  by: "approvedDate",
  direction: "DESC"
}

export const QuerySettings = ({ limit, updateLimit, order, updateOrder }: PropTypes) => {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (isNumber(value)) {
      updateLimit(parseInt(value));
    }
  };

  const enable = (enabled: boolean) => {
    if (enabled) {
      updateLimit(defaultLimit);
      updateOrder(defaultOrder);
    } else {
      updateLimit(undefined);
      updateOrder(undefined);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center h-10">
        <label className="w-32 label">Query Limit</label>
        <Switch
          onChange={(enabled) => enable(enabled)}
          checked={limit !== undefined}
        />
      </div>

      {limit && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <label className="w-32">Limit</label>
            <NumericInput
              className="input-height p-2 w-40 border-gray-300 border rounded focus:outline-blue-500"
              value={limit}
              onChange={(n) => updateLimit(Math.max(1, n || 1))}
              step={1}
            />
          </div>

          <div className="flex items-center">
            <label className="w-32 label">Order by</label>
            <Select
              menuPlacement="top"
              className="w-52 my-react-select-container"
              classNamePrefix="my-react-select"
              options={orderOptions}
              value={orderOptions.find(item => order?.by === item.value)}
              onChange={(e) => e && order && updateOrder({ ...order, by: e.value })}
            />
            <Select
              menuPlacement="top"
              className="w-40 ml-4 my-react-select-container"
              classNamePrefix="my-react-select"
              options={directionOptions}
              value={directionOptions.find(item => order?.direction === item.value)}
              onChange={(e) => e && order && updateOrder({ ...order, direction: e.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
};
