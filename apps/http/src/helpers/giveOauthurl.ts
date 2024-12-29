import { appRegistry } from "../app";

export const giveoauthurl = (app:string,state:string)=>{
    const config = appRegistry[app].oauth.authUrl;
  if (!config) throw new Error("App not supported");
  return `${config}&state={${state}}`
}