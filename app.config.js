import 'dotenv/config';

export default ({ config }) => {
    return {
        ...config,
        extra: {
            kakaoAppKey: process.env.KAKAO_APP_KEY,
        },
        plugins: [
            [
                "@react-native-seoul/kakao-login",
                {
                    "kakaoAppKey": process.env.KAKAO_APP_KEY,
                    "kotlinVersion": "1.9.0"
                }
            ],
            [
                "expo-build-properties",
                {
                    "android": {
                    "extraMavenRepos": ["https://devrepo.kakao.com/nexus/content/groups/public/"]
                    }
                }
            ]
        ]   
    };
};