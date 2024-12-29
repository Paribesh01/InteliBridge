import oauthFunctions from "../apps/oauthFunctions";

export const exchangeCodeForToken = async (app:string, code:string) => {
  const exchangeFunction = oauthFunctions[app]; 
  if (!exchangeFunction) throw new Error(`No OAuth function found for app: ${app}`);
  console.log("2," ,code)
  const tokenData = await exchangeFunction(code);  
  return tokenData;
};