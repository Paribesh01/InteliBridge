import dotenv from "dotenv";
dotenv.config();

const scopes = ["bot", "identify"];

const discordRegistry = {
  oauth: {
    authUrl: `https://discord.com/api/oauth2/authorize?client_id=${process.env.DiscordClientID}&redirect_uri=${process.env.CALLBACKBASEURL}discord/callback&response_type=code&permissions=2146958591&scope=${scopes.join(" ")}`,
    tokenUrl: "https://discord.com/api/oauth2/token",
    clientId: process.env.DiscordClientID,
    clientSecret: process.env.DiscordClientSecret,
    redirectUri: `${process.env.CALLBACKBASEURL}discord/callback`,
  },
  webhook: {
    createUrl: "https://discord.com/api/webhooks/:webhook_id/:webhook_token",
    events: { MESSAGE: "message_create" },
    secret: process.env.JSONSECRET,
  },
  triggers: ["message_create", "reaction_add"],
  workflows: ["send-message", "add-reaction"],
};

export default discordRegistry;
