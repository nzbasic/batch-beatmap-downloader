import React from "react";
import { ConnectorDetails } from "../../../../models/filter";
import classNames from 'classnames';

const types = ["AND", "OR"];

interface PropTypes {
  details: ConnectorDetails;
  update: (connector: ConnectorDetails) => void;
  id: string;
}

export const Connector = ({ id, details, update }: PropTypes) => {
  const isNot = details.not.includes(id);

  const handleUpdate = () => {
    // if NOT is toggled on, add id to not array
    // if NOT is toggled off, remove id from the not array
    if (isNot) { // is on, turning off
      update({
        ...details,
        not: details.not.filter((existingId) => existingId !== id),
      });
    } else { // is off, turning on
      update({
        ...details,
        not: [...details.not, id],
      });
    }
  }

  return (
    <div className="flex items-center py-2 text-black dark:text-white">
      {types.map((type, index) => (
        <button
          className={classNames("px-2 py-1 border-gray-600 dark:border-monokai-border border w-12 transition duration-200",
            { 'rounded-l border-r-0': index === 0 },
            { 'rounded-r border-l-0': index === types.length - 1 },
            { 'bg-blue-500 dark:bg-blue-500 text-white': details.type === type },
            { 'bg-white dark:bg-monokai-light2 dark:hover:bg-blue-500 hover:bg-blue-500': details.type !== type },
          )}
          disabled={type === details.type}
          onClick={() => update({ ...details, type })}
          key={index}
        >
          {type}
        </button>
      ))}

      <button
        className={classNames("ml-2 border-gray-600 dark:border-monokai-border border px-2 py-1 rounded transition duration-100",
          { 'bg-red-500 dark:bg-red-600 text-white': isNot },
          { 'hover:bg-red-500 bg-white dark:bg-monokai-light2 dark:hover:bg-red-600': !isNot },
        )}
        onClick={() => handleUpdate()}
      >
        NOT
      </button>
    </div>
  );
};
