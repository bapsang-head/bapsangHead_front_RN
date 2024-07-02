module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',  // Reanimated plugin을 항상 첫 번째로 설정
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

