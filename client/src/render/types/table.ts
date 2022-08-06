export interface TableHeader {
  title: string;
  key: string;
}

export interface TableData {
  [key: string]: any
}

export interface RowProps {
  entry: TableData
  headers: TableHeader[]
  onRowAction?: (action: string, row: TableData) => void
}
