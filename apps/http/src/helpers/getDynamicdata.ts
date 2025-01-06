
// import path from 'path';

// const APPS_FOLDER = path.resolve(__dirname, '../apps');

// const fileName = "dynamicData"
// export const getDymanicDataforapp = async (app:string,token:string) => {
//   try {
//     const filePath = path.join(APPS_FOLDER, app, `${fileName}.mjs`);
//     console.log('Attempting to load file from path:', filePath);

//     const module = await import(filePath);
//     console.log("this is the module ", module)
//     if (!module.default || !module.default.default || typeof module.default.default !== 'function') {
//       throw new Error(
//         `No default function found in file "${fileName}" for app "${app}".`
//       );
//     }
//      const functionToRun = module.default;
    
//      const result = await functionToRun(token);
//     return result

//   } catch (error) {
//     console.error(`Error logging default function from "${fileName}" for app "${app}":`, error);
//     throw error;
//   }
// };


import path from 'path';
import { pathToFileURL } from 'url';

const APPS_FOLDER = path.resolve(__dirname, '../apps');
const fileName = "dynamicData"
export const getDymanicDataforapp = async (app: string,token:string) => {
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
    const result = await module.default(token);

    return result;
  } catch (error) {
    console.error(`Error logging default function from "${fileName}" for app "${app}":`, error);
    throw error;
  }
};
