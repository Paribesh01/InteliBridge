export function getZapStage(zapObj: any): number {
  console.log("dai ho dai", zapObj);
  if (!zapObj.type?.name) return 1;

  if (!zapObj.metaData?.subType) return 2;

  if (!zapObj.accessToken) return 3;

  if (!zapObj.metaData?.dynamicData) return 4;

  return 4;
}
