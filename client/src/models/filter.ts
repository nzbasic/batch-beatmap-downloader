import { Rule, RuleType } from "./rules"

export interface ConnectorDetails {
  type: string;
  not: boolean;
}

export interface Group {
  connector: ConnectorDetails,
  children: Node[]
}

export interface Node {
  id: string,
  group?: Group
  rule?: Rule
}

export const sampleTree: Node = {
  id: "root",
  group: {
    connector: {
      type: "AND",
      not: false
    },
    children: [
      {
        id: "1",
        rule: {
          type: RuleType.STATUS,
          value: "ranked",
          operator: "=",
          field: "Approved"
        }
      },
      {
        id: "2",
        rule: {
          type: RuleType.MODE,
          value: "osu!",
          operator: "=",
          field: "Mode"
        }
      },
    ]
  }
}

export const allRankedOsu: Node = {
  id: "root",
  group: {
    connector: {
      type: "AND",
      not: false
    },
    children: [
      {
        id: "1",
        rule: {
          type: RuleType.STATUS,
          value: "ranked",
          operator: "=",
          field: "Approved"
        }
      },
      {
        id: "2",
        rule: {
          type: RuleType.MODE,
          value: "osu!",
          operator: "=",
          field: "Mode"
        }
      },
    ]
  }
}

export const allLoved: Node = {
  id: "root",
  group: {
    connector: {
      type: "AND",
      not: false
    },
    children: [
      {
        id: "1",
        rule: {
          type: RuleType.STATUS,
          value: "loved",
          operator: "=",
          field: "Approved"
        }
      },
    ]
  }
}

// export const allFarm: Node = {

// }

// export const allStream: Node = {

// }

// export const ranked2015: Node = {

// }

export const allSotarks: Node = {
  id: "root",
  group: {
    connector: {
      type: "AND",
      not: false
    },
    children: [
      {
        id: "1",
        rule: {
          type: RuleType.STATUS,
          value: "ranked",
          operator: "=",
          field: "Approved"
        }
      },
      {
        id: "2",
        rule: {
          type: RuleType.TEXT,
          value: "Sotarks",
          operator: "=",
          field: "Creator"
        }
      },
    ]
  }
}

export const allRanked7Star: Node = {
  id: "root",
  group: {
    connector: {
      type: "AND",
      not: false
    },
    children: [
      {
        id: "1",
        rule: {
          type: RuleType.STATUS,
          value: "ranked",
          operator: "=",
          field: "Approved"
        }
      },
      {
        id: "2",
        group: {
          connector: {
            type: "AND",
            not: false
          },
          children: [
            {
              id: "3",
              rule: {
                type: RuleType.NUMBER,
                value: "7",
                operator: ">=",
                field: "Stars"
              }
            },
            {
              id: "4",
              rule: {
                type: RuleType.NUMBER,
                value: "8",
                operator: "<=",
                field: "Stars"
              }
            }
          ]
        }
      }
    ]
  }
}

