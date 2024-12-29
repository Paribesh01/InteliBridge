// oauthFunctions.js

import axios from 'axios';
import { appRegistry } from '../app';

// Exchange token function for GitHub
export const exchangeGitHubCodeForToken = async (code:string) => {
  const config = appRegistry.github?.oauth;
  if (!config) throw new Error("GitHub app configuration not found");

    console.log("github function is called")

  const response:any= await axios.post(config.tokenUrl, null, {
    params: {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: config.redirectUri,
    },
    headers: { Accept: "application/json" },
  });

  return {access_token:response.data?.access_token, refresh_token:response.data?.refresh_token };
};

// Exchange token function for Slack
export const exchangeSlackCodeForToken = async (code:string) => {
  const config = appRegistry.slack?.oauth;
  if (!config) throw new Error("Slack app configuration not found");

  const response:any = await axios.post(config.tokenUrl, null, {
    params: {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: config.redirectUri,
    },
    headers: { Accept: "application/json" },
  });

  return {access_token:response.data?.access_token, refresh_token:response.data?.refresh_token };
};

// Add more app-specific OAuth functions as needed

// Mapping registry for dynamic function calling
const oauthFunctions:any = {
  github: exchangeGitHubCodeForToken,
  slack: exchangeSlackCodeForToken,
  // Add other apps here
};

export default oauthFunctions;
