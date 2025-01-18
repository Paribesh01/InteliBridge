import SlackRegistry from "./index.mjs";
import axios from "axios";

const exchangeSlackCodeForToken = async (code) => {
  const config = SlackRegistry.oauth;
  if (!config) throw new Error("Slack app configuration not found");

  console.log("Slack function is called");

  const response = await axios.post(config.tokenUrl, null, {
    params: {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: config.redirectUri,
    },
    headers: {
      Accept: "application/json",
    },
  });

  console.log(response.data);

  if (!response.data.ok) {
    throw new Error(`Slack OAuth error: ${response.data.error}`);
  }

  return {
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token || null,
    team: response.data.team,
    authed_user: response.data.authed_user,
  };
};

export default exchangeSlackCodeForToken;
