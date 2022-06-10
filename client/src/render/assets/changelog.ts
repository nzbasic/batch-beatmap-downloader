export interface ChangeLogItem {
  version: string;
  date: number;
  changes: string[];
}

export const changeLog: ChangeLogItem[] = [
  {
    version: "1.2.0",
    date: 1654838371361,
    changes: [
      "Added changelog",
      "Added support for multiple concurrent downloads",
      "Added tournament maps from 2019-2021 to the database",
      "Added tournament archetypes to the query selector",
      "Moved beatmap storage to Cloudflare R2"
    ]
  },
]
