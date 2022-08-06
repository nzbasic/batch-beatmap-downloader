import classNames from 'classnames';
import React from 'react';
import { RowProps, TableData, TableHeader } from '../../types/table';

interface PropTypes {
  headers: TableHeader[]
  data: TableData[]
  RenderRow?: React.FC<RowProps>
  className?: string
  onRowAction?: (action: string, row: TableData) => void
}

const DefaultTableRow: React.FC<RowProps> = ({ entry, headers }) => (
  <>
    {headers.map((header, index) => (
      <td
        key={header.key}
        className={classNames(
          { 'pl-6': index === 0 },
          'p-1 px-3 h-12 text-sm whitespace-pre-wrap',
        )}
      >
        {entry[header.key]}
      </td>
    ))}
  </>
);

const Table: React.FC<PropTypes> = ({ data, headers, RenderRow = DefaultTableRow, className, onRowAction }) => (
  <table className={classNames(className, 'w-full text-gray-600 dark:text-gray-200')}>
    <thead className="dark:bg-monokai-light dark:border-black bg-gray-100 border-y border-gray-200 shadow-y ">
      <tr>
        {headers.map((header, index) => (
          <th
            key={header.key}
            className={classNames(
              { 'pl-6': index === 0 },
              'font-medium p-3 text-sm text-left tracking-wide',
            )}
          >
            {header.title}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.length === 0 ? <tr><td colSpan={6} className="pl-6 py-2">No results found</td></tr> : (
        data.map((entry, index) => (
          <tr key={index} className={classNames(
            { 'border-y-0': index === data.length - 1 },
            'border-y dark:border-black'
          )}>
            {<RenderRow entry={entry} headers={headers} onRowAction={onRowAction} />}
          </tr>
        ))
      )}
    </tbody>
  </table>
);

export default Table;
