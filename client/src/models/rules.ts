export interface Rule {
  type: RuleType | string;
  value: string;
  operator: string;
  field: string;
}

export enum RuleType {
  TEXT,
  NUMBER,
  STATUS,
  GENRE,
  LANGUAGE,
  MODE,
  DATE,
  BOOLEAN,
  TOURNAMENT,
}

export interface InputOption {
  label: string;
  value: string;
  type: RuleType;
}

export const inputOptions: InputOption[] = [
  { value: "Approved", label: "Map Status", type: RuleType.STATUS },
  { value: "Archetype", label: "Tournament Archetype", type: RuleType.TOURNAMENT },
  { value: "ApprovedDate", label: "Approved Date", type: RuleType.DATE },
  { value: "Farm", label: "Farm", type: RuleType.BOOLEAN },
  { value: "Stream", label: "Stream", type: RuleType.BOOLEAN },
  { value: "Title", label: "Song Title", type: RuleType.TEXT },
  { value: "Artist", label: "Artist", type: RuleType.TEXT },
  { value: "Creator", label: "Mapper", type: RuleType.TEXT },
  { value: "Version", label: "Difficulty", type: RuleType.TEXT },
  { value: "Bpm", label: "BPM", type: RuleType.NUMBER },
  { value: "Hp", label: "HP (Health Drain)", type: RuleType.NUMBER },
  { value: "Od", label: "OD (Overall Difficulty)", type: RuleType.NUMBER },
  { value: "Ar", label: "AR (Approach Rate)", type: RuleType.NUMBER },
  { value: "Cs", label: "CS (Circle Size)", type: RuleType.NUMBER },
  { value: "Mode", label: "Game Mode", type: RuleType.MODE },
  { value: "Stars", label: "Star Rating", type: RuleType.NUMBER },
  { value: "MaxCombo", label: "Max Combo", type: RuleType.NUMBER },
  { value: "HitLength", label: "Song Length (drain)", type: RuleType.NUMBER },
  { value: "TotalLength", label: "Song Length (total)", type: RuleType.NUMBER },
  { value: "Source", label: "Source", type: RuleType.TEXT },
  { value: "Tags", label: "Tags", type: RuleType.TEXT },
  { value: "Genre", label: "Genre", type: RuleType.GENRE },
  { value: "Language", label: "Language", type: RuleType.LANGUAGE },
  { value: "FavouriteCount", label: "Favourite Count", type: RuleType.NUMBER },
  { value: "PassCount", label: "Pass Count", type: RuleType.NUMBER },
  { value: "PlayCount", label: "Play Count", type: RuleType.NUMBER },
  { value: "LastUpdate", label: "Last Update Date", type: RuleType.DATE },
  { value: "SetId", label: "Beatmap Set ID", type: RuleType.NUMBER },
  { value: "Id", label: "Beatmap ID", type: RuleType.NUMBER },
];

export interface Operator {
  label: string;
  value: string;
}

export const defaultOperators = [
  { label: "is", value: "=" },
  { label: "is not", value: "!=" },
];

export const operatorMap: Record<RuleType, Operator[]> = {
  0: [
    { label: "exactly matches", value: "=" },
    { label: "contains", value: "like" },
    { label: "does not contain", value: "not like" },
  ],
  1: [
    { label: "is equal to", value: "=" },
    { label: "is not equal to", value: "!=" },
    { label: "is less than", value: "<" },
    { label: "is greater than", value: ">" },
    { label: "is less than or equal to", value: "<=" },
    { label: "is greater than or equal to", value: ">=" },
  ],
  2: defaultOperators,
  3: defaultOperators,
  4: defaultOperators,
  5: defaultOperators,
  6: [
    { label: "is before", value: "<" },
    { label: "is after", value: ">" },
  ],
  7: defaultOperators,
  8: defaultOperators,
};

export enum InputType {
  TEXT,
  NUMBER,
  DROPDOWN,
  DATE,
  BOOLEAN,
}

export const inputTypeMap: Record<RuleType, InputType> = {
  0: InputType.TEXT,
  1: InputType.NUMBER,
  2: InputType.DROPDOWN,
  3: InputType.DROPDOWN,
  4: InputType.DROPDOWN,
  5: InputType.DROPDOWN,
  6: InputType.DATE,
  7: InputType.DROPDOWN,
  8: InputType.DROPDOWN
};

export interface DropdownOption {
  label: string;
  value: string;
}

export const dropdownMap = new Map<RuleType, DropdownOption[]>([
  [
    RuleType.STATUS,
    [
      { value: "ranked", label: "Ranked" },
      { value: "loved", label: "Loved" },
      { value: "unranked", label: "Unranked" }
    ],
  ],
  [
    RuleType.GENRE,
    [
      { value: "unspecified", label: "Unspecified" },
      { value: "video game", label: "Video Game" },
      { value: "anime", label: "Anime" },
      { value: "rock", label: "Rock" },
      { value: "pop", label: "Pop" },
      { value: "other", label: "Other" },
      { value: "novelty", label: "Novelty" },
      { value: "hip hop", label: "Hip Hop" },
      { value: "electronic", label: "Electronic" },
    ],
  ],
  [
    RuleType.MODE,
    [
      { value: "osu!", label: "osu!" },
      { value: "Taiko", label: "osu!taiko" },
      { value: "Catch the Beat", label: "osu!catch" },
      { value: "osu!mania", label: "osu!mania" },
    ],
  ],
  [
    RuleType.LANGUAGE,
    [
      { value: "other", label: "Other" },
      { value: "English", label: "English" },
      { value: "Japanese", label: "Japanese" },
      { value: "Chinese", label: "Chinese" },
      { value: "instrumental", label: "Instrumental" },
      { value: "Korean", label: "Korean" },
      { value: "French", label: "French" },
      { value: "German", label: "German" },
      { value: "Swedish", label: "Swedish" },
      { value: "Spanish", label: "Spanish" },
      { value: "Italian", label: "Italian" },
    ],
  ],
  [
    RuleType.BOOLEAN,
    [
      { value: "1", label: "True" },
      { value: "0", label: "False" },
    ],
  ],
  [
    RuleType.TOURNAMENT,
    [
      { value: "Any", label: "Any" },
      { value: "NM1", label: "NM1" },
      { value: "NM2", label: "NM2" },
      { value: "NM3", label: "NM3" },
      { value: "NM4", label: "NM4" },
      { value: "NM5", label: "NM5" },
      { value: "NM6", label: "NM6" },
      { value: "HD1", label: "HD1" },
      { value: "HD2", label: "HD2" },
      { value: "HD3", label: "HD3" },
      { value: "HD4", label: "HD4" },
      { value: "HR1", label: "HR1" },
      { value: "HR2", label: "HR2" },
      { value: "HR3", label: "HR3" },
      { value: "HR4", label: "HR4" },
      { value: "DT1", label: "DT1" },
      { value: "DT2", label: "DT2" },
      { value: "DT3", label: "DT3" },
      { value: "DT4", label: "DT4" },
      { value: "FM1", label: "FM1" },
      { value: "FM2", label: "FM2" },
      { value: "FM3", label: "FM3" },
      { value: "FM4", label: "FM4" },
      { value: "TB", label: "TB" },
    ]
  ]
]);

export const defaultValuesMap: Record<RuleType, string> = {
  0: "",
  1: "1",
  2: "ranked",
  3: "any",
  4: "any",
  5: "osu!",
  6: new Date().getTime().toString(),
  7: "1",
  8: "Any",
};

export const defaultOperatorsMap: Record<RuleType, string> = {
  0: "like",
  1: "=",
  2: "=",
  3: "=",
  4: "=",
  5: "=",
  6: "<",
  7: "=",
  8: "=",
};
