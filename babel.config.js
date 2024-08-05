module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      //react-native-dotenv
      [
        'module:react-native-dotenv',
        {
          "envName": "APP_ENV",
          "moduleName": "@env",
          "path": ".env.local",
          "blocklist": null,
          "allowlist": null,
          "blacklist": null, 
          "whitelist": null, 
          "safe": false,
          "allowUndefined": true,
          "verbose": false
        },
      ],
      'react-native-reanimated/plugin',  // Reanimated plugin은 플러그인들 중 마지막에 추가되어야 한다.
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@assets": "./src/assets",
            "@styles": "./src/styles",
          },
        },
      ],
    ],
  };
};

