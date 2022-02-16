const path = require("path");
const package = require("../package.json");
require("dotenv").config();

const packageAssetsPath = path.join(__dirname, "..", "assets", "package");

module.exports = {
  packagerConfig: {
    asar: true,
  },
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "saucesteals",
          name: "electron-typescript-react-tailwind-redux",
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
        iconUrl:
          "https://raw.githubusercontent.com/saucesteals/electron-typescript-react-tailwind-redux/main/assets/package/icons/win/icon.ico",
        setupIcon: path.join(packageAssetsPath, "icons", "win", "icon.ico"),
        authors: "saucesteals & fourwadu",
        loadingGif: path.join(packageAssetsPath, "loading.gif"),
      },
    },
    // You can only build the DMG target on macOS machines.
    {
      name: "@electron-forge/maker-dmg",
      config: {
        // https://js.electronforge.io/maker/dmg/interfaces/makerdmgconfig
        icon: path.join(packageAssetsPath, "icons", "mac", "icon.icns"),
        background: path.join(packageAssetsPath, "source.png"),
        overwrite: true,
        name: "electron-boilerplate", // NEEDS TO BE SHORTER THAN 27 CHARACTERS
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
        icon: path.join(packageAssetsPath, "icons", "png", "1024x1024.png"),
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
              js: "./src/renderer.ts",
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
