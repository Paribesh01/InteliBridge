import { appRegistry } from "./file/app";

export const exchangeGitHubCodeForToken = async (code:string) => {
    const config = appRegistry.github?.oauth;
    if (!config) throw new Error("GitHub app configuration not found");
  
      console.log("github function is called")
  
    const response:any= await axios.post(config.tokenUrl, null, {
      params: {
          client_id	: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: config.redirectUri,
      },
      headers: {
          Accept: "application/json",
        },
    });
  
    
  
    console.log(response.data)
  
  
    return {access_token:response.data?.access_token, refresh_token:response.data?.refresh_token };
  };