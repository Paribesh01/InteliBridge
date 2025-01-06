import fetchRepos from "./dynamicData.mjs";
let octokit
async function main() {
  const { Octokit } = await import("octokit");
  octokit = Octokit
}
main()
const app ="github"

const createWebhook = async(token,metaData,zapid,userid)=> {
  try {
   const repos = fetchRepos(token)
   const owner = repos[0].owner



   const client = new octokit({ auth: token });
   const response = await client.request(`POST /repos/${owner}/${metaData.dynamicData}/hooks`,{
     owner: owner,
     repo: metaData.dynamicData,
     active: true,
     events: metaData.subType,
     config: {
       url: `https://386d-59-145-142-18.ngrok-free.app/${app}/${zapid}/${userid}`,
       content_type: "json",
       insecure_ssl: "0",
       secret: "FADSFC$#QCTF$#TCG45w gv54WCG%$CG$%WH$%%h",
     },
   });


  } catch (error) {
    if (error.response) {
      console.error(
        `Error: ${error.response.status} - ${error.response.statusText}`
      );
    } else {
      console.error('Error:', error.message);
    }
  }
}

export default createWebhook;
