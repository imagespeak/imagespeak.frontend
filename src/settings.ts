// Centralized app settings for easy environment configuration

const settings = {
    cognito: {
        clientId: "1c8stjovflaui8kgmmljpl3n1h",
        logoutUri: "http://localhost:5173/",
        cognitoDomain: "https://us-east-1acnhsxvnt.auth.us-east-1.amazoncognito.com",
    },
    api: {
        presignedUrl: "https://qxnwjn6kwd.execute-api.us-east-1.amazonaws.com/iamgespeak-sit/upload-url",
    },
};

export default settings;
