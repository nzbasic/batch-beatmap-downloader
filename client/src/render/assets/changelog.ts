export interface ChangeLogItem {
  version: string;
  date: number;
  changes: string[];
}

export const changeLog: ChangeLogItem[] = [
  {
    version: "1.3.0",
    date: 1669446685871,
    changes: [
      "Added all unranked beatmaps to the database",
      "Added 'Simple Query' mode",
      "Added share filter feature",
      "Improved performance of querying",
      "Renamed farm and stream filters under 'special'",
      "Added ranked mapper special filter",
      "Added support for multiple concurrent downloads",
      "Added discord and donation links",
      "Improved download time estimation",
      "Added V2 metrics and filter API with improved security",
      "Various UI improvements",
      "Fixed unranked map filter",
    ]
  },
  {
    version: "1.2.0",
    date: 1654838371361,
    changes: [
      "Added changelog",
      "Added support for concurrent downloads",
      "Added tournament maps from 2019-2021 to the database",
      "Added tournament archetypes to the query selector",
      "Moved beatmap storage to Cloudflare R2"
    ]
  }
]

