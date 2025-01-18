import path from "path";

const APPS_FOLDER = path.resolve(__dirname, "..", "..", "src", "apps");

export const getSubTrigger = async (app: string) => {
  try {
    const fileName = "index";

    const filePath = path.join(APPS_FOLDER, app, `${fileName}.mjs`);
    console.log("Attempting to load file from path:", filePath);
    console.log("this is the slack ");

    const module = await import(filePath);
    console.log("this is the slack ", module);

    if (!module.default) {
      throw new Error("No default export found in the file");
    }

    const Registry = module.default;

    return { subTypes: Registry.triggers };
  } catch (error) {
    console.error("Error while loading  registry:", error);
    throw error;
  }
};
