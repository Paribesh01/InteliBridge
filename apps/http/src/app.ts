import dotenv from 'dotenv';
dotenv.config();
export const appRegistry: any = {
  github: {
    oauth: {
      authUrl: `https://github.com/login/oauth/authorize?client_id=${process.env.GithubclientID}&redirect_uri=${process.env.CALLBACKBASEURL}github/callback`,
      tokenUrl: "https://github.com/login/oauth/access_token",
      clientId: process.env.clientID,
      clientSecret: process.env.clientSecret,
      redirectUri: "http://localhost:8000/api/v1/o/github/callback",
    },
    webhook: {
      createUrl: "POST /repos/:owner/:repo/hooks",
      events: { ISSUE: "issues" },
      secret: process.env.JSONSECRET,
    },
  },
};
