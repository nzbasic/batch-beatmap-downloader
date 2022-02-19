import { Rule, RuleType } from "./rules";

export interface ConnectorDetails {
  type: string;
  not: boolean;
}

export interface Group {
  connector: ConnectorDetails;
  children: Node[];
}

export interface Node {
  id: string;
  group?: Group;
  rule?: Rule;
}

export const sampleTree: Node = {
  id: "root",
  group: {
    connector: {
      type: "AND",
      not: false,
    },
    children: [
      {
        id: "1",
        rule: {
          type: RuleType.STATUS,
          value: "ranked",
          operator: "=",
          field: "Approved",
        },
      },
      {
        id: "2",
        rule: {
          type: RuleType.MODE,
          value: "osu!",
          operator: "=",
          field: "Mode",
        },
      },
    ],
  },
};

export const allRankedOsu: Node = {
  id: "root",
  group: {
    connector: {
      type: "AND",
      not: false,
    },
    children: [
      {
        id: "1",
        rule: {
          type: RuleType.STATUS,
          value: "ranked",
          operator: "=",
          field: "Approved",
        },
      },
      {
        id: "2",
        rule: {
          type: RuleType.MODE,
          value: "osu!",
          operator: "=",
          field: "Mode",
        },
      },
    ],
  },
};

export const allLoved: Node = {
  id: "root",
  group: {
    connector: {
      type: "AND",
      not: false,
    },
    children: [
      {
        id: "1",
        rule: {
          type: RuleType.STATUS,
          value: "loved",
          operator: "=",
          field: "Approved",
        },
      },
    ],
  },
};

export const allFarm: Node = {
  id: "root",
  group: {
    connector: {
      type: "AND",
      not: false,
    },
    children: [
      {
        id: "1",
        rule: {
          type: RuleType.MODE,
          value: "osu!",
          operator: "=",
          field: "Mode",
        },
      },
      {
        id: "2",
        rule: {
          type: RuleType.BOOLEAN,
          value: "1",
          operator: "=",
          field: "Farm",
        },
      }
    ],
  },
}

export const allStream: Node = {
  id: "root",
  group: {
    connector: {
      type: "AND",
      not: false,
    },
    children: [
      {
        id: "1",
        rule: {
          type: RuleType.MODE,
          value: "osu!",
          operator: "=",
          field: "Mode",
        },
      },
      {
        id: "2",
        rule: {
          type: RuleType.BOOLEAN,
          value: "1",
          operator: "=",
          field: "Stream",
        },
      }
    ],
  },
}

export const ranked2015: Node = {
  id: "root",
  group: {
    connector: {
      type: "AND",
      not: false,
    },
    children: [
      {
        id: "1",
        rule: {
          type: RuleType.STATUS,
          value: "ranked",
          operator: "=",
          field: "Approved",
        },
      },
      {
        id: "2",
        group: {
          connector: {
            type: "AND",
            not: false,
          },
          children: [
            {
              id: "3",
              rule: {
                type: RuleType.DATE,
                value: "1420023600000",
                operator: ">",
                field: "ApprovedDate",
              },
            },
            {
              id: "4",
              rule: {
                type: RuleType.DATE,
                value: "1451559600000",
                operator: "<",
                field: "ApprovedDate",
              },
            },
          ],
        },
      },
    ],
  },
}

export const allSotarks: Node = {
  id: "root",
  group: {
    connector: {
      type: "AND",
      not: false,
    },
    children: [
      {
        id: "1",
        rule: {
          type: RuleType.STATUS,
          value: "ranked",
          operator: "=",
          field: "Approved",
        },
      },
      {
        id: "2",
        rule: {
          type: RuleType.TEXT,
          value: "Sotarks",
          operator: "=",
          field: "Creator",
        },
      },
    ],
  },
};

export const allRanked7Star: Node = {
  id: "root",
  group: {
    connector: {
      type: "AND",
      not: false,
    },
    children: [
      {
        id: "1",
        rule: {
          type: RuleType.STATUS,
          value: "ranked",
          operator: "=",
          field: "Approved",
        },
      },
      {
        id: "2",
        group: {
          connector: {
            type: "AND",
            not: false,
          },
          children: [
            {
              id: "3",
              rule: {
                type: RuleType.NUMBER,
                value: "7",
                operator: ">=",
                field: "Stars",
              },
            },
            {
              id: "4",
              rule: {
                type: RuleType.NUMBER,
                value: "8",
                operator: "<=",
                field: "Stars",
              },
            },
          ],
        },
      },
    ],
  },
};
