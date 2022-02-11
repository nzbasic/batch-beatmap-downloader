export interface FilterRequest {
  groups: Group[],
  rules: Rule[]
}

export interface Group {
  number: number,
  connector: string,
  not: boolean,
  parent: number
}

export interface Rule {
  type: string,
  value: string,
  field: string,
  operator: string,
  group: number
}
