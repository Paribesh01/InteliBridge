
import path from 'path';

const APPS_FOLDER = path.resolve(__dirname, 'apps');

const fileName = "createWebhook"
export const createWebhookHelper = async (app:string,token:string,metaData:any,zapid:string,userid:string) => {
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
    
     const result = await functionToRun(token,metaData,zapid,userid);
    return result

  } catch (error) {
    console.error(`Error logging default function from "${fileName}" for app "${app}":`, error);
    throw error;
  }
};
