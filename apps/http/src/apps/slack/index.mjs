import dotenv from "dotenv";
dotenv.config();

const scopes = [
  "channels:manage",
  "channels:read",
  "channels:join",
  "chat:write",
  "chat:write.customize",
  "chat:write.public",
  "files:write",
  "im:write",
  "mpim:write",
  "team:read",
  "users.profile:read",
  "users:read",
  "workflow.steps:execute",
  "users:read.email",
  "commands",
];

const userScopes = [
  "channels:history",
  "channels:read",
  "channels:write",
  "chat:write",
  "emoji:read",
  "files:read",
  "files:write",
  "groups:history",
  "groups:read",
  "groups:write",
  "im:read",
  "im:write",
  "mpim:write",
  "reactions:read",
  "reminders:write",
  "search:read",
  "stars:read",
  "team:read",
  "users.profile:read",
  "users.profile:write",
  "users:read",
  "users:read.email",
];

const joinedScopes = scopes.join(",");
const joinedUserScopes = userScopes.join(",");

const SlackRegistry = {
  oauth: {
    authUrl: `https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&redirect_uri=${process.env.CALLBACK_BASE_URL}slack/callback&scope=${joinedScopes}&user_scope=${joinedUserScopes}`,
    tokenUrl: "https://slack.com/api/oauth.v2.access",
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    redirectUri: `${process.env.CALLBACK_BASE_URL}slack/callback`,
    scope: joinedScopes,
    user_scope: joinedUserScopes,
  },
  webhook: {
    postMessageUrl: "https://slack.com/api/chat.postMessage",
    events: {
      MESSAGE: "message",
    },
    secret: process.env.SLACK_SIGNING_SECRET,
  },
  triggers: ["message", "reaction_added"],
  workflows: ["send-message", "add-reaction"],
};

export default SlackRegistry;
