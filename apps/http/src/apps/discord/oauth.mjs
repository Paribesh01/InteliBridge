import { get } from "http";
import discordRegistry from "./index.mjs";
import axios from "axios";

const exchangeDiscordCodeForToken = async (code) => {
  const config = discordRegistry.oauth;
  if (!config) throw new Error("Discord app configuration not found");

  console.log("Discord function is called");

  const response = await axios.post(
    config.tokenUrl,
    new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: config.redirectUri,
    }).toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  console.log(response.data);
  console.log(response);

  const getBotInformation = async (accessToken) => {
    try {
      const response = await axios.get(
        "https://discord.com/api/v10/users/@me",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Bot Information:", response.data);
    } catch (error) {
      console.error("Error fetching bot information:", error);
    }
  };
  getBotInformation(response.data?.access_token);

  return {
    access_token: response.data?.access_token,
    refresh_token: response.data?.refresh_token,
    expires_in: response.data?.expires_in,
    scope: response.data?.scope,
    guildId: response.data?.guild.id,
  };
};

export default exchangeDiscordCodeForToken;
