import dotenv from "dotenv"
dotenv.config();
 const githubRegistry = {
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
    triggers:["pull_request","issues"],
    workflows:["create-issue"]
  }


  export default githubRegistry