const appRegistry = {
    github: {
      oauth: {
        authUrl: "https://github.com/login/oauth/authorize",
        tokenUrl: "https://github.com/login/oauth/access_token",
        clientId: process.env.clientID,
        clientSecret: process.env.clientSecret,
        redirectUri:"http://localhost:3000/auth/github/callback" ,
      },
      webhook: {
        createUrl: "POST /repos/:owner/:repo/hooks",
        events: {ISSUE:"issues"},
        secret: process.env.JSONSECRET,
      },
    },
    // Add more apps here
  };
  