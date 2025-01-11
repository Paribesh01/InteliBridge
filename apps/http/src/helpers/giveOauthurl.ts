import path from 'path';

const APPS_FOLDER = path.resolve(__dirname, '..', '..', 'src', 'apps');

export const giveoauthurl = async (app: string, state: string) => {

  try {
    const fileName = 'index'; 
    
    const filePath = path.join(APPS_FOLDER, app, `${fileName}.mjs`); 
    console.log('Attempting to load file from path:', filePath);

    const module = await import(filePath);
    
    if (!module.default) {
      throw new Error('No default export found in the file');
    }

    const githubRegistry = module.default;

    const config = githubRegistry.oauth.authUrl;

    return `${config}&state=${state}`;
  } catch (error) {
    console.error('Error while loading GitHub registry:', error);
    throw error; 
  }
};
