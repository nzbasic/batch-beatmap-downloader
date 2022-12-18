export interface ChangeLogItem {
  version: string;
  date: number;
  changes: {
    title: string;
    changes: string[];
  }[]
}

export const changeLog: ChangeLogItem[] = [
  {
    version: "1.3.0",
    date: 1669446685871,
    changes: [
      {
        title: "Server",
        changes: [
          "Added all unranked beatmaps to the database",
          "Improved performance of querying",
          "Fixed unranked map filter",
          "V2 metrics and filter API",
          "Added ranked mapper special filter",
          "Added script to fetch new beatmaps",
          "Added script to update existing beatmap data",
          "Improved security"
        ]
      },
      {
        title: "Search",
        changes: [
          "Added 'Simple Query' mode",
          "Added share filter feature",
          "Renamed farm and stream filters under 'special'",
          "Added ordering when query limit is enabled",
        ]
      },
      {
        title: "Downloads",
        changes: [
          "Added temporary download folder support",
          "Added custom download client",
          "Added support for multiple downloads",
          "Improved download time estimation",
        ]
      },
      {
        title: "Client",
        changes: [
          "Added categories to changelog",
          "Added discord and donation links",
          "Various UI improvements",
        ],
      }
    ]
  },
  {
    version: "1.2.0",
    date: 1654838371361,
    changes: [
      {
        title: "Server",
        changes: [
          "Added tournament maps from 2019-2021 to the database",
          "Moved beatmap storage to Cloudflare R2",
        ],
      },
      {
        title: "Search",
        changes: [
          "Added support for concurrent downloads",
          "Added tournament archetypes to the query selector",
        ],
      },
      {
        title: "Client",
        changes: [
          "Added changelog",
        ],
      }
    ]
  }
]

