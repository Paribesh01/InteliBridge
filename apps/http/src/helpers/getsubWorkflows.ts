import path from 'path';

const APPS_FOLDER = path.resolve(__dirname, '..', '..', 'src', 'apps');

export const getSubWorkflows = async (app: string) => {



  try {
    const fileName = 'index'; 
    
    const filePath = path.join(APPS_FOLDER, app, `${fileName}.mjs`); 
    console.log('Attempting to load file from path:', filePath);

    const module = await import(filePath);
    
    if (!module.default) {
      throw new Error('No default export found in the file');
    }

    const Registry = module.default;

    return {subTypes:Registry.workflows};


  } catch (error) {
    console.error('Error while loading GitHub registry:', error);
    throw error;  
  }
};
