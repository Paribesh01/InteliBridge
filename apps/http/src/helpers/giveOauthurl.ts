import path from 'path';

const APPS_FOLDER = path.resolve(__dirname, '..', '..', 'src', 'apps');

export const giveoauthurl = async (app: string, state: string) => {



  try {
    const fileName = 'index'; 
    
    const filePath = path.join(APPS_FOLDER, app, `${fileName}.mjs`); 
    console.log('Attempting to load file from path:', filePath);

    // Dynamically import the file. If you want it to work in Node.js, ensure TypeScript is being compiled
    const module = await import(filePath);
    
    // Check if the module has a default export
    if (!module.default) {
      throw new Error('No default export found in the file');
    }

    const githubRegistry = module.default;

    // Extract the OAuth URL from the registry
    const config = githubRegistry.oauth.authUrl;

    return `${config}&state=${state}`;
  } catch (error) {
    console.error('Error while loading GitHub registry:', error);
    throw error;  // Re-throw to allow further handling or logging in the caller
  }
};
