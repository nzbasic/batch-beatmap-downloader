import React from "react";

export type Row = (string | number | JSX.Element)[];

interface PropTypes {
  rows: Row[];
  columns: string[];
}

export const Table = ({ rows, columns }: PropTypes) => {
  return (
    <table className="table-auto w-full">
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column}
              className="px-2 border border-gray-300 dark:border-black dark:border-2 py-1"
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {row.map((cell, index) => (
              <td
                key={index}
                className="px-2 border border-gray-300 dark:border-black dark:border-2 py-1"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
