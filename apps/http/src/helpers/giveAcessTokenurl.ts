import oauthFunctions from "../apps/oauthFunctions";

export const exchangeCodeForToken = async (app:string, code:string) => {
  const exchangeFunction = oauthFunctions[app]; 
  if (!exchangeFunction) throw new Error(`No OAuth function found for app: ${app}`);
  console.log("2," ,code)
  const tokenData = await exchangeFunction(code);  
  return tokenData;
};

import path from 'path';

const APPS_FOLDER = path.resolve(__dirname, 'apps');

const fileName = "oauth"
export const logDefaultFunctionFromAppFile = async (app:string) => {
  try {
    const filePath = path.join(APPS_FOLDER, app, `${fileName}.js`);
    console.log('Attempting to load file from path:', filePath);

    const module = await import(filePath);

    if (!module.default || !module.default.default || typeof module.default.default !== 'function') {
      throw new Error(
        `No default function found in file "${fileName}" for app "${app}".`
      );
    }
     const functionToRun = module.default.default;
    
     const result = await functionToRun();
    return result

  } catch (error) {
    console.error(`Error logging default function from "${fileName}" for app "${app}":`, error);
    throw error;
  }
};
