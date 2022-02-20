const path = require("path");
const package = require("../package.json");
require("dotenv").config();

const packageAssetsPath = path.join(__dirname, "..", "src", "render", "assets");

console.log(packageAssetsPath);

module.exports = {
  packagerConfig: {
    asar: true,
  },
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "nzbasic",
          name: "batch-beatmap-downloader",
          authToken: process.env.GITHUB_TOKEN,
        },
        draft: true,
      },
    },
  ],
  makers: [
    // https://www.electronforge.io/config/makers

    {
      name: "@electron-forge/maker-squirrel",
      config: {
        // https://js.electronforge.io/maker/squirrel/interfaces/makersquirrelconfig
        setupExe: "Windows Setup.exe",
        setupIcon: path.join(packageAssetsPath, "bbd.ico"),
        icon: path.join(packageAssetsPath, "bbd.ico"),
        authors: "nzbasic",
      },
    },
    // You can only build the DMG target on macOS machines.
    {
      name: "@electron-forge/maker-dmg",
      config: {
        // https://js.electronforge.io/maker/dmg/interfaces/makerdmgconfig
        icon: path.join(packageAssetsPath, "bbd.png"),
        overwrite: true,
        name: "Batch Beatmap Downloader", // NEEDS TO BE SHORTER THAN 27 CHARACTERS
      },
    },

    // Use maker-zip to build for mac, but without customizability
    // {
    //   name: "@electron-forge/maker-zip",
    //   platforms: ["darwin"],
    //   // No config choice
    // },

    {
      name: "@electron-forge/maker-deb",
      config: {
        // https://js.electronforge.io/maker/deb/interfaces/makerdebconfig
        icon: path.join(packageAssetsPath, "bbd.png"),
      },
    },
  ],
  plugins: [
    [
      "@electron-forge/plugin-webpack",
      {
        mainConfig: "./.config/webpack.main.config.js",
        renderer: {
          config: "./.config/webpack.renderer.config.js",
          devContentSecurityPolicy: `img-src * 'self' data: https:; default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval'`,
          entryPoints: [
            {
              html: "./src/render/index.html",
              js: "./src/renderer.tsx",
              name: "main_window",
              preload: {
                js: "./src/preload.ts",
              },
            },
          ],
        },
      },
    ],
  ],
};
