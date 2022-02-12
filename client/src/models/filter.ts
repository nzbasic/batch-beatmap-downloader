export enum InputType {
  TEXT,
  NUMBER,
  DROPDOWN,
  DATE
}

export enum RuleType {
  TEXT,
  NUMBER,
  STATUS,
  GENRE,
  LANGUAGE,
  MODE,
  DATE
}

export interface ConnectorDetails {
  type: string;
  not: boolean;
}

export interface Group {
  connector: ConnectorDetails,
  children: Node[]
}

export interface Rule {
  type: RuleType | string;
  value: string;
  operator: string;
  field: string;
}

export interface Node {
  id: string,
  group?: Group
  rule?: Rule
}
