import axios from "axios";


const url = 'https://api.github.com/user/repos';

const fetchRepos = async(token:string)=> {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    const repos = response.data;
    console.log(repos)
    return repos
  } catch (error:any) {
    if (error.response) {
      console.error(
        `Error: ${error.response.status} - ${error.response.statusText}`
      );
    } else {
      console.error('Error:', error.message);
    }
  }
}

export default fetchRepos;
