
import path from 'path';

const APPS_FOLDER = path.resolve(__dirname, '../apps');

const fileName = "createWebhook"
export const createWebhookHelper = async (app:string,token:string,metaData:any,zapid:string,userid:string) => {
  try {
    const filePath = path.join(APPS_FOLDER, app, `${fileName}.mjs`);
    console.log('Attempting to load file from path:', filePath);

    const module = await import(filePath);
    console.log(module.default)

    if (!module.default || typeof module.default !== 'function') {
      throw new Error(
        `No default function found in file "${fileName}" for app "${app}".`
      );
    }
     const functionToRun = module.default;
     console.log(module)
     console.log(module.default)
    
     const result = await functionToRun(token,metaData,zapid,userid);
    return result

  } catch (error) {
    console.error(`Error logging default function from "${fileName}" for app "${app}":`, error);
    throw error;
  }
};
