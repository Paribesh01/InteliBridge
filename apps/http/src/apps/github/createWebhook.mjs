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
   const repos = await fetchRepos(token)
   console.log("this i the owner")
   console.log(repos[0].owner.login)
   const owner = repos[0].owner.login



   const client = new octokit({ auth: token });
   const response = await client.request(`POST /repos/${owner}/${metaData.dynamicData}/hooks`,{
     owner: owner,
     repo: metaData.dynamicData,
     active: true,
     events: [metaData.subType],
     config: {
       url: `https://3ce0-59-145-142-18.ngrok-free.app/${app}/${zapid}/${userid}`,
       content_type: "json",
       insecure_ssl: "0",
       secret: "FADSFC$#QCTF$#TCG45w gv54WCG%$CG$%WH$%%h",
     },
   });
   console.log( "this is the response ")

   console.log(response)

  } catch (error) {
    console.log("error in the webhook creation",error)
  }
}

export default createWebhook;