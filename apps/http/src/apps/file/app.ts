import dotenv from 'dotenv';
dotenv.config();
export const appRegistry: any = {
  github: {
    oauth: {
      authUrl: `https://github.com/login/oauth/authorize?client_id=${process.env.GithubclientID}&redirect_uri=${process.env.CALLBACKBASEURL}github/callback`,
      tokenUrl: "https://github.com/login/oauth/access_token",
      clientId: process.env.GithubclientID,
      clientSecret: process.env.GithubclientSecret,
      redirectUri: `${process.env.CALLBACKBASEURL}github/callback`
    },
    webhook: {
      createUrl: "POST /repos/:owner/:repo/hooks",
      events: { ISSUE: "issues" },
      secret: process.env.JSONSECRET,
    },
    triggers:["new-pullrequest","new-issue"],
    workflows:["create-issue"]
  },
};
