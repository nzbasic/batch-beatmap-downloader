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
}

export interface InputOption {
  label: string;
  value: string;
  type: RuleType;
}

export const inputOptions: InputOption[] = [
  { value: "Approved", label: "Map Status", type: RuleType.STATUS },
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

export const operatorMap = new Map<RuleType, Operator[]>([
  [
    RuleType.TEXT,
    [
      { label: "exactly matches", value: "=" },
      { label: "contains", value: "like" },
      { label: "does not contain", value: "not like" },
    ],
  ],
  [
    RuleType.NUMBER,
    [
      { label: "is equal to", value: "=" },
      { label: "is not equal to", value: "!=" },
      { label: "is less than", value: "<" },
      { label: "is greater than", value: ">" },
      { label: "is less than or equal to", value: "<=" },
      { label: "is greater than or equal to", value: ">=" },
    ],
  ],
  [RuleType.STATUS, defaultOperators],
  [RuleType.GENRE, defaultOperators],
  [RuleType.MODE, defaultOperators],
  [RuleType.LANGUAGE, defaultOperators],
  [
    RuleType.DATE,
    [
      { label: "is before", value: "<" },
      { label: "is after", value: ">" },
    ],
  ],
  [RuleType.BOOLEAN, defaultOperators],
]);

export enum InputType {
  TEXT,
  NUMBER,
  DROPDOWN,
  DATE,
  BOOLEAN,
}

export const inputTypeMap = new Map<RuleType, InputType>([
  [RuleType.NUMBER, InputType.NUMBER],
  [RuleType.TEXT, InputType.TEXT],
  [RuleType.STATUS, InputType.DROPDOWN],
  [RuleType.GENRE, InputType.DROPDOWN],
  [RuleType.MODE, InputType.DROPDOWN],
  [RuleType.LANGUAGE, InputType.DROPDOWN],
  [RuleType.DATE, InputType.DATE],
  [RuleType.BOOLEAN, InputType.DROPDOWN],
]);

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
]);
