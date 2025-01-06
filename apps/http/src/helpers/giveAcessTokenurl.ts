import path from 'path';
import { pathToFileURL } from 'url';

const APPS_FOLDER = path.resolve(__dirname, '../apps');
const fileName = 'oauth';

export const giveAccessToken = async (app: string, code: string) => {
  try {
    // Resolve the absolute file path and convert it to a file URL
    const filePath = path.join(APPS_FOLDER, app, `${fileName}.mjs`);
    const fileURL = pathToFileURL(filePath).href;

    console.log('Attempting to load file from path:', filePath);

    // Import the module dynamically
    const module = await import(fileURL);

    // Ensure the default export is a function
    if (!module.default || typeof module.default !== 'function') {
      throw new Error(
        `No default function found in file "${fileName}" for app "${app}".`
      );
    }

    // Call the default function with the provided code
    const result = await module.default(code);

    return result;
  } catch (error) {
    console.error(`Error logging default function from "${fileName}" for app "${app}":`, error);
    throw error;
  }
};
